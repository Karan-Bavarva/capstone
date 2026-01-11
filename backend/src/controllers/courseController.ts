import { Request, Response } from 'express';
import * as courseService from '../services/courseService';
import { failure, success } from '../utils/response';
import Course from '../models/Course';
import { getVideoDuration } from '../utils/videoDuration';

export const list = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const filters = {
    status: req.query.status,
    published: req.query.published !== undefined ? req.query.published === 'true' : undefined,
    search: req.query.search,
  };
  const courses = await courseService.listPublished(req.user, page,limit,filters);
  return success(
    res,
    'General Course List',
    courses.data,
    courses.pagination
  );
};

export const featureCourses = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const courses = await courseService.listfeatured(page, limit);

  return success(res, 'Feature Course List', courses.data, courses.pagination);
};

export const getOne = async (req: Request, res: Response) => {
  const course = await courseService.getCourse(req.params.id);
  if (!course) return failure(res, 'Not found');
  return success(res, 'Course Details', course);
};

const durationToSeconds = (durationStr: string): number => {
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
};

// -------------------- CREATE COURSE --------------------
export const create = async (req: Request, res: Response) => {
  try {
    const status = req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING';
    const payload: any = {
      ...req.body,
      tutor: req.user._id,
      status,
    };
    if (req.file) {
      // Store relative URL to access uploaded image
      payload.image = `/uploads/courses/${req.file.filename}`;
    }
    // Normalize curriculum: support JSON string, comma-separated string, or array
    if (payload.curriculum) {
      if (typeof payload.curriculum === 'string') {
        try {
          const parsed = JSON.parse(payload.curriculum);
          if (Array.isArray(parsed)) {
            payload.curriculum = parsed.map((c: any) => (typeof c === 'string' ? c.trim() : c));
          } else {
            payload.curriculum = payload.curriculum
              .split(',')
              .map((c: string) => c.trim())
              .filter((c: string) => c.length > 0);
          }
        } catch {
          payload.curriculum = payload.curriculum
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0);
        }
      } else if (Array.isArray(payload.curriculum)) {
        payload.curriculum = payload.curriculum.map((c: any) => (typeof c === 'string' ? c.trim() : c));
      }
    }
    const course = await courseService.createCourse(payload);
    return success(res, 'New Course Created', course);
  } catch (error) {
    console.error(error);
    return failure(res, 'Failed to create course');
  }
};

// -------------------- UPDATE COURSE --------------------
export const update = async (req: Request, res: Response) => {
  try {
    const payload: any = { ...req.body };

    // Example: no conversion to string for curriculum
    if (payload.published !== undefined) {
      payload.published = payload.published === true || payload.published === "true";
    }

    if (payload.is_featured !== undefined) {
      payload.is_featured = payload.is_featured === true || payload.is_featured === "true";
    }

    if (req.file) {
      payload.image = `/uploads/courses/${req.file.filename}`;
    }

    // Ensure curriculum is an array (accept JSON string, comma-separated string, or repeated fields)
    if (payload.curriculum) {
      if (typeof payload.curriculum === 'string') {
        try {
          const parsed = JSON.parse(payload.curriculum);
          if (Array.isArray(parsed)) {
            payload.curriculum = parsed.map((c: any) => (typeof c === 'string' ? c.trim() : c));
          } else {
            payload.curriculum = payload.curriculum.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
          }
        } catch {
          payload.curriculum = payload.curriculum.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
        }
      } else if (Array.isArray(payload.curriculum)) {
        // If client sent a single csv string as the only array element, split it
        if (payload.curriculum.length === 1 && typeof payload.curriculum[0] === 'string' && payload.curriculum[0].includes(',')) {
          payload.curriculum = payload.curriculum[0].split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
        } else {
          payload.curriculum = payload.curriculum.map((c: any) => (typeof c === 'string' ? c.trim() : c));
        }
      }
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, payload, { new: true });

    if (!updated) return failure(res, "Course not found");

    return success(res, "Course updated successfully", updated);
  } catch (error) {
    console.error(error);
    return failure(res, "Failed to update course");
  }
};



// -------------------- DELETE COURSE --------------------
export const remove = async (req: Request, res: Response) => {
  await courseService.deleteCourse(req.params.id);
  return success(res, 'Course deleted', []);
};

// -------------------- ADMIN APPROVE / REJECT --------------------
export const changeStatus = async (req: Request, res: Response) => {
  const updated = await courseService.changeCourseStatus(req.params.id, req.body.status);
  return success(res, 'Course Status updated', updated);
};

// -------------------- LECTURE CRUD --------------------
export const addLecture = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const lectureData: any = { ...req.body };

    // Handle video file (required for add)
    if (req.files && (req.files as any).video?.length > 0) {
      const videoFile = (req.files as any).video[0];
      lectureData.videoUrl = `/uploads/videos/${videoFile.filename}`;
      lectureData.duration = await getVideoDuration(videoFile.path);
    } else {
      return failure(res, "Video file is required");
    }

    // Existing note files (sent from client) - optional for add but keep if present
    let existingNoteFiles: string[] = [];
    if (lectureData.existingNoteFiles) {
      if (typeof lectureData.existingNoteFiles === "string") {
        existingNoteFiles = [lectureData.existingNoteFiles];
      } else if (Array.isArray(lectureData.existingNoteFiles)) {
        existingNoteFiles = lectureData.existingNoteFiles;
      }
    }

    // Newly uploaded note files
    let uploadedNoteFiles: string[] = [];
    if (req.files && (req.files as any).noteFiles?.length > 0) {
      uploadedNoteFiles = (req.files as any).noteFiles.map(
        (file: any) => `/uploads/notes/${file.filename}`
      );
    }

    // Combine existing + newly uploaded note files paths
    lectureData.noteFiles = [...existingNoteFiles, ...uploadedNoteFiles];

    if (!lectureData.title) {
      return failure(res, "Lecture title is required");
    }

    const updated = await courseService.addLecture(courseId, lectureData);
    if (!updated) return failure(res, "Course not found");

    return success(res, "Lecture added", updated.lectures);
  } catch (error: any) {
    console.error("Add lecture error:", error);
    return failure(res, error.message || "Failed to add lecture");
  }
};

export const updateLecture = async (req: Request, res: Response) => {
  try {
    const lectureData: any = { ...req.body };

    // Video file update (optional)
    if (req.files && (req.files as any).video?.length > 0) {
      const videoFile = (req.files as any).video[0];
      lectureData.videoUrl = `/uploads/videos/${videoFile.filename}`;
      lectureData.duration = await getVideoDuration(videoFile.path);
    }

    // Existing note files sent from client (must keep)
    let existingNoteFiles: string[] = [];
    if (lectureData.existingNoteFiles) {
      if (typeof lectureData.existingNoteFiles === "string") {
        existingNoteFiles = [lectureData.existingNoteFiles];
      } else if (Array.isArray(lectureData.existingNoteFiles)) {
        existingNoteFiles = lectureData.existingNoteFiles;
      }
    }

    // Newly uploaded note files
    let uploadedNoteFiles: string[] = [];
    if (req.files && (req.files as any).noteFiles?.length > 0) {
      uploadedNoteFiles = (req.files as any).noteFiles.map(
        (file: any) => `/uploads/notes/${file.filename}`
      );
    }

    // Combine existing + newly uploaded note files paths
    lectureData.noteFiles = [...existingNoteFiles, ...uploadedNoteFiles];

    const updated = await courseService.updateLecture(
      req.params.id,
      req.params.lectureId,
      lectureData
    );

    if (!updated) return failure(res, "Lecture not found");

    return success(res, "Lecture updated", updated.lectures);
  } catch (err: any) {
    console.error("Update lecture error:", err);
    return failure(res, err.message || "Failed to update lecture");
  }
};

export const deleteLecture = async (req: Request, res: Response) => {
  const updated = await courseService.deleteLecture(req.params.id, req.params.lectureId);
  return success(res, 'Course Lectures deleted', updated);
};

export const uploadCourseImage = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const file = req.file;
    if (!file) return failure(res, 'No image uploaded');
    const imagePath = `/uploads/courses/${file.filename}`;
    const course = await Course.findByIdAndUpdate(courseId, { image: imagePath }, { new: true });

    if (!course) return failure(res, 'Course not found');

    return success(res, 'Course image updated', course);
  } catch (err) {
    return failure(res, 'Failed to upload image');
  }
};
