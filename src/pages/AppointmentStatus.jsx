import { useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaCalendarCheck,
  FaClock,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaStethoscope,
} from "react-icons/fa";
import { motion } from "framer-motion";

function AppointmentStatus() {
  const [phone, setPhone] = useState("");

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [searched, setSearched] =
    useState(false);

  const checkAppointment = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setAppointments([]);
    setSearched(false);

    if (!/^[0-9]{10}$/.test(phone)) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await axios.get(
          "http://localhost:5000/api/appointments/patient/status",
          {
            params: {
              phone,
            },
          }
        );

      if (response.data.success) {
        setAppointments(
          response.data.appointments
        );

        setSearched(true);
      }
    } catch (error) {
      console.error(error);

      setSearched(true);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to find appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          className:
            "bg-yellow-100 text-yellow-700",
          icon: <FaHourglassHalf />,
        };

      case "Confirmed":
        return {
          className:
            "bg-green-100 text-green-700",
          icon: <FaCheckCircle />,
        };

      case "Completed":
        return {
          className:
            "bg-sky-100 text-sky-700",
          icon: <FaCheckCircle />,
        };

      case "Cancelled":
        return {
          className:
            "bg-red-100 text-red-700",
          icon: <FaTimesCircle />,
        };

      default:
        return {
          className:
            "bg-slate-100 text-slate-600",
          icon: <FaClock />,
        };
    }
  };

  return (
    <section className="min-h-[80vh] bg-slate-50 px-5 py-16 md:px-6 md:py-20">

      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >

          <span className="font-semibold text-sky-600">
            APPOINTMENT STATUS
          </span>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Check Your Appointment
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Enter the mobile number used while
            booking your appointment to check
            your appointment status.
          </p>

        </motion.div>

        {/* Search Card */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-8"
        >

          <form
            onSubmit={checkAppointment}
          >

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mobile Number
            </label>

            <div className="relative">

              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  );

                  setErrorMessage("");
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                className="w-full rounded-xl border border-slate-200 py-4 pl-11 pr-4 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-4 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Checking...
                </>
              ) : (
                <>
                  <FaSearch />
                  Check Appointment
                </>
              )}

            </button>

          </form>

          {/* Error */}

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

        </motion.div>

        {/* Results */}

        {searched &&
          appointments.length > 0 && (
            <div className="mt-10">

              <div className="mb-5">

                <h2 className="text-2xl font-bold text-slate-900">
                  Your Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {appointments.length} appointment
                  {appointments.length > 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

              <div className="space-y-5">

                {appointments.map(
                  (appointment) => {
                    const status =
                      getStatusStyle(
                        appointment.status
                      );

                    return (
                      <motion.div
                        key={
                          appointment._id
                        }
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="rounded-2xl bg-white p-6 shadow-sm"
                      >

                        {/* Top */}

                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                              <FaUser />
                            </div>

                            <div>

                              <h3 className="font-bold text-slate-900">
                                {
                                  appointment.patientName
                                }
                              </h3>

                              <p className="text-sm text-slate-500">
                                Patient
                              </p>

                            </div>

                          </div>

                          <span
                            className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
                          >
                            {status.icon}
                            {
                              appointment.status
                            }
                          </span>

                        </div>

                        {/* Details */}

                        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 md:grid-cols-4">

                          <Info
                            icon={
                              <FaCalendarCheck />
                            }
                            label="Date"
                            value={
                              appointment.date
                            }
                          />

                          <Info
                            icon={
                              <FaClock />
                            }
                            label="Time"
                            value={
                              appointment.time
                            }
                          />

                          <Info
                            icon={
                              <FaPhone />
                            }
                            label="Phone"
                            value={
                              appointment.phone
                            }
                          />

                          <Info
                            icon={
                              <FaStethoscope />
                            }
                            label="Reason"
                            value={
                              appointment.reason
                            }
                          />

                        </div>

                        {/* Status Message */}

                        <div
                          className={`mt-5 rounded-xl p-4 text-sm font-medium ${
                            appointment.status ===
                            "Confirmed"
                              ? "bg-green-50 text-green-700"
                              : appointment.status ===
                                "Cancelled"
                              ? "bg-red-50 text-red-700"
                              : appointment.status ===
                                "Completed"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >

                          {appointment.status ===
                            "Pending" &&
                            "Your appointment request is waiting for doctor confirmation."}

                          {appointment.status ===
                            "Confirmed" &&
                            "Your appointment has been confirmed by the doctor."}

                          {appointment.status ===
                            "Completed" &&
                            "Your appointment has been completed."}

                          {appointment.status ===
                            "Cancelled" &&
                            "This appointment has been cancelled."}

                        </div>

                      </motion.div>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </div>

    </section>
  );
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-1 text-sky-600">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate font-medium text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}

export default AppointmentStatus;