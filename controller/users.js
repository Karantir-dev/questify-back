const UserSchema = require('../model/schemas/user.js');
const HttpCode = require('../helpers/constants.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const {
  createUser,
  dbUpdateAvatar,
  findByVerificationToken,
  updateVerificationStatus,
} = require('../model/users');
// const mailgenService = require('../services/mailgenService');

const registration = async (req, res, next) => {
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(HttpCode.CONFLICT).json({
      status: `${HttpCode.CONFLICT} Conflict`,
      message: 'Email in use',
    });
  }
  try {
    const newUser = await createUser(req.body);
    // const { email, verificationToken, name } = newUser;
    // try {
    //   const emailService = new mailgenService(process.env.NODE_ENV);
    //   await emailService.sendVerificationLetter(verificationToken, email, name);
    // } catch (e) {
    //   // logger
    //   console.log(e.message);
    // }
    return res.status(HttpCode.CREATED).json({
      status: `${HttpCode.CREATED} Created`,
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await UserSchema.findOne({ email });
    const isValidPassword = await foundUser?.isValidPassword(password);
    if (!foundUser || !isValidPassword /*|| !foundUser.verified*/) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: `${HttpCode.UNAUTHORIZED} Unauthorized`,
        message: 'Email or password is wrong',
      });
    }

    const payload = { id: foundUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });
    await UserSchema.updateOne({ _id: foundUser.id }, { token });

    return res.status(HttpCode.OK).json({
      status: `${HttpCode.OK} OK`,
      token,
      user: {
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user?.id;
  await UserSchema.updateOne({ _id: userId }, { token: null });
  return res.status(HttpCode.NO_CONTENT).json({
    status: `${HttpCode.NO_CONTENT} No Content`,
  });
};

const getCurrentUser = async (req, res, next) => {
  return res.status(HttpCode.OK).json({
    status: `${HttpCode.OK} OK`,
    user: {
      email: req.user.email,
      name: req.user.name,
    },
  });
};

const updateSubscr = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const updatedUser = await UserSchema.findOneAndUpdate(
      { _id: userId },
      { subscription: req.body.subscription },
      { new: true }
    );

    return res.status(HttpCode.OK).json({
      status: `${HttpCode.OK} OK`,
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  try {
    const avatarURL = await saveUserAvatar(req);
    await dbUpdateAvatar(id, avatarURL);

    return res.status(HttpCode.OK).json({
      status: `${HttpCode.OK} OK`,
      avatarURL: avatarURL,
    });
  } catch (err) {
    console.log(err.message);
  }
};

const saveUserAvatar = async (req) => {
  const filePath = req.file.path;

  const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`;
  await jimp
    .read(filePath)
    .then((img) => {
      img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
        )
        .write(filePath);
    })
    .catch((err) => console.log(err.message));

  await fs.rename(
    filePath,
    path.join(process.cwd(), 'public/avatars', newAvatarName)
  );

  const oldAvatarURL = req.user.avatarURL;
  if (oldAvatarURL.includes('avatars/')) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatarURL));
  }

  return path.join('avatars', newAvatarName).replace('\\', '/');
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await findByVerificationToken(req.params.token);
    if (user) {
      await updateVerificationStatus(user.id, true);
      return res.status(HttpCode.OK).json({
        status: `${HttpCode.OK} OK`,
        message: 'Verification successful',
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: `${HttpCode.NOT_FOUND} Not Found`,
      message: 'User not found',
    });
  } catch (err) {
    next(err);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (user.verified) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: `${HttpCode.BAD_REQUEST} Bad Request`,
        message: 'Verification has already been passed',
      });
    }

    const { verifyTokenEmail, email } = user;
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendVerificationLetter(verifyTokenEmail, email);
    return res.status(HttpCode.OK).json({
      status: `${HttpCode.OK} Ok`,
      message: 'Verification email sent',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscr,
  updateAvatar,
  verifyEmail,
  repeatEmailVerification,
};
