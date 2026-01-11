import multer from "multer";
import path from "path";

// COURSE UPLOAD
const courseStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/courses");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-");
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage: courseStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// PROFILE IMAGE UPLOAD
const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/user");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});


// VIDEO + NOTE FILES UPLOAD STORAGE
const lectureStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos");
    } else if (file.fieldname === "noteFiles") {
      cb(null, "uploads/notes");
    } else {
      cb(null, "uploads/others");
    }
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const lectureFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
  const MAX_NOTE_SIZE = 100 * 1024 * 1024; // 100 MB

  if (file.fieldname === "video") {
    // Validate video file types
    const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
    if (!allowedVideoTypes.includes(file.mimetype)) {
      return cb(new Error("Only video files (MP4, MPEG, MOV, AVI, MKV) are allowed for video uploads"));
    }
  } else if (file.fieldname === "noteFiles") {
    // Validate note file types
    const allowedNoteTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedNoteTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed for note uploads"));
    }
  }
  
  cb(null, true);
};

export const uploadLectureFiles = multer({
  storage: lectureStorage,
  fileFilter: lectureFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max for video/note files
});
