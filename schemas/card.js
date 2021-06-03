const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')
const { Difficulty, Category } = require('../helpers/constants')

const cardSchema = new Schema(
  {
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    isChallenge: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: {
        values: [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD],
        message: "Isn't allowed",
      },
      default: Difficulty.NORMAL,
    },
    category: {
      type: String,
      enum: {
        values: [
          Category.STUFF,
          Category.FAMILY,
          Category.HEALTH,
          Category.LEARNING,
          Category.LEISURE,
          Category.WORK,
        ],
        message: "Isn't allowed",
      },
      required: [true, 'Category is required'],
    },
    deadline: {
      type: Date,
      require: [true, 'Please set deadline'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

cardSchema.plugin(mongoosePaginate)

const Card = model('card', cardSchema)

module.exports = Card
