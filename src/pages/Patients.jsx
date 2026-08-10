import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaPhone,
  FaCalendarCheck,
  FaClock,
  FaTimes,
  FaCheckCircle,
  FaEye,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";

function Patients() {
  // =====================================================
  // STATE
  // =====================================================

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState(null);

  // =====================================================
  // DOCTOR
  // =====================================================

  const doctor = JSON.parse(
    localStorage.getItem("doctor") || "{}"
  );

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token =
        localStorage.getItem("doctorToken");

      if (!token) {
        window.location.href =
          "/doctor-login";
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
      }
    } catch (error) {
      console.error(
        "Fetch patients error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "doctorToken"
        );

        localStorage.removeItem("doctor");

        window.location.href =
          "/doctor-login";
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE UNIQUE PATIENT LIST
  // =====================================================

  const patients = useMemo(() => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      const key = appointment.phone;

      if (!key) return;

      if (!patientMap.has(key)) {
        patientMap.set(key, {
          phone: appointment.phone,
          patientName:
            appointment.patientName,
          age: appointment.age,
          gender: appointment.gender,
          appointments: [],
        });
      }

      patientMap
        .get(key)
        .appointments.push(appointment);
    });

    return Array.from(
      patientMap.values()
    ).map((patient) => {
      const sortedAppointments = [
        ...patient.appointments,
      ].sort(
        (a, b) =>
          new Date(
            `${b.date}T${convertTime(
              b.time
            )}`
          ) -
          new Date(
            `${a.date}T${convertTime(
              a.time
            )}`
          )
      );

      return {
        ...patient,

        appointments:
          sortedAppointments,

        totalVisits:
          sortedAppointments.length,

        completedVisits:
          sortedAppointments.filter(
            (item) =>
              item.status === "Completed"
          ).length,

        lastAppointment:
          sortedAppointments[0] || null,
      };
    });
  }, [appointments]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPatients =
    patients.filter((patient) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        patient.patientName
          ?.toLowerCase()
          .includes(searchText) ||
        patient.phone
          ?.toString()
          .includes(searchText)
      );
    });

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "doctorToken"
    );

    localStorage.removeItem("doctor");

    window.location.href =
      "/doctor-login";
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getProfileImage = () => {
    if (!doctor?.profileImage) {
      return "";
    }

    if (
      doctor.profileImage.startsWith(
        "http://"
      ) ||
      doctor.profileImage.startsWith(
        "https://"
      )
    ) {
      return doctor.profileImage;
    }

    return `${import.meta.env.VITE_API_URL}${doctor.profileImage}`;
  };

  const profileImage =
    getProfileImage();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="flex min-h-[104px] items-center justify-between px-7 md:px-10">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-3xl font-bold text-white">
              +
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                MediCare
              </h1>

              <p className="text-base text-slate-500">
                Patient Management
              </p>
            </div>

          </div>


          {/* =================================================
              DOCTOR PROFILE + LOGOUT
          ================================================= */}

          <div className="flex items-center gap-7">

            <div className="hidden items-center gap-3 md:flex">

              {/* PROFILE IMAGE */}

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={
                    doctor.name ||
                    "Doctor"
                  }
                  className="h-21 w-21 rounded-full object-cover ring-2 ring-sky-100"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <FaUser />
                </div>
              )}

              {/* DOCTOR NAME */}

              <div className="text-right">

                <p className="text-lg font-bold text-slate-900">
                  {doctor.name ||
                    "Doctor"}
                </p>

                <p className="text-sm text-slate-500">
                  {doctor.specialization ||
                    "General Physician"}
                </p>

              </div>

            </div>


            {/* LOGOUT */}

            <button
              onClick={logout}
              className="flex items-center gap-2 text-lg font-semibold text-red-600 transition hover:text-red-700"
            >
              <span>Logout</span>

              <FaSignOutAlt />
            </button>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="px-7 py-9 md:px-10">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          onClick={() =>
            (window.location.href =
              "/dashboard")
          }
          className="mb-6 flex items-center gap-3 text-lg font-semibold text-slate-500 transition hover:text-sky-600"
        >
          <FaArrowLeft />

          Back to Dashboard
        </button>


        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">

          <div>

            <p className="text-xl font-bold text-sky-600">
              PATIENT MANAGEMENT
            </p>

            <h1 className="mt-2 text-5xl font-bold text-slate-900">
              Patients
            </h1>

            <p className="mt-3 text-xl text-slate-500">
              View your patients and their
              appointment history.
            </p>

          </div>


          {/* =================================================
              TOTAL PATIENTS
          ================================================= */}

          <div className="w-full rounded-2xl bg-white px-7 py-5 shadow-sm md:w-[195px]">

            <p className="text-base text-slate-500">
              Total Patients
            </p>

            <p className="mt-1 text-4xl font-bold text-slate-900">
              {patients.length}
            </p>

          </div>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-white shadow-sm">

          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search patient by name or phone..."
              className="h-[44px] w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-lg text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

          </div>

        </div>


        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <div className="mt-8">

          {loading ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <p className="text-lg text-slate-500">
                Loading patients...
              </p>

            </div>

          ) : filteredPatients.length ===
            0 ? (

            <div className="rounded-2xl bg-white p-14 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

                <FaUser className="text-2xl text-slate-400" />

              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No patients found
              </h2>

              <p className="mt-2 text-slate-500">
                {search
                  ? "Try another name or phone number."
                  : "Patients will appear here after appointments are booked."}
              </p>

            </div>

          ) : (

            <div className="flex flex-wrap gap-7">

              {filteredPatients.map(
                (patient) => (

                  <PatientCard
                    key={patient.phone}
                    patient={patient}
                    onView={() =>
                      setSelectedPatient(
                        patient
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

      </main>


      {/* =================================================
          PATIENT DETAILS MODAL
      ================================================= */}

      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() =>
            setSelectedPatient(null)
          }
        />
      )}

    </div>
  );
}


// =====================================================
// PATIENT CARD
// =====================================================

function PatientCard({
  patient,
  onView,
}) {
  return (

    <div className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">

      {/* =================================================
          PATIENT HEADER
      ================================================= */}

      <div className="px-6 pt-6">

        <div className="flex items-center gap-5">

          {/* INITIAL */}

          <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full bg-sky-100 text-3xl font-bold text-sky-600">

            {patient.patientName
              ?.charAt(0)
              ?.toUpperCase()}

          </div>


          {/* NAME */}

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {patient.patientName}
            </h2>

            <p className="mt-1 text-lg text-slate-500">
              {patient.age} years •{" "}
              {patient.gender}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          PATIENT INFORMATION
      ================================================= */}

      <div className="px-6 pb-6 pt-7">

        {/* PHONE */}

        <div className="flex items-center gap-4 text-lg text-slate-700">

          <FaPhone className="text-xl text-sky-600" />

          <span>
            {patient.phone}
          </span>

        </div>


        {/* TOTAL APPOINTMENTS */}

        <div className="mt-5 flex items-center gap-4 text-lg text-slate-700">

          <FaCalendarCheck className="text-xl text-sky-600" />

          <span>
            {patient.totalVisits} total
            appointment
            {patient.totalVisits !== 1
              ? "s"
              : ""}
          </span>

        </div>


        {/* COMPLETED */}

        <div className="mt-5 flex items-center gap-4 text-lg text-slate-700">

          <FaCheckCircle className="text-xl text-green-500" />

          <span>
            {patient.completedVisits}{" "}
            completed
          </span>

        </div>

      </div>


      {/* =================================================
          LAST APPOINTMENT
      ================================================= */}

      {patient.lastAppointment && (

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">

          <p className="text-base font-bold uppercase text-slate-500">
            Last Appointment
          </p>

          <div className="mt-3 flex items-center justify-between">

            <span className="text-lg font-medium text-slate-700">
              {patient.lastAppointment.date}
            </span>

            <span className="text-lg text-slate-500">
              {patient.lastAppointment.time}
            </span>

          </div>

        </div>

      )}


      {/* =================================================
          VIEW PATIENT
      ================================================= */}

      <div className="px-4 pb-4 pt-3">

        <button
          onClick={onView}
          className="flex h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-sky-600 text-lg font-semibold text-white transition hover:bg-sky-700"
        >

          <FaEye />

          View Patient

        </button>

      </div>

    </div>
  );
}


// =====================================================
// PATIENT DETAILS MODAL
// =====================================================

function PatientDetails({
  patient,
  onClose,
}) {
  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">

              {patient.patientName
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {patient.patientName}
              </h2>

              <p className="text-sm text-slate-500">
                Patient Details
              </p>

            </div>

          </div>


          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-3 text-slate-500 transition hover:bg-slate-200"
          >
            <FaTimes />
          </button>

        </div>


        {/* =================================================
            PATIENT INFO
        ================================================= */}

        <div className="grid gap-4 p-6 sm:grid-cols-3">

          <Info
            icon={<FaUser />}
            label="Age"
            value={`${patient.age} years`}
          />

          <Info
            icon={<FaUser />}
            label="Gender"
            value={patient.gender}
          />

          <Info
            icon={<FaPhone />}
            label="Phone"
            value={patient.phone}
          />

        </div>


        {/* =================================================
            APPOINTMENT HISTORY
        ================================================= */}

        <div className="border-t border-slate-100 px-6 py-6">

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Appointment History
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {patient.appointments.length}{" "}
              appointment
              {patient.appointments.length !==
              1
                ? "s"
                : ""}
            </p>

          </div>


          <div className="mt-5 space-y-4">

            {patient.appointments.map(
              (appointment) => (

                <div
                  key={appointment._id}
                  className="rounded-2xl border border-slate-100 p-5"
                >

                  <div className="flex flex-col justify-between gap-4 md:flex-row">

                    <div>

                      <div className="flex flex-wrap items-center gap-4">

                        <span className="flex items-center gap-2 font-semibold text-slate-800">

                          <FaCalendarCheck className="text-sky-600" />

                          {appointment.date}

                        </span>


                        <span className="flex items-center gap-2 text-sm text-slate-500">

                          <FaClock />

                          {appointment.time}

                        </span>

                      </div>


                      <p className="mt-3 text-sm text-slate-600">

                        <strong>
                          Reason:
                        </strong>{" "}

                        {appointment.reason}

                      </p>

                    </div>


                    <StatusBadge
                      status={
                        appointment.status
                      }
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// INFO COMPONENT
// =====================================================

function Info({
  icon,
  label,
  value,
}) {
  return (

    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-sky-600">

        {icon}

        <span className="text-xs font-semibold uppercase text-slate-400">
          {label}
        </span>

      </div>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}) {
  const styles = {
    Pending:
      "bg-yellow-100 text-yellow-700",

    Confirmed:
      "bg-green-100 text-green-700",

    Completed:
      "bg-sky-100 text-sky-700",

    Cancelled:
      "bg-red-100 text-red-700",
  };

  return (

    <span
      className={`w-fit rounded-full px-3 py-2 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>

  );
}


// =====================================================
// TIME HELPER
// =====================================================

function convertTime(time) {
  if (!time) return "00:00";

  const match = time.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
  );

  if (!match) {
    return "00:00";
  }

  let hours = Number(match[1]);

  const minutes = match[2];

  const period =
    match[3]?.toUpperCase();

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  return `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}`;
}

export default Patients;