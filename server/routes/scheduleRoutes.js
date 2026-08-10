import express from "express";
import Schedule from "../models/Schedule.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ scheduleRoutes.js loaded");

/*
|--------------------------------------------------------------------------
| GET ALL SCHEDULES
|--------------------------------------------------------------------------
| Protected
| Only logged-in doctor can see their schedule.
|--------------------------------------------------------------------------
*/

router.get("/", protect, async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const schedules = await Schedule.find({
      doctorId: doctorId,
    }).sort({
      day: 1,
    });

    return res.status(200).json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.error(
      "GET SCHEDULE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch schedule.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE SCHEDULE
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      console.log(
        "SCHEDULE BODY:",
        req.body
      );

      console.log(
        "DOCTOR:",
        req.doctor
      );

      const {
        day,
        startTime,
        endTime,
        isAvailable,
      } = req.body || {};

      /*
      |--------------------------------------------------------------------------
      | Doctor ID comes from JWT
      |--------------------------------------------------------------------------
      */

      const doctorId = req.doctor.id;

      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message:
            "Doctor ID not found in token.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      if (!day) {
        return res.status(400).json({
          success: false,
          message: "Day is required.",
        });
      }

      if (!startTime) {
        return res.status(400).json({
          success: false,
          message:
            "Start time is required.",
        });
      }

      if (!endTime) {
        return res.status(400).json({
          success: false,
          message:
            "End time is required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Check time
      |--------------------------------------------------------------------------
      */

      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message:
            "End time must be after start time.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Find existing schedule
      |--------------------------------------------------------------------------
      */

      let schedule =
        await Schedule.findOne({
          doctorId,
          day,
        });

      /*
      |--------------------------------------------------------------------------
      | UPDATE EXISTING
      |--------------------------------------------------------------------------
      */

      if (schedule) {
        schedule.startTime =
          startTime;

        schedule.endTime =
          endTime;

        schedule.isAvailable =
          isAvailable === true;

        await schedule.save();

        return res.status(200).json({
          success: true,
          message:
            "Schedule updated successfully.",
          schedule,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE NEW
      |--------------------------------------------------------------------------
      */

      schedule =
        await Schedule.create({
          doctorId,
          day,
          startTime,
          endTime,
          isAvailable:
            isAvailable === true,
        });

      return res.status(201).json({
        success: true,
        message:
          "Schedule created successfully.",
        schedule,
      });
    } catch (error) {
      console.error(
        "SAVE SCHEDULE ERROR:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Duplicate key protection
      |--------------------------------------------------------------------------
      */

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "A schedule for this day already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to save schedule.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE SCHEDULE
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const doctorId =
        req.doctor.id;

      const schedule =
        await Schedule.findOneAndDelete({
          _id: req.params.id,
          doctorId,
        });

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message:
            "Schedule not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Schedule deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE SCHEDULE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to delete schedule.",
      });
    }
  }
);

export default router;