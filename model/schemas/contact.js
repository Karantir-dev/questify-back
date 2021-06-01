const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model, SchemaTypes } = mongoose;

const contact = new Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30 },
    email: { type: String },
    phoneNumber: { type: String },
    favourite: { type: Boolean, default: false },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);

contact.plugin(mongoosePaginate);

const Contact = model('contact', contact);

module.exports = Contact;
