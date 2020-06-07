import mongoose from 'mongoose';

export type RefreshTokenDocument = mongoose.Document & {
  tokenId: string;
  userId: string;
};

const refreshTokenSchema = new mongoose.Schema({
  tokenId: String,
  userId: String,
}, { timestamps: true });

export const RefreshTokenMongo = mongoose.model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
