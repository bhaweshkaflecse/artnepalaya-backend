import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
    file.isAppVideo = false; cb(null, true);
  } else if (['video/mp4', 'video/quicktime'].includes(file.mimetype)) {
    file.isAppVideo = true; cb(null, true);
  } else {
    cb(Object.assign(new Error('Only JPG, PNG, WEBP, MP4, and MOV allowed'), { status: 400 }), false);
  }
};

export const secureUpload = multer({
  storage, fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 3 }
});

export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return next(Object.assign(new Error('File is too large'), { status: 400 }));
    if (err.code === 'LIMIT_FILE_COUNT') return next(Object.assign(new Error('Maximum 3 files allowed'), { status: 400 }));
  }
  next(err);
};