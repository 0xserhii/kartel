// Import Dependencies
import mongoose, { model } from 'mongoose';
import { IPaymentDocumentType } from './payment.interface';

// Destructure Schema Types
const { Schema } = mongoose;

// Setup Payment Schema
const PaymentSchema = new Schema<IPaymentDocumentType>({
  // Authentication related fields
  userId: { type: String },
  walletAddress: { type: String },
  type: { type: String },
  amount: { type: Number },
  txHash: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IPaymentDocumentType>('Payment', PaymentSchema);
