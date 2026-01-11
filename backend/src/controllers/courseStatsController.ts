import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import User from '../models/User';
import { success, failure } from '../utils/response';

// Get course details, enrolled users, and user watch time
export const getCourseDetailsWithStats = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate('tutor').lean();
    if (!course) return failure(res, 'Course not found');

    // Show all enrollments to tutors/admins, only unblocked to students
    let enrollments;
    if (req.user.role === 'ADMIN' || (req.user.role === 'TUTOR' && String(course.tutor._id) === String(req.user._id))) {
      enrollments = await Enrollment.find({ course: courseId })
        .populate('student', 'name email avatar')
        .lean();
    } else {
      enrollments = await Enrollment.find({ course: courseId, isBlocked: { $ne: true } })
        .populate('student', 'name email avatar')
        .lean();
    }

    // Map enrolled users and their watch/progress info, include isBlocked
    const enrolledUsers = enrollments.map((enroll) => ({
      student: enroll.student,
      progress: enroll.progress,
      completedLectures: enroll.completedLectures,
      progressPercent: enroll.progressPercent,
      lastWatchedAt: enroll.lastWatchedAt,
      isBlocked: enroll.isBlocked || false,
    }));

    // Calculate insights
    const registeredUsers = enrolledUsers.length;
    // Sum all timeSpent from all enrollments' progress arrays
    let totalWatchTime = 0;
    enrollments.forEach((enroll) => {
      if (Array.isArray(enroll.progress)) {
        enroll.progress.forEach((prog) => {
          totalWatchTime += prog.timeSpent || 0;
        });
      }
    });

    // For admin, return all details; for tutor, only their course
    if (req.user.role === 'ADMIN' || (req.user.role === 'TUTOR' && String(course.tutor._id) === String(req.user._id))) {
      return success(res, 'Course details with enrolled users and insights', {
        course,
        enrolledUsers,
        registeredUsers,
        totalWatchTime,
      });
    } else {
      return failure(res, 'Unauthorized');
    }
  } catch (err) {
    return failure(res, 'Failed to fetch course details');
  }
};
