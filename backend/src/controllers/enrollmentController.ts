// Student Dashboard Summary
export const dashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return failure(res, "Unauthorized");
    }
    const userId = req.user._id;
    // Get all enrollments for the student
    const enrollments = await enrollmentService.getEnrolledCourses(userId);
    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progressPercent === 100).length;
    // For activity graph: collect progressPercent and lastWatchedAt for each course
    const activity = enrollments.map(e => ({
      courseTitle: e.course?.title || '',
      progressPercent: e.progressPercent || 0,
      lastWatchedAt: e.lastWatchedAt,
    }));
    // Certificates: count courses with 100% progress
    const certificates = completedCourses;
    // Optionally, add streaks/motivation (e.g., number of days with activity)
    // For now, just return the above
    return success(res, "Dashboard summary", {
      totalEnrolled,
      completedCourses,
      certificates,
      activity,
    });
  } catch (error: any) {
    return failure(res, "Server error fetching dashboard summary", error?.message || error);
  }
};
// Tutor/Admin: Unblock a student from a course
export const unblockStudent = async (req: Request, res: Response) => {
  try {
    const { courseId, studentId } = req.params;
    const result = await enrollmentService.unblockStudent(courseId, studentId);
    if (!result) return failure(res, 'Enrollment not found');
    if (!result.isBlocked) return success(res, 'Student was already unblocked for this course');
    return success(res, 'Student has been unblocked for this course');
  } catch (err) {
    return failure(res, 'Failed to unblock student', err);
  }
};
// Tutor/Admin: Block a student from a course (soft delete)
export const blockStudent = async (req: Request, res: Response) => {
  try {
    const { courseId, studentId } = req.params;
    const result = await enrollmentService.blockStudent(courseId, studentId);
    if (!result) return failure(res, 'Enrollment not found');
    if (result.isBlocked) return success(res, 'Student was already blocked from this course');
    return success(res, 'Student has been blocked from this course');
  } catch (err) {
    return failure(res, 'Failed to block student', err);
  }
};
import { Request, Response } from "express";
import * as enrollmentService from "../services/enrollmentService";
import * as courseService from "../services/courseService";
import { success } from "../utils/response";

/* ---------------- ENROLL ---------------- */
export const enroll = async (req: Request, res: Response) => {
  if (!req.user?._id) {
    return failure(res, "Unauthorized");
  }

  const courseId = req.params.courseId;
  const record = await enrollmentService.enroll(req.user._id, courseId);

  // Send enrollment emails to user and tutor
  try {
    const mailer = await import('../utils/mailer');
    const Course = (await import('../models/Course')).default;
    const User = (await import('../models/User')).default;
    // Get course and tutor info
    const course = await Course.findById(courseId).populate('tutor', 'name email');
    const user = await User.findById(req.user._id);
    if (course && user && course.tutor) {
      // Email to user
      await mailer.sendEmail(
        user.email,
        'Enrollment Successful',
        'enroll-user',
        { name: user.name, courseTitle: course.title }
      );
      // Email to tutor
      await mailer.sendEmail(
        course.tutor.email,
        'New Enrollment in Your Course',
        'enroll-tutor',
        { courseTitle: course.title, studentName: user.name, studentEmail: user.email }
      );
    }
  } catch (e) {
    // Optionally log email errors, but do not block enrollment
    console.error('Enrollment email error:', e);
  }
  return success(res, "Enrolled successfully", record);
};

/* ---------------- MY COURSES ---------------- */
export const my = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return failure(res, "Unauthorized");
    }

    const userId = req.user._id;
    const role = req.user.role;

    let data;

    if (role === "STUDENT") {
      // Students only see unblocked enrollments
      data = await enrollmentService.getEnrolledCourses(userId);
    } else if (role === "TUTOR") {
      // Tutors can see all their courses (no change here)
      data = await courseService.getCoursesByTutor(userId);
    } else {
      data = await courseService.listPublished();
    }

    return success(res, "My Courses", data);
  } catch (error: any) {
    return failure(res, "Server error fetching courses", error?.message || error);
  }
};

export const students = async (req: Request, res: Response) => {
  const list = await enrollmentService.studentsInCourse(req.params.courseId);
  return success(res, "Students fetched", list);
};

export const getProgress = async (req: Request, res: Response) => {
  if (!req.user?._id) {
    return failure(res, "Unauthorized");
  }

  const studentId = req.user._id;
  const courseId = req.params.courseId;

  const enrollment = await enrollmentService.getProgress(studentId, courseId);

  if (!enrollment) {
    return failure(res, "Enrollment not found");
  }

  return success(res, "Progress fetched successfully", enrollment);
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return failure(res, "Unauthorized");
    }

    const studentId = req.user._id;
    const courseId = req.params.courseId;
    const { lectureId, completed } = req.body;

    if (!lectureId || typeof completed !== "boolean") {
      return failure(res, "lectureId and completed(boolean) are required");
    }

    const updatedEnrollment =
      await enrollmentService.updateProgress(
        studentId,
        courseId,
        lectureId,
        completed
      );

    return success(res, "Progress updated successfully", updatedEnrollment);
  } catch (error: any) {
    return failure(res, "Server error updating progress", error?.message || error);
  }
};
