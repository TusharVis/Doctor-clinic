import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createEmptySchedule = () => {
  const schedule = {};

  DAYS.forEach((day) => {
    schedule[day.toLowerCase()] = {
      id: null,
      day,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false,
    };
  });

  return schedule;
};

function Schedule() {
  const [schedule, setSchedule] = useState(
    createEmptySchedule()
  );

  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState(null);
  const [deletingDay, setDeletingDay] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD SCHEDULE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token =
        localStorage.getItem("doctorToken");

      if (!token) {
        window.location.href = "/doctor-login";
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const schedules =
          response.data.schedules || [];

        const newSchedule =
          createEmptySchedule();

        schedules.forEach((item) => {
          const key =
            item.day?.toLowerCase();

          if (
            key &&
            newSchedule[key]
          ) {
            newSchedule[key] = {
              id: item._id,
              day: item.day,
              startTime:
                item.startTime || "09:00",
              endTime:
                item.endTime || "17:00",
              isAvailable:
                item.isAvailable === true,
            };
          }
        });

        setSchedule(newSchedule);
      }
    } catch (error) {
      console.error(
        "Fetch schedule error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "doctorToken"
        );

        localStorage.removeItem("doctor");

        window.location.href =
          "/doctor-login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHANGE TIME
  |--------------------------------------------------------------------------
  */

  const handleTimeChange = (
    day,
    field,
    value
  ) => {
    setSchedule((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        [field]: value,
      },
    }));

    setMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE AVAILABILITY
  |--------------------------------------------------------------------------
  */

  const handleToggle = (day) => {
    setSchedule((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        isAvailable:
          !previous[day].isAvailable,
      },
    }));

    setMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE DAY
  |--------------------------------------------------------------------------
  */

  const handleSave = async (day) => {
    const currentDay = schedule[day];

    if (!currentDay) {
      return;
    }

    if (
      currentDay.isAvailable &&
      !currentDay.startTime
    ) {
      setErrorMessage(
        `Please select a start time for ${currentDay.day}.`
      );

      return;
    }

    if (
      currentDay.isAvailable &&
      !currentDay.endTime
    ) {
      setErrorMessage(
        `Please select an end time for ${currentDay.day}.`
      );

      return;
    }

    if (
      currentDay.isAvailable &&
      currentDay.startTime >=
        currentDay.endTime
    ) {
      setErrorMessage(
        `End time must be after start time for ${currentDay.day}.`
      );

      return;
    }

    try {
      setSavingDay(day);
      setMessage("");
      setErrorMessage("");

      const token =
        localStorage.getItem(
          "doctorToken"
        );

      if (!token) {
        window.location.href =
          "/doctor-login";

        return;
      }

      const response =
        await axios.post(
          `${API_URL}/api/schedule`,
          {
            day: currentDay.day,
            startTime:
              currentDay.startTime,
            endTime:
              currentDay.endTime,
            isAvailable:
              currentDay.isAvailable,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      if (response.data.success) {
        const savedSchedule =
          response.data.schedule;

        setSchedule((previous) => ({
          ...previous,
          [day]: {
            id: savedSchedule._id,
            day: savedSchedule.day,
            startTime:
              savedSchedule.startTime,
            endTime:
              savedSchedule.endTime,
            isAvailable:
              savedSchedule.isAvailable,
          },
        }));

        setMessage(
          `${currentDay.day} schedule saved successfully.`
        );
      }
    } catch (error) {
      console.error(
        "Save schedule error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "doctorToken"
        );

        localStorage.removeItem("doctor");

        window.location.href =
          "/doctor-login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          `Unable to save ${currentDay.day} schedule.`
      );
    } finally {
      setSavingDay(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE DAY
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (day) => {
    const currentDay = schedule[day];

    if (
      !currentDay ||
      !currentDay.id
    ) {
      setSchedule((previous) => ({
        ...previous,
        [day]: {
          ...previous[day],
          isAvailable: false,
        },
      }));

      return;
    }

    try {
      setDeletingDay(day);
      setMessage("");
      setErrorMessage("");

      const token =
        localStorage.getItem(
          "doctorToken"
        );

      if (!token) {
        window.location.href =
          "/doctor-login";

        return;
      }

      const response =
        await axios.delete(
          `${API_URL}/api/schedule/${currentDay.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setSchedule((previous) => ({
          ...previous,
          [day]: {
            ...previous[day],
            id: null,
            isAvailable: false,
          },
        }));

        setMessage(
          `${currentDay.day} schedule removed.`
        );
      }
    } catch (error) {
      console.error(
        "Delete schedule error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "doctorToken"
        );

        localStorage.removeItem("doctor");

        window.location.href =
          "/doctor-login";

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to remove schedule."
      );
    } finally {
      setDeletingDay(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    localStorage.removeItem(
      "doctorToken"
    );

    localStorage.removeItem("doctor");

    window.location.href =
      "/doctor-login";
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />

          <p className="mt-4 text-slate-500">
            Loading schedule...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-[92px] items-center justify-between px-5 md:px-7">

          {/* LOGO */}

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-600 text-2xl font-bold text-white">
              +
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                MediCare
              </h1>

              <p className="text-sm text-slate-500">
                Doctor Schedule
              </p>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-lg font-semibold text-red-600 transition hover:bg-red-50"
          >
            Logout
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}

      <main className="px-5 py-5 md:px-7">

        {/* BACK */}

        <div className="flex items-start justify-between gap-6">
  {/* LEFT — HEADING */}
  <div>
    <p className="text-xl font-bold text-sky-600">
      DOCTOR SCHEDULE
    </p>

    <h1 className="mt-2 text-4xl font-bold text-slate-900 md:text-5xl">
      Manage Your Schedule
    </h1>

    <p className="mt-3 max-w-4xl text-lg leading-7 text-slate-500">
      Set your clinic working days and consultation hours.
      Patients will be able to book appointments using your
      available hours.
    </p>
  </div>

  {/* RIGHT — BACK BUTTON */}
  <button
    type="button"
    onClick={() =>
      (window.location.href = "/dashboard")
    }
    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
  >
    <FaArrowLeft />
    Back to Dashboard
  </button>
</div>

       

        {/* =========================================================
            MESSAGES
        ========================================================= */}

        {message && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
            <FaCheckCircle />
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
            <FaTimesCircle />
            {errorMessage}
          </div>
        )}

        {/* =========================================================
            WEEKLY SCHEDULE
        ========================================================= */}

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {DAYS.map((day, index) => {
            const key =
              day.toLowerCase();

            const daySchedule =
              schedule[key] || {
                id: null,
                day,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: false,
              };

            const isSaving =
              savingDay === key;

            const isDeleting =
              deletingDay === key;

            return (
              <div
                key={day}
                className={`px-4 py-4 md:px-5 ${
                  index !== DAYS.length - 1
                    ? "border-b border-slate-200"
                    : ""
                }`}
              >
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[360px_250px_1fr_auto]">

                  {/* DAY */}

                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg text-sky-600">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {day}
                      </h2>

                      <p className="text-base text-slate-500">
                        {daySchedule.isAvailable
                          ? "Working day"
                          : "Day off"}
                      </p>
                    </div>
                  </div>

                  {/* AVAILABILITY */}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggle(key)
                    }
                    className={`flex w-fit items-center gap-3 rounded-full px-3 py-2 text-base font-semibold transition ${
                      daySchedule.isAvailable
                        ? "text-green-600"
                        : "text-slate-500"
                    }`}
                  >
                    {daySchedule.isAvailable ? (
                      <>
                        <FaCheckCircle className="text-lg" />
                        Available
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-lg" />
                        Day Off
                      </>
                    )}
                  </button>

                  {/* TIMES */}

                  <div className="flex items-center gap-3">

                    <div className="relative">
                      <input
                        type="time"
                        value={
                          daySchedule.startTime
                        }
                        disabled={
                          !daySchedule.isAvailable
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            key,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="h-10 w-[98px] rounded-lg border border-slate-200 bg-white px-3 text-center text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>

                    <FaClock className="text-lg text-slate-900" />

                    <span className="text-sm font-medium text-slate-500">
                      to
                    </span>

                    <div className="relative">
                      <input
                        type="time"
                        value={
                          daySchedule.endTime
                        }
                        disabled={
                          !daySchedule.isAvailable
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            key,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="h-10 w-[98px] rounded-lg border border-slate-200 bg-white px-3 text-center text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handleSave(key)
                      }
                      disabled={isSaving}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaSave />

                      {isSaving
                        ? "Saving..."
                        : "Save"}
                    </button>

                    {daySchedule.id && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(key)
                        }
                        disabled={
                          isDeleting
                        }
                        title="Remove schedule"
                        className="flex h-10 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FaTrash />
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* =========================================================
            INFORMATION CARD
        ========================================================= */}

        <div className="mt-0 rounded-xl border border-sky-100 bg-sky-50 px-5 py-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white">
              <FaInfoCircle />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Schedule information
              </h3>

              <p className="mt-1 text-base text-slate-600">
                Patients can book appointments only
                during the working hours you set here.
                You can change your schedule at any
                time.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Schedule;