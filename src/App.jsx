import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import DoctorLogin from "./pages/DoctorLogin";
import AppointmentStatus from "./pages/AppointmentStatus";

import PublicDoctorProfile from "./pages/PublicDoctorProfile";

import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import DoctorProfile from "./pages/DoctorProfile";

// =====================================================
// PUBLIC LAYOUT
// =====================================================

function PublicLayout() {
  return (
    <>
      {/* =================================================
          PUBLIC NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          PUBLIC PAGE CONTENT
      ================================================= */}

      <main>
        <Outlet />
      </main>

      {/* =================================================
          PUBLIC FOOTER
      ================================================= */}

      <Footer />
    </>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC WEBSITE
      ================================================= */}

      <Route element={<PublicLayout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* BOOK APPOINTMENT */}

        <Route
          path="/appointment"
          element={<Appointment />}
        />

        {/* APPOINTMENT STATUS */}

        <Route
          path="/appointment-status"
          element={<AppointmentStatus />}
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* =================================================
          DOCTOR LOGIN
      ================================================= */}

      <Route
        path="/doctor-login"
        element={<DoctorLogin />}
      />


      {/* =================================================
          DOCTOR PUBLIC PROFILE
          
          Doctor uses this page to fill/update
          information that patients will see.
      ================================================= */}

      <Route
        path="/public-doctor-profile"
        element={
          <PublicDoctorProfile />
        }
      />


      {/* =================================================
          PROTECTED DOCTOR AREA
      ================================================= */}

      <Route
        element={<ProtectedRoute />}
      >

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        {/* =================================================
            PATIENTS
        ================================================= */}

        <Route
          path="/patients"
          element={<Patients />}
        />

        {/* =================================================
            SCHEDULE
        ================================================= */}

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        {/* =================================================
            DOCTOR PROFILE
        ================================================= */}

        <Route
          path="/doctor-profile"
          element={<DoctorProfile />}
        />

      </Route>


      {/* =================================================
          404 PAGE
      ================================================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-slate-50">

            <div className="text-center">

              <h1 className="text-6xl font-bold text-slate-900">
                404
              </h1>

              <p className="mt-3 text-slate-500">
                Page not found
              </p>

              <a
                href="/"
                className="mt-6 inline-block rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
              >
                Go Home
              </a>

            </div>

          </div>
        }
      />

    </Routes>
  );
}

export default App;