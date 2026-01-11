import User from '../models/User';
import bcrypt from 'bcrypt';

// Main admin creates sub-admin
export const createSubAdmin = async (req: Request, res: Response) => {
  try {
    // Only main admin (not sub-admin) can create sub-admins
    if (!req.user || req.user.role !== 'ADMIN' || req.user.isSubAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only main admin can add sub-admins' });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const subAdmin = await User.create({
      name,
      email,
      password: hashed,
      role: 'ADMIN',
      isSubAdmin: true,
      status: 'ACTIVE',
    });
    return res.status(201).json({ message: 'Sub-admin created', data: subAdmin });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};
import Enrollment from '../models/Enrollment';
// GET /api/admin/dashboard-summary (system-wide, like tutor dashboard)
export const dashboardSummary = async (req: Request, res: Response) => {
  try {
    // All courses
    const courses = await Course.find({});
    const courseIds = courses.map((c) => c._id);

    // All enrollments
    const enrollments = await Enrollment.find({})
      .populate('student', 'name email')
      .populate('course', 'title image price');

    // Students
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const activeStudents = enrollments.filter((e: any) => {
      if (!e.lastWatchedAt) return false;
      const days = (Date.now() - new Date(e.lastWatchedAt).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length;

    // Lectures
    const totalLectures = courses.reduce((sum, c) => sum + (c.lectures?.length || 0), 0);

    // Completion
    const avgCompletion = enrollments.length
      ? Math.round(enrollments.reduce((sum, e: any) => sum + (e.progressPercent || 0), 0) / enrollments.length)
      : 0;

    // Monthly range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


    // Monthly new users for last 12 months
    const months = [];
    const monthlyNewUsersData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const dNext = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
      const count = await User.countDocuments({
        createdAt: { $gte: d, $lt: dNext },
        role: 'STUDENT',
      });
      monthlyNewUsersData.push({ month: d.toLocaleString('default', { month: 'short' }), users: count });
    }
    const monthlyNewUsers = monthlyNewUsersData[11]?.users || 0;
    const monthlyNewCourses = await Course.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Monthly enrollments
    const monthlyEnrollments = await Enrollment.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Top courses by enrollments
    const topCourses = courses
      .map((c: any) => {
        const courseEnrollments = enrollments.filter((e: any) => String(e.course?._id) === String(c._id));
        const enrollmentsCount = courseEnrollments.length;
        const avgCompletion = enrollmentsCount
          ? Math.round(courseEnrollments.reduce((sum, e: any) => sum + (e.progressPercent || 0), 0) / enrollmentsCount)
          : 0;
        return {
          _id: c._id,
          title: c.title,
          enrollments: enrollmentsCount,
          studentsCount: c.studentsCount || 0,
          image: c.image,
          avgCompletion,
        };
      })
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 3);

    // Recent enrollments (last 2 days)
    const last2Start = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const recentTwoDaysEnrollments = enrollments
      .filter((e: any) => e.createdAt >= last2Start && e.createdAt <= now)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((e: any) => ({
        _id: e._id,
        student: e.student,
        course: {
          _id: e.course?._id,
          title: e.course?.title,
          image: e.course?.image,
          price: e.course?.price,
        },
        createdAt: e.createdAt,
      }));

    // Upload streak (system-wide)
    let streak = 0;
    let lastUpload = null;
    const uploads = courses
      .flatMap((c: any) => [c.createdAt, ...(c.lectures?.map((l: any) => l.createdAt) || [])])
      .filter(Boolean)
      .map((d) => new Date(d).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);
    if (uploads.length) {
      let current = uploads[0];
      streak = 1;
      for (let i = 1; i < uploads.length; i++) {
        if (uploads[i] === current - 86400000) {
          streak++;
          current = uploads[i];
        } else break;
      }
      lastUpload = new Date(uploads[0]);
    }

    return success(res, 'Admin dashboard summary', {
      kpis: {
        totalCourses: courses.length,
        totalStudents,
        activeStudents,
        totalLectures,
        avgCompletion,
        monthlyNewUsers,
        monthlyNewCourses,
        monthlyEnrollments,
        streak,
        recentTwoDaysEnrollmentsCount: recentTwoDaysEnrollments.length,
      },
      topCourses,
      recentEnrollments: recentTwoDaysEnrollments,
      lastUpload,
      monthlyNewUsersData,
    });
  } catch (err) {
    return failure(res, 'Failed to fetch dashboard summary', err);
  }
};
import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import { failure, success } from '../utils/response';
import { paginate } from '../utils/paginate';
import { log } from '../utils/logger';
import { Op } from 'sequelize';

export const listUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 2;

  const search = req.query.search as string;
  const role = req.query.role as string;
  const status = req.query.status as string;

  const filter: any = {};
  if (search) {
    filter.$or = [
      { first_name: { $regex: search, $options: 'i' } },
      { last_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }

  const result = await paginate({
    model: User,
    page,
    limit,
    filter,
    sort: { createdAt: -1 },
  });
  return success(res, 'User data fetched', result.data, result?.pagination);
};

export const userDetails = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  return success(res, 'User Details', user);
};

export const changeStatus = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  return success(res, 'User status updated', user);
};

export const changeRole = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });

  return success(res, 'User role updated', user);
};

export const listCourses = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await paginate({
    model: Course,
    page,
    limit,
    sort: { createdAt: -1 },
  });
  return success(res, 'Course Lists', result?.data, result?.pagination);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.findOneAndDelete({ _id: req.params.id });

  return success(res, 'User deleted successfully', []);
};

export const approveCourse = async (req: Request, res: Response) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { published: true }, { new: true });

  return success(res, 'Course approved', course);
};

export const createTutor = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  const tutor = await User.create({
    first_name,
    last_name,
    email,
    password,
    role: 'TUTOR',
    status: 'ACTIVE',
  });

  return success(res, 'Tutor created successfully', tutor);
};

export const updateTutor = async (req: Request, res: Response) => {
  const tutor = await User.findOneAndUpdate({ _id: req.params.id, role: 'TUTOR' }, req.body, {
    new: true,
  });

  return success(res, 'Tutor updated successfully', tutor);
};

export const listTutors = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const status = req.query.status as string;

  const filter: any = { role: 'TUTOR' }; // Only Tutors

  if (search) {
    filter.$or = [
      { first_name: { $regex: search, $options: 'i' } },
      { last_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const result = await paginate({
    model: User,
    page,
    limit,
    filter,
    sort: { createdAt: -1 },
  });

  return success(res, 'Tutor list fetched', result.data, result.pagination);
};

export const getUserKyc = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("name email kyc");
  if (!user) return failure(res, "User not found");

  return success(res, "KYC fetched", user);
};

export const approveKyc = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return failure(res, "User not found");

  user.kyc.status = "APPROVED";
  user.status = "ACTIVE";
  user.kyc.reviewedAt = new Date();

  await user.save();
  return success(res, "KYC approved", user);
};

export const rejectKyc = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return failure(res, "User not found");

  user.kyc.status = "REJECTED";
  user.status = "REJECTED";
  user.kyc.reviewedAt = new Date();

  await user.save();
  return success(res, "KYC rejected", user);
};

