import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

scheduleSchema.index(
  {
    doctorId: 1,
    day: 1,
  },
  {
    unique: true,
  }
);

const Schedule = mongoose.model(
  "Schedule",
  scheduleSchema
);

export default Schedule;