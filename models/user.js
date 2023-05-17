import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "User name is required"],
    },
    email: {
      type: String,
      required: ["true", "User email is required"],
      unique: ["true", "User email already exists"],
    },
    password: {
      type: String,
      required: ["true", "User password is required"],
    },
    phone: {
      type: String,
      required: ["true", "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    street: {
      type: String,
      default: "",
    },
    apartment: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

export default User;
