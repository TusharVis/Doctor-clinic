import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// =====================================================
// TEST
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Clinic API is running",
  });
});

// =====================================================
// ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/appointments",
  appointmentRoutes
);

app.use(
  "/api/schedule",
  scheduleRoutes
);

// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});