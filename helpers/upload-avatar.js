const multer = require('multer');
const path = require('path');
const UPLOAD_DIR = path.join(process.cwd(), '/tmp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limmits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }

    const err = new Error('File type must be image.');
    err.code = 400;
    err.status = 'Bad Request';
    cb(err);
  },
});

module.exports = upload;
