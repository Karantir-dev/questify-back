const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        delete ret.phone
        return ret
      },
    },
  },
)

contactSchema.path('email').validate(value => {
  const re = /\S+@\S+\.\S+/
  return re.test(String(value).toLowerCase())
})

contactSchema.virtual('mobile').get(function () {
  return `${this.phone}`
})

contactSchema.plugin(mongoosePaginate)

const Contact = model('contact', contactSchema)

module.exports = Contact
