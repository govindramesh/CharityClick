import mongoose from "mongoose";
import mongodb from "..";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  angels: { type: Boolean, default: false },
  hope: { type: Boolean, default: false },
  rainn: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },

  transactions: [
    {
      id: { type: String, required: true },
      amount: Number,
      date: Date,
      charity: String,
      platform: String,
    },
  ],
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
