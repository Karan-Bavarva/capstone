export const unblockStudent = async (courseId: string, studentId: string) => {
  // Set isBlocked to false
  return Enrollment.findOneAndUpdate(
    { course: courseId, student: studentId },
    { isBlocked: false },
    { new: true }
  );
};
export const blockStudent = async (courseId: string, studentId: string) => {
  // Soft delete: set isBlocked to true
  return Enrollment.findOneAndUpdate(
    { course: courseId, student: studentId },
    { isBlocked: true },
    { new: true }
  );
};
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";

export const enroll = async (studentId: string, courseId: string) => {
  const exists = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (exists) return exists;

  return await Enrollment.create({
    student: studentId,
    course: courseId,
  });
};

export const getEnrolledCourses = async (studentId: string, includeBlocked = false) => {
  const filter: any = { student: studentId };
  if (!includeBlocked) filter.isBlocked = { $ne: true };
  const enrollments = await Enrollment.find(filter).populate("course");
  return enrollments;
};

export const studentsInCourse = async (courseId: string) => {
  return Enrollment.find({ course: courseId })
    .populate("student", "name email");
};

export const getProgress = async (studentId: string, courseId: string) => {
  return Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
};

export const updateProgress = async (
  studentId: string,
  courseId: string,
  lectureId: string,
  completed: boolean
) => {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const progressItem = enrollment.progress.find(
    p => p.lectureId.toString() === lectureId
  );

  if (progressItem) {
    progressItem.completed = completed;
    progressItem.updatedAt = new Date();
  } else {
    enrollment.progress.push({
      lectureId,
      completed,
      updatedAt: new Date(),
    });
  }

  const course = await Course.findById(courseId).select("lectures");

  const totalLectures = course?.lectures?.length || 1;
  const completedLectures = enrollment.progress.filter(p => p.completed).length;

  enrollment.completedLectures = completedLectures;
  enrollment.progressPercent = Math.round(
    (completedLectures / totalLectures) * 100
  );

  enrollment.lastWatchedAt = new Date();

  await enrollment.save();

  return enrollment;
};
