import express from "express";
import Appointment from "../models/Appointment.js";
import Schedule from "../models/Schedule.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ appointmentRoutes.js loaded");

/*
|--------------------------------------------------------------------------
| CREATE APPOINTMENT
|--------------------------------------------------------------------------
| PUBLIC
|
| Patients do not need doctor login.
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      phone,
      date,
      time,
      reason,
    } = req.body;

    // Validate required fields
    if (
      !patientName ||
      !age ||
      !gender ||
      !phone ||
      !date ||
      !time ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields.",
      });
    }

    // Validate age
    if (
      Number(age) < 1 ||
      Number(age) > 120
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Age must be between 1 and 120.",
      });
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10-digit mobile number.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check if slot already booked
    |--------------------------------------------------------------------------
    */

    const existingAppointment =
      await Appointment.findOne({
        date,
        time,
        status: {
          $in: [
            "Pending",
            "Confirmed",
          ],
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create appointment
    |--------------------------------------------------------------------------
    */

    const appointment =
      await Appointment.create({
        patientName:
          patientName.trim(),

        age: Number(age),

        gender,

        phone,

        date,

        time,

        reason: reason.trim(),

        status: "Pending",
      });

    return res.status(201).json({
      success: true,
      message:
        "Appointment created successfully.",

      appointment,
    });
  } catch (error) {
    console.error(
      "Create appointment error:",
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
          "This time slot is already booked.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating appointment.",
    });
  }
});


/*
|--------------------------------------------------------------------------
| CHECK PATIENT APPOINTMENT STATUS
|--------------------------------------------------------------------------
| PUBLIC
|
| Patient enters the mobile number used during booking.
|
| GET /api/appointments/patient/status?phone=XXXXXXXXXX
|--------------------------------------------------------------------------
*/

router.get(
  "/patient/status",
  async (req, res) => {
    try {
      const { phone } = req.query;

      /*
      |--------------------------------------------------------------------------
      | Validate phone
      |--------------------------------------------------------------------------
      */

      if (!phone) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number is required.",
        });
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10-digit mobile number.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Find appointments
      |--------------------------------------------------------------------------
      */

      const appointments =
        await Appointment.find({
          phone,
        }).sort({
          date: -1,
          time: 1,
          createdAt: -1,
        });

      /*
      |--------------------------------------------------------------------------
      | No appointment
      |--------------------------------------------------------------------------
      */

      if (appointments.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No appointment found with this mobile number.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Return appointments
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        message:
          "Appointments found successfully.",

        appointments,
      });
    } catch (error) {
      console.error(
        "Check patient appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to check appointment.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET AVAILABLE SLOTS
|--------------------------------------------------------------------------
| PUBLIC
|
| Patients do not need doctor login.
|
| GET /api/appointments/slots?date=2026-08-10
|--------------------------------------------------------------------------
*/

router.get(
  "/slots",
  async (req, res) => {
    try {
      const { date } = req.query;

      console.log(
        "SLOT DATE:",
        date
      );

      /*
      |--------------------------------------------------------------------------
      | Validate date
      |--------------------------------------------------------------------------
      */

      if (!date) {
        return res.status(400).json({
          success: false,
          message:
            "Date is required.",
        });
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
          date
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date format. Use YYYY-MM-DD.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Get day name
      |--------------------------------------------------------------------------
      */

      const selectedDate =
        new Date(`${date}T00:00:00`);

      if (
        Number.isNaN(
          selectedDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid appointment date.",
        });
      }

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const day =
        days[selectedDate.getDay()];

      console.log(
        "APPOINTMENT DAY:",
        day
      );

      /*
      |--------------------------------------------------------------------------
      | Find available schedule
      |--------------------------------------------------------------------------
      |
      | Current application has one doctor.
      |--------------------------------------------------------------------------
      */

      const schedule =
        await Schedule.findOne({
          day,
          isAvailable: true,
        });

      /*
      |--------------------------------------------------------------------------
      | Doctor unavailable
      |--------------------------------------------------------------------------
      */

      if (!schedule) {
        return res.status(200).json({
          success: true,

          message:
            "Doctor is not available on this day.",

          date,

          day,

          slots: [],
        });
      }

      console.log(
        "SCHEDULE:",
        schedule
      );

      /*
      |--------------------------------------------------------------------------
      | Convert HH:mm to minutes
      |--------------------------------------------------------------------------
      */

      const timeToMinutes = (
        time
      ) => {
        const [
          hours,
          minutes,
        ] = time
          .split(":")
          .map(Number);

        return (
          hours * 60 + minutes
        );
      };

      /*
      |--------------------------------------------------------------------------
      | Convert minutes to 12-hour format
      |--------------------------------------------------------------------------
      */

      const minutesToTime = (
        totalMinutes
      ) => {
        const hours24 =
          Math.floor(
            totalMinutes / 60
          );

        const minutes =
          totalMinutes % 60;

        const period =
          hours24 >= 12
            ? "PM"
            : "AM";

        let hours12 =
          hours24 % 12;

        if (hours12 === 0) {
          hours12 = 12;
        }

        return `${String(
          hours12
        ).padStart(
          2,
          "0"
        )}:${String(
          minutes
        ).padStart(
          2,
          "0"
        )} ${period}`;
      };

      /*
      |--------------------------------------------------------------------------
      | Schedule time
      |--------------------------------------------------------------------------
      */

      const startMinutes =
        timeToMinutes(
          schedule.startTime
        );

      const endMinutes =
        timeToMinutes(
          schedule.endTime
        );

      /*
      |--------------------------------------------------------------------------
      | Generate 30-minute slots
      |--------------------------------------------------------------------------
      */

      const allSlots = [];

      for (
        let minutes =
          startMinutes;
        minutes <
        endMinutes;
        minutes += 30
      ) {
        /*
        | Don't create a slot that
        | goes beyond closing time.
        */

        if (
          minutes + 30 >
          endMinutes
        ) {
          break;
        }

        allSlots.push(
          minutesToTime(
            minutes
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Find booked appointments
      |--------------------------------------------------------------------------
      */

      const bookedAppointments =
        await Appointment.find({
          date,

          status: {
            $in: [
              "Pending",
              "Confirmed",
            ],
          },
        }).select("time");

      const bookedTimes =
        bookedAppointments.map(
          (appointment) =>
            appointment.time
        );

      console.log(
        "BOOKED TIMES:",
        bookedTimes
      );

      /*
      |--------------------------------------------------------------------------
      | Remove booked slots
      |--------------------------------------------------------------------------
      */

      const availableSlots =
        allSlots.filter(
          (slot) =>
            !bookedTimes.includes(
              slot
            )
        );

      console.log(
        "AVAILABLE SLOTS:",
        availableSlots
      );

      /*
      |--------------------------------------------------------------------------
      | Return slots
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        date,

        day,

        schedule: {
          startTime:
            schedule.startTime,

          endTime:
            schedule.endTime,
        },

        slots: availableSlots,
      });
    } catch (error) {
      console.error(
        "Fetch slots error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to fetch available slots.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET ALL APPOINTMENTS
|--------------------------------------------------------------------------
| PROTECTED
|
| Only logged-in doctor can access.
|
| GET /api/appointments
| GET /api/appointments?date=2026-08-10
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const { date } =
        req.query;

      const filter = {};

      /*
      |--------------------------------------------------------------------------
      | Filter by date
      |--------------------------------------------------------------------------
      */

      if (date) {
        filter.date = date;
      }

      const appointments =
        await Appointment.find(
          filter
        ).sort({
          date: 1,
          time: 1,
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      console.error(
        "Fetch appointments error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch appointments.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET SINGLE APPOINTMENT
|--------------------------------------------------------------------------
| PROTECTED
|
| GET /api/appointments/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found.",
        });
      }

      return res.status(200).json({
        success: true,
        appointment,
      });
    } catch (error) {
      console.error(
        "Fetch appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch appointment.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| UPDATE APPOINTMENT STATUS
|--------------------------------------------------------------------------
| PROTECTED
|
| PATCH /api/appointments/:id/status
|
| Pending
| Confirmed
| Cancelled
| Completed
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  protect,
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Completed",
      ];

      /*
      |--------------------------------------------------------------------------
      | Validate status
      |--------------------------------------------------------------------------
      */

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid appointment status.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Update status
      |--------------------------------------------------------------------------
      */

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,

          {
            status,
          },

          {
            new: true,
            runValidators: true,
          }
        );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found.",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Appointment status updated successfully.",

        appointment,
      });
    } catch (error) {
      console.error(
        "Update appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update appointment.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| DELETE APPOINTMENT
|--------------------------------------------------------------------------
| PROTECTED
|
| DELETE /api/appointments/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findByIdAndDelete(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found.",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Appointment deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete appointment.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default router;