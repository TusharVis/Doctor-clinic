import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // LOGIN EMAIL
    // This email is used ONLY for doctor login.
    // =====================================================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // LOGIN PASSWORD
    // Always store hashed password.
    // =====================================================
    password: {
      type: String,
      required: true,
    },

    // =====================================================
    // PUBLIC PROFILE EMAIL
    // This email can be changed without changing login email.
    // =====================================================
    publicEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    clinicAddress: {
      type: String,
      default: "",
      trim: true,
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;