// Import Dependencies
import mongoose, { model } from 'mongoose';
import { IWalletTransactionDocumentModel } from './wallet-transaction.interface';
const { Schema, SchemaTypes } = mongoose;

// Setup WalletTransaction Schema
const WalletTransactionSchema = new Schema({
  // Amount that was increased or decreased
  amount: Number,

  denom: String,

  // Reason for this wallet transaction
  reason: String,

  // Extra data relating to this transaction
  // game data, crypto transaction data, etc.
  extraData: {
    coinflipGameId: {
      type: SchemaTypes.ObjectId,
      ref: 'CoinflipGame',
    },
    crashGameId: {
      type: SchemaTypes.ObjectId,
      ref: 'CrashGame',
    },
    transactionId: {
      type: SchemaTypes.ObjectId,
      ref: 'CryptoTransaction',
    },
    couponId: {
      type: SchemaTypes.ObjectId,
      ref: 'CouponCode',
    },
    affiliatorId: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    modifierId: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    raceId: {
      type: SchemaTypes.ObjectId,
      ref: 'Race',
    },
    triviaGameId: {
      type: SchemaTypes.ObjectId,
      ref: 'Trivia',
    },
  },

  // What user does this belong to
  _user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },

  // When document was inserted
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model<IWalletTransactionDocumentModel>('WalletTransaction', WalletTransactionSchema);
