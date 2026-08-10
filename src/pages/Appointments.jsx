import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTrash,
  FaUser,
  FaUserMd,
} from "react-icons/fa";

function Appointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("doctorToken");

      if (!token) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
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
      } else {
        setError(
          response.data.message ||
            "Unable to load appointments."
        );
      }
    } catch (err) {
      console.error(
        "Fetch appointments error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        setError(
          "Session expired. Please login again."
        );

        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (id, status) => {
    try {
      const token =
        localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor-login");
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previous) =>
          previous.map((appointment) =>
            appointment._id === id
              ? {
                  ...appointment,
                  status,
                }
              : appointment
          )
        );
      }
    } catch (err) {
      console.error(
        "Update appointment status error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        navigate("/doctor-login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to update appointment."
      );
    }
  };

  // =====================================================
  // DELETE APPOINTMENT
  // =====================================================

  const deleteAppointment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor-login");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previous) =>
          previous.filter(
            (appointment) =>
              appointment._id !== id
          )
        );
      }
    } catch (err) {
      console.error(
        "Delete appointment error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        navigate("/doctor-login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to remove appointment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FILTER APPOINTMENTS
  // =====================================================

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        appointment.patientName || "";

      const phone =
        appointment.phone || "";

      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(searchText) ||
        phone
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        appointment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    dateFilter,
  ]);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="px-8 py-3">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-lg font-bold tracking-wide text-sky-600">
                DOCTOR DASHBOARD
              </p>

              <h1 className="mt-0.5 text-4xl font-bold text-slate-900">
                Appointments
              </h1>

              <p className="mt-1 text-lg text-slate-500">
                Manage all patient appointments.
              </p>

            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3 text-lg font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              <FaArrowLeft />

              Back
            </Link>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="px-8 py-4">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">

            <span>
              {error}
            </span>

            {error.includes(
              "Session expired"
            ) && (
              <button
                onClick={() =>
                  navigate("/doctor-login")
                }
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Login
              </button>
            )}

          </div>
        )}


        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search patient or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
          />


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>


          {/* DATE */}

          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
          />

        </div>


        {/* =================================================
            APPOINTMENT LIST HEADER
        ================================================= */}

        <div className="mt-4 flex items-center justify-between">

          <h2 className="text-xl font-bold text-slate-900">
            Appointment List
          </h2>

          <span className="text-base font-bold text-sky-600">
            {filteredAppointments.length} Results
          </span>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="mt-3 rounded-2xl bg-white p-8 text-center shadow-sm">

            <p className="text-base text-slate-500">
              Loading appointments...
            </p>

          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          filteredAppointments.length === 0 && (
            <div className="mt-3 rounded-2xl bg-white p-8 text-center shadow-sm">

              <FaCalendarCheck className="mx-auto text-4xl text-slate-300" />

              <h3 className="mt-3 text-xl font-bold text-slate-700">
                No appointments found
              </h3>

              <p className="mt-1 text-base text-slate-500">
                Try changing your search or filters.
              </p>

            </div>
          )}


        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        {!loading &&
          filteredAppointments.map(
            (appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                updateStatus={updateStatus}
                deleteAppointment={
                  deleteAppointment
                }
                deletingId={deletingId}
              />
            )
          )}

      </main>

    </div>
  );
}


// =====================================================
// APPOINTMENT CARD
// =====================================================

function AppointmentCard({
  appointment,
  updateStatus,
  deleteAppointment,
  deletingId,
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-md">

      {/* =================================================
          PATIENT HEADER
      ================================================= */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">

        <div className="flex items-center gap-4">

          {/* AVATAR */}

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-600">

            {appointment.patientName
              ?.charAt(0)
              ?.toUpperCase()}

          </div>


          {/* PATIENT INFO */}

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              {appointment.patientName}
            </h3>

            <p className="mt-0.5 text-base text-slate-500">
              {appointment.age} years
              {" • "}
              {appointment.gender}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <StatusBadge
          status={appointment.status}
        />

      </div>


      {/* =================================================
          DETAILS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 border-b border-slate-200 px-6 py-3 md:grid-cols-4">

        {/* DATE */}

        <Detail
          icon={<FaCalendarCheck />}
          label="DATE"
          value={appointment.date}
        />


        {/* TIME */}

        <Detail
          icon={<FaClock />}
          label="TIME"
          value={formatTime(appointment.time)}
        />


        {/* PHONE */}

        <Detail
          icon={<FaUser />}
          label="PHONE"
          value={appointment.phone}
        />


        {/* REASON */}

        <Detail
          icon={<FaUserMd />}
          label="REASON"
          value={appointment.reason}
        />

      </div>


      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="flex flex-wrap gap-3 px-6 py-2.5">

        {/* PENDING */}

        {appointment.status === "Pending" && (
          <>

            <button
              onClick={() =>
                updateStatus(
                  appointment._id,
                  "Confirmed"
                )
              }
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-base font-bold text-white transition hover:bg-sky-700"
            >

              <FaCheckCircle />

              Confirm

            </button>


            <button
              onClick={() =>
                updateStatus(
                  appointment._id,
                  "Cancelled"
                )
              }
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-base font-bold text-red-600 transition hover:bg-red-50"
            >

              <FaTimesCircle />

              Cancel

            </button>

          </>
        )}


        {/* CONFIRMED */}

        {appointment.status === "Confirmed" && (
          <>

            <button
              onClick={() =>
                updateStatus(
                  appointment._id,
                  "Completed"
                )
              }
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-base font-bold text-white transition hover:bg-sky-700"
            >

              <FaCheckCircle />

              Mark Completed

            </button>


            <button
              onClick={() =>
                updateStatus(
                  appointment._id,
                  "Cancelled"
                )
              }
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-base font-bold text-red-600 transition hover:bg-red-50"
            >

              <FaTimesCircle />

              Cancel

            </button>

          </>
        )}


        {/* COMPLETED */}

        {appointment.status === "Completed" && (
          <button
            disabled={
              deletingId ===
              appointment._id
            }
            onClick={() =>
              deleteAppointment(
                appointment._id
              )
            }
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-base font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FaTrash />

            {deletingId ===
            appointment._id
              ? "Removing..."
              : "Remove"}

          </button>
        )}


        {/* CANCELLED */}

        {appointment.status === "Cancelled" && (
          <button
            disabled={
              deletingId ===
              appointment._id
            }
            onClick={() =>
              deleteAppointment(
                appointment._id
              )
            }
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-base font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FaTrash />

            {deletingId ===
            appointment._id
              ? "Removing..."
              : "Remove"}

          </button>
        )}

      </div>

    </div>
  );
}


// =====================================================
// DETAIL
// =====================================================

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1 text-lg text-sky-600">
        {icon}
      </div>

      <div>

        <p className="text-xs font-bold tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-lg font-medium text-slate-800">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  let classes =
    "bg-slate-100 text-slate-600";

  if (status === "Confirmed") {
    classes =
      "bg-green-100 text-green-600";
  }

  if (status === "Pending") {
    classes =
      "bg-yellow-100 text-yellow-700";
  }

  if (status === "Completed") {
    classes =
      "bg-sky-100 text-sky-700";
  }

  if (status === "Cancelled") {
    classes =
      "bg-red-100 text-red-600";
  }

  return (
    <span
      className={`rounded-full px-4 py-1.5 text-base font-bold ${classes}`}
    >
      {status}
    </span>
  );
}


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(time) {
  if (!time) {
    return "-";
  }

  const [hours, minutes] =
    time.split(":");

  let hour = parseInt(hours, 10);

  const ampm =
    hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;
}


export default Appointments;