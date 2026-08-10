import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Appointment = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    date: "",
    time: "",
    reason: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    // When date changes, load available slots
    if (name === "date") {
      setFormData((prev) => ({
        ...prev,
        date: value,
        time: "",
      }));

      if (value) {
        fetchAvailableSlots(value);
      } else {
        setAvailableSlots([]);
      }
    }
  };

  // --------------------------------------------------
  // FETCH AVAILABLE SLOTS
  // --------------------------------------------------

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      setLoadingSlots(true);
      setError("");
      setAvailableSlots([]);

      const response = await axios.get(
        `${API_URL}/api/appointments/slots`,
        {
          params: {
            date: selectedDate,
          },
        }
      );

      console.log("Available slots:", response.data);

      if (response.data.success) {
        setAvailableSlots(response.data.slots || []);
      } else {
        setAvailableSlots([]);
        setError(
          response.data.message ||
            "No available slots found."
        );
      }
    } catch (err) {
      console.error(
        "Fetch slots error:",
        err
      );

      setAvailableSlots([]);

      setError(
        err.response?.data?.message ||
          "Unable to load available time slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  // --------------------------------------------------
  // SELECT TIME
  // --------------------------------------------------

  const handleTimeSelect = (slot) => {
    setFormData((prev) => ({
      ...prev,
      time: slot,
    }));

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // FORM VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    const {
      patientName,
      age,
      gender,
      phone,
      date,
      time,
      reason,
    } = formData;

    if (!patientName.trim()) {
      setError("Please enter patient name.");
      return false;
    }

    if (!age) {
      setError("Please enter patient age.");
      return false;
    }

    if (Number(age) < 1 || Number(age) > 120) {
      setError("Age must be between 1 and 120.");
      return false;
    }

    if (!gender) {
      setError("Please select gender.");
      return false;
    }

    if (!phone) {
      setError("Please enter mobile number.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return false;
    }

    if (!date) {
      setError("Please select appointment date.");
      return false;
    }

    if (!time) {
      setError("Please select an available time.");
      return false;
    }

    if (!reason.trim()) {
      setError("Please enter reason for visit.");
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // BOOK APPOINTMENT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setBooking(true);

      const response = await axios.post(
        `${API_URL}/api/appointments`,
        {
          patientName:
            formData.patientName.trim(),

          age: Number(formData.age),

          gender: formData.gender,

          phone: formData.phone,

          date: formData.date,

          time: formData.time,

          reason:
            formData.reason.trim(),
        }
      );

      console.log(
        "Appointment response:",
        response.data
      );

      if (response.data.success) {
        setSuccess(
          "Appointment booked successfully!"
        );

        // Reset form
        setFormData({
          patientName: "",
          age: "",
          gender: "",
          phone: "",
          date: "",
          time: "",
          reason: "",
        });

        setAvailableSlots([]);
      } else {
        setError(
          response.data.message ||
            "Unable to book appointment."
        );
      }
    } catch (err) {
      console.error(
        "Book appointment error:",
        err
      );

      if (err.response?.status === 409) {
        setError(
          "This time slot has already been booked. Please select another time."
        );

        // Refresh slots
        if (formData.date) {
          fetchAvailableSlots(
            formData.date
          );
        }
      } else if (
        err.response?.status === 400
      ) {
        setError(
          err.response?.data?.message ||
            "Please check your information."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Server error. Please try again."
        );
      }
    } finally {
      setBooking(false);
    }
  };

  // --------------------------------------------------
  // MINIMUM DATE
  // --------------------------------------------------

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* PAGE HEADER */}
      <section className="px-6 pt-8 pb-5 text-center">
        <p className="mb-1 text-lg font-bold text-sky-600">
          APPOINTMENT
        </p>

        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Book Your Appointment
        </h1>

        <p className="mt-2 text-base text-slate-600">
          Fill in your details and choose a convenient
          date and available time for your consultation.
        </p>
      </section>

      {/* FORM */}
      <div className="mx-auto max-w-5xl px-4 pb-10">

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >

          {/* -----------------------------------------
              PATIENT INFORMATION
          ------------------------------------------ */}

          <div className="border-b border-slate-100 p-6">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <FaUser />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Patient Information
                </h2>

                <p className="text-sm text-slate-500">
                  Enter the patient's basic details.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Patient Name
                </label>

                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* AGE */}
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="Enter age"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Enter a 10-digit mobile number.
                </p>
              </div>

            </div>
          </div>

          {/* -----------------------------------------
              APPOINTMENT DETAILS
          ------------------------------------------ */}

          <div className="p-6">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <FaCalendarAlt />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Appointment Details
                </h2>

                <p className="text-sm text-slate-500">
                  Select a date and available time.
                </p>
              </div>

            </div>

            {/* DATE */}
            <div className="mb-5">

              <label className="mb-2 block font-semibold text-slate-700">
                Appointment Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                min={getToday()}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 md:max-w-md"
              />

            </div>

            {/* AVAILABLE TIME */}
            <div className="mb-6">

              <div className="mb-3 flex items-center gap-2">

                <FaClock className="text-sky-600" />

                <label className="font-semibold text-slate-700">
                  Available Time
                </label>

              </div>

              {/* LOADING */}
              {loadingSlots && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  Loading available time slots...
                </div>
              )}

              {/* NO DATE */}
              {!loadingSlots &&
                !formData.date && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                    Please select a date first.
                  </div>
                )}

              {/* NO SLOTS */}
              {!loadingSlots &&
                formData.date &&
                availableSlots.length === 0 && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                    No available time slots for this date.
                  </div>
                )}

              {/* SLOTS */}
              {!loadingSlots &&
                availableSlots.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                    {availableSlots.map(
                      (slot, index) => (
                        <button
                          key={`${slot}-${index}`}
                          type="button"
                          onClick={() =>
                            handleTimeSelect(
                              slot
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            formData.time ===
                            slot
                              ? "border-sky-600 bg-sky-600 text-white shadow-lg"
                              : "border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                          }`}
                        >
                          <FaClock className="mr-2 inline-block" />
                          {slot}
                        </button>
                      )
                    )}

                  </div>
                )}

            </div>

            {/* SELECTED TIME */}
            {formData.time && (
              <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                <FaCheckCircle className="mr-2 inline-block" />
                Selected time:{" "}
                <strong>
                  {formData.time}
                </strong>
              </div>
            )}

            {/* REASON */}
            <div className="mb-6">

              <label className="mb-2 block font-semibold text-slate-700">
                Reason for Visit
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="5"
                placeholder="Briefly describe the reason for your visit..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                <FaExclamationCircle className="mt-0.5 shrink-0" />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

                <FaCheckCircle className="mt-0.5 shrink-0" />

                <span>
                  {success}
                </span>

              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                booking ||
                !formData.time ||
                loadingSlots
              }
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white transition ${
                booking ||
                !formData.time ||
                loadingSlots
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-sky-600 shadow-lg shadow-sky-600/20 hover:bg-sky-700"
              }`}
            >
              <FaCalendarAlt />

              {booking
                ? "Booking Appointment..."
                : "Confirm Appointment"}
            </button>

            <p className="mt-3 text-center text-sm text-slate-400">
              Only available doctor time slots can be booked.
            </p>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;