const cloudinary = require('cloudinary').v2
const { promisify } = require('util')
const fs = require('fs/promises')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_CLOUD_KEY,
  api_secret: process.env.API_CLOUD_SECRET,
})

const uploadToCloud = promisify(cloudinary.uploader.upload)

const saveAvatarUserCloud = async req => {
  const pathFile = req.file.path
  const { public_id: idCloudAvatar, secure_url: avatarUrl } =
    await uploadToCloud(pathFile, {
      public_id: req.user.idCloudAvatar?.replace('GoIT23-images/', ''),
      folder: 'GoIT23-images',
      transformation: { width: 250, height: 250, crop: 'pad' },
    })
  await fs.unlink(pathFile)
  return { idCloudAvatar, avatarUrl }
}

module.exports = {
  saveAvatarUserCloud,
}
