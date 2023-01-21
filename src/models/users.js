const mongoose = require("mongoose");

const users_schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter the valid EMAIL!",
      },
      required: [true, "Email is required"],
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
    is_delete: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);
users_schema.methods.toJSON = function () {
  const users = this;
  const users_object = users.toObject();
  delete users_object.password;
  delete users_object.token;

  return users_object;
};

const USERS = new mongoose.model("users", users_schema);

module.exports = USERS;
