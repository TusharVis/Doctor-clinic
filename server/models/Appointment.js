import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  {
    date: 1,
    time: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: ["Pending", "Confirmed"],
      },
    },
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;