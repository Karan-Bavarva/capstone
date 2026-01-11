import Course from '../models/Course';
import { paginate } from '../utils/paginate';

export const listPublished = async (
  user: any,
  page = 1,
  limit = 10,
  filters: { status?: string; published?: boolean; search?: string } = {}
) => {
  const filter: Record<string, any> = {};

  if (!user || user.role !== 'ADMIN') {
    filter.status = 'APPROVED';
  } else if (filters.status) {
    filter.status = filters.status;
  }
  if (filters.published !== undefined) {
    filter.published = filters.published;
  }
  if (filters.search) {
    filter.title = { $regex: filters.search, $options: 'i' };
  }
  return await paginate({
    model: Course,
    page,
    limit,
    filter,
    sort: { createdAt: -1 },
    populate: 'tutor',
  });
};

export const listfeatured = async (page = 1, limit = 10) => {
  limit = 3;
  return await paginate({
    model: Course,
    page,
    limit,
    filter: { status: 'APPROVED', is_featured: true },
    sort: { createdAt: -1 },
    populate: 'tutor',
  });
};

export const getCourse = async (id: string) => {
  return await Course.findById(id).populate('tutor');
};

// -------------------- COURSE CRUD --------------------
export const createCourse = async (payload: any) => {
  return await Course.create(payload);
};

export const updateCourse = async (id: string, payload: any) => {
  return await Course.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCourse = async (id: string) => {
  return await Course.findByIdAndDelete(id);
};

export const changeCourseStatus = async (id: string, status: string) => {
  return await Course.findByIdAndUpdate(id, { status }, { new: true });
};

export const getCoursesByTutor = async (tutorId: string) => {
  return await Course.find({ tutor: tutorId }).populate('tutor');
};

export const addLecture = async (courseId: string, lecture: any) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  course.lectures.push(lecture);
  course.totalDuration = course.lectures.reduce((sum, lec: any) => sum + (lec.duration || 0), 0);

  return await course.save();
};

export const updateLecture = async (courseId: string, lectureId: string, lecture: any) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  const index = course.lectures.findIndex((lec: any) => lec._id.toString() === lectureId);
  if (index === -1) return null;

  course.lectures[index] = {
    ...course.lectures[index].toObject(),
    ...lecture,
  };

  course.totalDuration = course.lectures.reduce(
    (sum: number, lec: any) => sum + (lec.duration || 0),
    0
  );

  return await course.save();
};

export const deleteLecture = async (courseId: string, lectureId: string) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  course.lectures = course.lectures.filter((lec: any) => lec._id.toString() !== lectureId);
  course.totalDuration = course.lectures.reduce((sum: number, lec: any) => sum + lec.duration, 0);
  return await course.save();
};
