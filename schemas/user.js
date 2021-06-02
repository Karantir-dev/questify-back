const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { Subscribe, SALT_FACTOR } = require('../helpers/constants')
const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'NONAME',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: {
        values: [Subscribe.START, Subscribe.PROFESSIONAL, Subscribe.BUSINESS],
        message: "Isn't allowed",
      },
      default: Subscribe.START,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyTokenEmail: {
      type: String,
      required: true,
      default: nanoid(),
    },
  },
  { versionKey: false, timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.path('email').validate(value => {
  const re = /\S+@\S+\.\S+/
  return re.test(String(value).toLowerCase())
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
