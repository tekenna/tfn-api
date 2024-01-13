const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "first name required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

module.exports = mongoose.model("User", userSchema);
