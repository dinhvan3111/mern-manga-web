const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatarUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  role: {
    type: Number,
    enum: [0, 1, 2, -1],
  },
});

module.exports = mongoose.model("users", UserSchema);
