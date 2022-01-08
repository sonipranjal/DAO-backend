import mongoose from 'mongoose';
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
    },
    discord_username: {
      type: String,
      unique: true,
      required: false,
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
