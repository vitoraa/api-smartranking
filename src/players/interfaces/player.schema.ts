import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phone: String,
    email: String,
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhoto: String,
  },
  { timestamps: true, collection: 'players' },
);
