import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }
});
