const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    votes: {
      type: [Number],
      default: [],
    },
    voters: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        choice: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);