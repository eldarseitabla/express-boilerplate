import mongoose from 'mongoose';

export type RefreshTokenDocument = mongoose.Document & {
  token: string;
  userId: string;
};

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  userId: String,
}, { timestamps: true });

export const RefreshTokenMongo = mongoose.model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
