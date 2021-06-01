const UserSchema = require('./schemas/user.js');

const createUser = async (userOptions) => {
  const user = new UserSchema(userOptions);
  return await user.save();
};

const dbUpdateAvatar = async (id, avatarURL) => {
  return await UserSchema.updateOne({ _id: id }, { avatarURL });
};

const findUser = async (id) => {
  return await UserSchema.findOne({ _id: id });
};

const findByVerificationToken = async (token) => {
  return await UserSchema.findOne({ verificationToken: token });
};

const updateVerificationStatus = async (id, status) => {
  return await UserSchema.updateOne(
    { _id: id },
    { verified: status, verificationToken: null }
  );
};

module.exports = {
  createUser,
  dbUpdateAvatar,
  findUser,
  findByVerificationToken,
  updateVerificationStatus,
};
