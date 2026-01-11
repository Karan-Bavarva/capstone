import { Request, Response } from "express";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";

// Helper: get current month range
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

// Helper: get last 2 days range
function getLastTwoDaysRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 2);
  return { start, end };
}

// Helper: random motivational quotes
const MOTIVATIONAL_QUOTES = [
  "Consistency is the key to success!",
  "Every lecture you upload helps a student grow.",
  "Your knowledge is making a difference!",
  "Keep going, your next milestone is near!",
  "Great tutors inspire great minds.",
];
function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

// GET /api/tutor/dashboard
export const getTutorDashboard = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user?._id;
    if (!tutorId) {
      return failure(res, "Unauthorized");
    }

    // Courses by tutor
    const courses = await Course.find({ tutor: tutorId });
    const courseIds = courses.map((c) => c._id);

    // Enrollments (populate student + course)
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email")
      .populate("course", "title image price");

    // Students
    const totalStudents = enrollments.length;
    const activeStudents = enrollments.filter((e: any) => {
      if (!e.lastWatchedAt) return false;
      const days =
        (Date.now() - new Date(e.lastWatchedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length;

    // Lectures
    const totalLectures = courses.reduce(
      (sum, c) => sum + (c.lectures?.length || 0),
      0
    );

    // Completion
    const avgCompletion = enrollments.length
      ? Math.round(
          enrollments.reduce(
            (sum, e: any) => sum + (e.progressPercent || 0),
            0
          ) / enrollments.length
        )
      : 0;

    // Earnings - Commented out (all courses are free for now)
    // const totalEarnings = courses.reduce(
    //   (sum, c) => sum + (c.price || 0) * (c.studentsCount || 0),
    //   0
    // );
    const totalEarnings = 0;

    const { start, end } = getMonthRange();
    // const monthlyEarnings = enrollments.filter(
    //   (e: any) => e.createdAt >= start && e.createdAt <= end
    // ).length;
    const monthlyEarnings = 0;

    // Monthly uploads
    const monthlyCourses = courses.filter(
      (c: any) => c.createdAt >= start && c.createdAt <= end
    ).length;

    const monthlyLectures = courses.reduce((sum, c) => {
      if (!c.lectures) return sum;
      return (
        sum +
        c.lectures.filter(
          (l: any) => l.createdAt >= start && l.createdAt <= end
        ).length
      );
    }, 0);

    // Top courses
    const topCourses = courses
      .map((c) => {
        const courseEnrollments = enrollments.filter(
          (e: any) => String(e.course?._id) === String(c._id)
        );
        const enrollmentsCount = courseEnrollments.length;
        const avgCompletion = enrollmentsCount
          ? Math.round(
              courseEnrollments.reduce(
                (sum, e: any) => sum + (e.progressPercent || 0),
                0
              ) / enrollmentsCount
            )
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

    // Recent 2 days enrollments with course details
    const { start: last2Start, end: last2End } = getLastTwoDaysRange();
    const recentTwoDaysEnrollments = enrollments
      .filter(
        (e: any) =>
          e.createdAt >= last2Start && e.createdAt <= last2End
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((e: any) => ({
        _id: e._id,
        student: e.student,
        course: {
          _id: e.course?._id,
          title: e.course?.title,
          image: e.course?.image,
          // price: e.course?.price, // Commented out - all courses are free
        },
        createdAt: e.createdAt,
      }));

    // Upload streak
    let streak = 0;
    let lastUpload = null;

    const uploads = courses
      .flatMap((c: any) => [
        c.createdAt,
        ...(c.lectures?.map((l: any) => l.createdAt) || []),
      ])
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

    return res.status(200).json({
      meta: {
        status: true,
        message: "Tutor dashboard fetched successfully",
      },
      data: {
        kpis: {
          totalCourses: courses.length,
          totalStudents,
          activeStudents,
          totalLectures,
          avgCompletion,
          totalEarnings,
          monthlyEarnings,
          monthlyCourses,
          monthlyLectures,
          streak,
          recentTwoDaysEnrollmentsCount: recentTwoDaysEnrollments.length,
        },
        topCourses,
        recentEnrollments: recentTwoDaysEnrollments,
        motivationalTip: getRandomQuote(),
        lastUpload,
      },
    });
  } catch (err) {
    return res.status(500).json({
      meta: { status: false, message: "Server error" },
      data: null,
      error: err,
    });
  }
};
