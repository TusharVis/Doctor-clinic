import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import Doctor from "../models/Doctor.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ authRoutes.js loaded");

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "doctors"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `doctor-${Date.now()}${extension}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =====================================================
// DOCTOR REGISTER
// =====================================================

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        specialization,
        qualification,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingDoctor =
        await Doctor.findOne({
          email: normalizedEmail,
        });

      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message:
            "Doctor account already exists.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const doctor =
        await Doctor.create({
          name,

          email:
            normalizedEmail,

          password:
            hashedPassword,

          publicEmail: "",

          specialization:
            specialization || "",

          qualification:
            qualification || "",
        });

      return res.status(201).json({
        success: true,

        message:
          "Doctor account created successfully.",

        doctor: {
          id: doctor._id,

          name:
            doctor.name,

          email:
            doctor.email,

          publicEmail:
            doctor.publicEmail || "",

          specialization:
            doctor.specialization,

          qualification:
            doctor.qualification,
        },
      });
    } catch (error) {
      console.error(
        "Doctor registration error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create doctor account.",
      });
    }
  }
);

// =====================================================
// DOCTOR LOGIN
// =====================================================

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // =================================================
      // LOGIN USES ONLY LOGIN EMAIL
      // =================================================

      const doctor =
        await Doctor.findOne({
          email: normalizedEmail,
        });

      if (!doctor) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          doctor.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }

      const token = jwt.sign(
        {
          id: doctor._id,
          email: doctor.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        success: true,

        message:
          "Login successful.",

        token,

        doctor: {
          id: doctor._id,

          name:
            doctor.name,

          // LOGIN EMAIL
          email:
            doctor.email,

          // PUBLIC EMAIL
          publicEmail:
            doctor.publicEmail || "",

          specialization:
            doctor.specialization || "",

          qualification:
            doctor.qualification || "",

          phone:
            doctor.phone || "",

          clinicAddress:
            doctor.clinicAddress || "",

          consultationFee:
            doctor.consultationFee || 0,

          bio:
            doctor.bio || "",

          profileImage:
            doctor.profileImage || "",
        },
      });
    } catch (error) {
      console.error(
        "Doctor login error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Login failed.",
      });
    }
  }
);

// =====================================================
// GET PUBLIC DOCTOR PROFILE
// =====================================================
//
// PUBLIC ROUTE
//
// Patients use this endpoint.
//
// IMPORTANT:
// - Do NOT return login email.
// - Do NOT return password.
// - Return only public information.
//
// IMPORTANT FIX:
// The most recently updated doctor is selected.
// =====================================================

router.get(
  "/public-profile",
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findOne()
          .sort({
            updatedAt: -1,
          })
          .select(
            "name publicEmail specialization qualification phone clinicAddress consultationFee bio profileImage"
          );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor public profile not found.",
        });
      }

      return res.status(200).json({
        success: true,

        doctor: {
          id: doctor._id,

          name:
            doctor.name || "",

          publicEmail:
            doctor.publicEmail || "",

          specialization:
            doctor.specialization || "",

          qualification:
            doctor.qualification || "",

          phone:
            doctor.phone || "",

          clinicAddress:
            doctor.clinicAddress || "",

          consultationFee:
            doctor.consultationFee || 0,

          bio:
            doctor.bio || "",

          profileImage:
            doctor.profileImage || "",
        },
      });
    } catch (error) {
      console.error(
        "Get public doctor profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch public doctor profile.",
      });
    }
  }
);

// =====================================================
// GET DOCTOR PROFILE
// =====================================================
//
// PROTECTED
// Only logged-in doctor can access this.
// =====================================================

router.get(
  "/profile",
  protect,
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findById(
          req.doctor.id
        ).select("-password");

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found.",
        });
      }

      return res.status(200).json({
        success: true,
        doctor,
      });
    } catch (error) {
      console.error(
        "Get doctor profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch doctor profile.",
      });
    }
  }
);

// =====================================================
// UPDATE PUBLIC / PROFESSIONAL PROFILE
// =====================================================
//
// IMPORTANT:
//
// doctor.email
//     = LOGIN EMAIL
//
// doctor.publicEmail
//     = PUBLIC EMAIL
//
// This route does NOT change doctor.email.
// =====================================================

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),

  async (req, res) => {
    try {
      console.log(
        "PROFILE BODY:",
        req.body
      );

      console.log(
        "PROFILE FILE:",
        req.file
      );

      const {
        name,
        publicEmail,
        specialization,
        qualification,
        phone,
        clinicAddress,
        consultationFee,
        bio,
      } = req.body || {};

      if (!name) {
        return res.status(400).json({
          success: false,
          message:
            "Doctor name is required.",
        });
      }

      const doctor =
        await Doctor.findById(
          req.doctor.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found.",
        });
      }

      // =================================================
      // UPDATE PUBLIC INFORMATION
      // =================================================

      doctor.name =
        name.trim();

      // IMPORTANT:
      // Never change doctor.email here.

      doctor.publicEmail =
        publicEmail
          ? publicEmail
              .trim()
              .toLowerCase()
          : "";

      doctor.specialization =
        specialization || "";

      doctor.qualification =
        qualification || "";

      doctor.phone =
        phone || "";

      doctor.clinicAddress =
        clinicAddress || "";

      doctor.consultationFee =
        Number(
          consultationFee
        ) || 0;

      doctor.bio =
        bio || "";

      // =================================================
      // UPDATE PROFILE IMAGE
      // =================================================

      if (req.file) {
        doctor.profileImage =
          `/uploads/doctors/${req.file.filename}`;
      }

      await doctor.save();

      return res.status(200).json({
        success: true,

        message:
          "Profile updated successfully.",

        doctor: {
          id: doctor._id,

          name:
            doctor.name,

          // LOGIN EMAIL
          email:
            doctor.email,

          // PUBLIC EMAIL
          publicEmail:
            doctor.publicEmail || "",

          specialization:
            doctor.specialization,

          qualification:
            doctor.qualification,

          phone:
            doctor.phone,

          clinicAddress:
            doctor.clinicAddress,

          consultationFee:
            doctor.consultationFee,

          bio:
            doctor.bio,

          profileImage:
            doctor.profileImage || "",
        },
      });
    } catch (error) {
      console.error(
        "Update doctor profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to update profile.",
      });
    }
  }
);

// =====================================================
// CHANGE LOGIN EMAIL
// =====================================================
//
// Changes ONLY doctor.email.
//
// It does NOT change:
// - publicEmail
// - password
//
// Current password is required.
// =====================================================

router.put(
  "/change-email",
  protect,

  async (req, res) => {
    try {
      const {
        currentPassword,
        newEmail,
        confirmEmail,
      } = req.body || {};

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !currentPassword ||
        !newEmail ||
        !confirmEmail
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password, new email and confirm email are required.",
        });
      }

      const normalizedNewEmail =
        newEmail
          .trim()
          .toLowerCase();

      const normalizedConfirmEmail =
        confirmEmail
          .trim()
          .toLowerCase();

      // =================================================
      // CHECK EMAIL MATCH
      // =================================================

      if (
        normalizedNewEmail !==
        normalizedConfirmEmail
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New email and confirm email do not match.",
        });
      }

      // =================================================
      // EMAIL FORMAT
      // =================================================

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          normalizedNewEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address.",
        });
      }

      // =================================================
      // FIND CURRENT DOCTOR
      // =================================================

      const doctor =
        await Doctor.findById(
          req.doctor.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found.",
        });
      }

      // =================================================
      // CHECK CURRENT PASSWORD
      // =================================================

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          doctor.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Current password is incorrect.",
        });
      }

      // =================================================
      // CHECK SAME EMAIL
      // =================================================

      if (
        normalizedNewEmail ===
        doctor.email.toLowerCase()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New email must be different from current login email.",
        });
      }

      // =================================================
      // CHECK EMAIL ALREADY EXISTS
      // =================================================

      const existingDoctor =
        await Doctor.findOne({
          email:
            normalizedNewEmail,

          _id: {
            $ne:
              doctor._id,
          },
        });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered with another doctor.",
        });
      }

      // =================================================
      // CHANGE LOGIN EMAIL
      // =================================================

      doctor.email =
        normalizedNewEmail;

      // IMPORTANT:
      // Public email remains unchanged.

      await doctor.save();

      return res.status(200).json({
        success: true,

        message:
          "Login email changed successfully. Please login again with your new email.",

        doctor: {
          id: doctor._id,

          email:
            doctor.email,

          publicEmail:
            doctor.publicEmail || "",
        },
      });
    } catch (error) {
      console.error(
        "Change login email error:",
        error
      );

      // MongoDB duplicate email
      if (
        error.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to change login email.",
      });
    }
  }
);

// =====================================================
// CHANGE DOCTOR PASSWORD
// =====================================================
//
// Changes ONLY doctor.password.
//
// Does NOT change:
// - login email
// - public email
// =====================================================

router.put(
  "/change-password",
  protect,

  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body || {};

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password, new password and confirm password are required.",
        });
      }

      // =================================================
      // CONFIRM PASSWORD
      // =================================================

      if (
        newPassword !==
        confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password and confirm password do not match.",
        });
      }

      // =================================================
      // PASSWORD LENGTH
      // =================================================

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters long.",
        });
      }

      // =================================================
      // FIND DOCTOR
      // =================================================

      const doctor =
        await Doctor.findById(
          req.doctor.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found.",
        });
      }

      // =================================================
      // CHECK CURRENT PASSWORD
      // =================================================

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          doctor.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Current password is incorrect.",
        });
      }

      // =================================================
      // CHECK SAME PASSWORD
      // =================================================

      const samePassword =
        await bcrypt.compare(
          newPassword,
          doctor.password
        );

      if (samePassword) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be different from current password.",
        });
      }

      // =================================================
      // HASH NEW PASSWORD
      // =================================================

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      doctor.password =
        hashedPassword;

      await doctor.save();

      return res.status(200).json({
        success: true,

        message:
          "Password changed successfully.",
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to change password.",
      });
    }
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================

export default router;