import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  user: mongoose.Types.ObjectId;
  otp: string;
  expires: number;
}

const OtpSchema: Schema<IOtp> = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  expires: { type: Number, required: true }
});

OtpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
