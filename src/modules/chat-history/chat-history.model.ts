// Import Dependencies
import mongoose, { SchemaTypes, model } from 'mongoose';
import { IChatHistoryDocument } from './chat-history.interface';

// Destructure Schema Types
const { Schema } = mongoose;

// Setup Race Schema
const ChatHistorySchema = new Schema({
  // Basic fields
  message: String,

  // Sender
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },

  // When this chat history was created
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IChatHistoryDocument>('ChatHistory', ChatHistorySchema);
