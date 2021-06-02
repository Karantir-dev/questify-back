const multer = require('multer')
const path = require('path')

require('dotenv').config()

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      return
    }
    const err = new Error('File is not an image')
    err.code = 400
    err.status = 'error'
    err.data = 'Bad request'
    cb(err)
  },
})

module.exports = upload
