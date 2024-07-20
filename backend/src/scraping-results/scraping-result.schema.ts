import * as mongoose from 'mongoose';

export const ScrapingResultSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  keyword: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keywords',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
