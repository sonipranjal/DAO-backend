import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: false,
    },
    nonce: {
      type: Number,
      default: Math.floor(Math.random() * 10000),
    },
    publicAddress: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: false,
      default: uuidv4(),
    },
    discord_username: {
      type: String,
      unique: true,
      required: false,
      default: uuidv4(),
    },
    about: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
