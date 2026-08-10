import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import DoctorNavbar from "../components/DoctorNavbar";

import {
  FaCalendarCheck,
  FaClock,
  FaUserInjured,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

function Dashboard() {
  // =====================================================
  // DOCTOR
  // =====================================================

  const doctor = JSON.parse(
    localStorage.getItem("doctor") || "{}"
  );

  // =====================================================
  // STATE
  // =====================================================

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("doctorToken");

      if (!token) {
        setError(
          "Please login again."
        );

        setLoading(false);
        return;
      }

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setAppointments(
          response.data.appointments || []
        );
      }
    } catch (err) {
      console.error(
        "Dashboard appointments error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (item) =>
        item.status === "Confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (item) =>
        item.status === "Cancelled"
    ).length;

  // =====================================================
  // TODAY
  // =====================================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayAppointments =
    appointments.filter(
      (item) =>
        item.date === today
    );

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    let hour =
      parseInt(hours, 10);

    const ampm =
      hour >= 12
        ? "PM"
        : "AM";

    hour =
      hour % 12 || 12;

    return `${String(hour).padStart(
      2,
      "0"
    )}:${minutes} ${ampm}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Confirmed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Completed") {
      return "bg-sky-100 text-sky-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          DOCTOR NAVBAR
      ================================================= */}

      <DoctorNavbar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="min-w-0">

        <div className="p-5 md:p-8 lg:p-10">

          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="mb-6">

            <p className="text-sm font-semibold text-sky-600">
              DOCTOR DASHBOARD
            </p>

            {/* CHANGED: Good Morning → Hello */}

            <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
              Hello,{" "}
              {doctor?.name
                ? doctor.name.replace(
                    /^Dr\.\s*/i,
                    ""
                  )
                : "Doctor"}{" "}
              👋
            </h1>

            <p className="mt-2 text-base text-slate-500">
              Here's what's happening
              with your clinic today.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <StatCard
              title="Total Appointments"
              value={
                totalAppointments
              }
              icon={
                <FaCalendarCheck />
              }
              iconClass="bg-sky-100 text-sky-600"
            />

            <StatCard
              title="Pending"
              value={
                pendingAppointments
              }
              icon={
                <FaHourglassHalf />
              }
              iconClass="bg-yellow-100 text-yellow-600"
            />

            <StatCard
              title="Confirmed"
              value={
                confirmedAppointments
              }
              icon={
                <FaCheckCircle />
              }
              iconClass="bg-green-100 text-green-600"
            />

            <StatCard
              title="Completed"
              value={
                completedAppointments
              }
              icon={
                <FaClock />
              }
              iconClass="bg-indigo-100 text-indigo-600"
            />

            <StatCard
              title="Cancelled"
              value={
                cancelledAppointments
              }
              icon={
                <FaTimesCircle />
              }
              iconClass="bg-red-100 text-red-600"
            />

          </div>

          {/* =================================================
              CONTENT GRID
          ================================================= */}

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* =================================================
                TODAY'S APPOINTMENTS
            ================================================= */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Today's Appointments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {todayAppointments.length} appointments today
                  </p>

                </div>

                <Link
                  to="/appointments"
                  className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                >
                  View All
                </Link>

              </div>

              {/* LOADING */}

              {loading && (
                <div className="p-8 text-center text-sm text-slate-500">
                  Loading appointments...
                </div>
              )}

              {/* EMPTY */}

              {!loading &&
                todayAppointments.length ===
                  0 && (
                  <div className="p-10 text-center">

                    <FaCalendarCheck className="mx-auto text-4xl text-slate-300" />

                    <p className="mt-3 text-base font-semibold text-slate-600">
                      No appointments today
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your schedule is clear.
                    </p>

                  </div>
                )}

              {/* APPOINTMENTS */}

              {!loading &&
                todayAppointments
                  .slice(0, 5)
                  .map(
                    (appointment) => (
                      <div
                        key={
                          appointment._id
                        }
                        className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0"
                      >

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">

                            {appointment.patientName
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase()}

                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {
                                appointment.patientName
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                appointment.reason
                              }
                            </p>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="flex items-center justify-end gap-1 text-sm font-semibold text-slate-700">

                            <FaClock className="text-sky-500" />

                            {formatTime(
                              appointment.time
                            )}

                          </p>

                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {
                              appointment.status
                            }
                          </span>

                        </div>

                      </div>
                    )
                  )}

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your clinic quickly.
              </p>

              <div className="mt-5 space-y-3">

                <Link
                  to="/appointments"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <FaCalendarCheck />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Appointments
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage appointments
                    </p>

                  </div>

                </Link>

                <Link
                  to="/schedule"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <FaClock />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Schedule
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage availability
                    </p>

                  </div>

                </Link>

                <Link
                  to="/patients"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <FaUserInjured />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Patients
                    </p>

                    <p className="text-xs text-slate-500">
                      View patient records
                    </p>

                  </div>

                </Link>

                <Link
                  to="/doctor-profile"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FaUserInjured />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Doctor Profile
                    </p>

                    <p className="text-xs text-slate-500">
                      Update your profile
                    </p>

                  </div>

                </Link>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;