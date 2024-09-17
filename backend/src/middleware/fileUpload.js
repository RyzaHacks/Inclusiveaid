// src/middleware/fileUpload.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5000000; // 5MB default
const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || 'jpeg,jpg,png,gif,pdf').split(',');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const userId = req.user ? req.user.id : 'anonymous';
    const uniqueFilename = `${userId}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = async (req, file, cb) => {
  try {
    const fileTypeModule = await import('file-type');
    const buffer = file.buffer;
    if (!buffer) {
      // If buffer is not available, fallback to checking file extension
      const ext = path.extname(file.originalname).toLowerCase().slice(1);
      if (ALLOWED_FILE_TYPES.includes(ext)) {
        return cb(null, true);
      }
    } else {
      const fileTypeResult = await fileTypeModule.fileTypeFromBuffer(buffer);
      if (fileTypeResult && ALLOWED_FILE_TYPES.includes(fileTypeResult.ext)) {
        return cb(null, true);
      }
    }
    cb(new Error('File type not allowed'), false);
  } catch (error) {
    console.error('File type check error:', error);
    cb(new Error('Error checking file type'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter
});

module.exports = upload;