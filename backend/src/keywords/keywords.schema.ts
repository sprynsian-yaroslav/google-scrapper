import * as mongoose from 'mongoose';

export const KeywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isScheduled: {
    type: Boolean,
    default: false,
  },
  isCheck: {
    type: Boolean,
    default: false,
  },
  lastCheckAt: {
    type: Date,
    default: null,
  },
  results: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScrapingResults',
    },
  ],
});
