import { useState } from "react";

import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserMd,
  FaClipboardList,
  FaCalendarCheck,
  FaUser,
  FaClock,
  FaGlobe,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function DoctorNavbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  // =====================================================
  // GET DOCTOR DATA
  // =====================================================

  const doctor = JSON.parse(
    localStorage.getItem("doctor") || "{}"
  );

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

    return `http://localhost:5000${doctor.profileImage}`;
  };

  const profileImage =
    getProfileImage();

  // =====================================================
  // DOCTOR INFORMATION
  // =====================================================

  const doctorName =
    doctor?.name || "Doctor";

  const specialization =
    doctor?.specialization ||
    "Medical Professional";

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <FaClipboardList />,
    },

    {
      label: "Appointments",
      to: "/appointments",
      icon: <FaCalendarCheck />,
    },

    {
      label: "Patients",
      to: "/patients",
      icon: <FaUser />,
    },

    {
      label: "Schedule",
      to: "/schedule",
      icon: <FaClock />,
    },

    {
      label: "Profile",
      to: "/doctor-profile",
      icon: <FaUserMd />,
    },

    {
      label: "Public Profile",
      to: "/public-doctor-profile",
      icon: <FaGlobe />,
    },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">

      {/* =================================================
          DESKTOP NAVBAR
      ================================================= */}

      <div className="mx-auto hidden h-[100px] max-w-[1600px] items-center px-5 lg:flex">

        {/* =================================================
            DOCTOR PROFILE
        ================================================= */}

        <NavLink
          to="/doctor-profile"
          className="flex min-w-[270px] items-center gap-4 rounded-xl px-2 py-2 transition hover:bg-slate-50"
        >

          {/* PROFILE IMAGE */}

          {profileImage ? (
            <img
              src={profileImage}
              alt={doctorName}
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-sky-100"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl text-sky-600">
              <FaUserMd />
            </div>
          )}

          {/* DOCTOR NAME */}

          <div className="min-w-0">

            <p className="truncate text-base font-bold text-slate-900">
              Dr.{" "}
              {doctorName.replace(
                /^Dr\.\s*/i,
                ""
              )}
            </p>

            <p className="truncate text-sm text-slate-500">
              {specialization}
            </p>

          </div>

        </NavLink>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="flex flex-1 items-center justify-center gap-1">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                }`
              }
            >

              <span className="text-base">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>
          ))}

        </nav>


        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="flex min-w-[100px] justify-end">

          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >

            <FaSignOutAlt />

            <span className="hidden xl:inline">
              Logout
            </span>

          </button>

        </div>

      </div>


      {/* =================================================
          MOBILE NAVBAR
      ================================================= */}

      <div className="flex min-h-[76px] items-center justify-between px-4 lg:hidden">

        {/* =================================================
            MOBILE DOCTOR PROFILE
        ================================================= */}

        <NavLink
          to="/doctor-profile"
          onClick={() =>
            setMobileOpen(false)
          }
          className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-slate-50"
        >

          {/* MOBILE IMAGE */}

          {profileImage ? (
            <img
              src={profileImage}
              alt={doctorName}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-100"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-600">
              <FaUserMd />
            </div>
          )}

          {/* MOBILE DOCTOR NAME */}

          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-slate-900">
              Dr.{" "}
              {doctorName.replace(
                /^Dr\.\s*/i,
                ""
              )}
            </p>

            <p className="truncate text-xs text-slate-500">
              {specialization}
            </p>

          </div>

        </NavLink>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="rounded-xl bg-slate-100 p-3 text-lg text-slate-700 transition hover:bg-slate-200"
          aria-label="Toggle menu"
        >

          {mobileOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}

        </button>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 lg:hidden">

          <nav className="space-y-1 pt-3">

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >

                <span className="text-base">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </NavLink>
            ))}


            {/* =================================================
                MOBILE LOGOUT
            ================================================= */}

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >

              <FaSignOutAlt />

              <span>
                Logout
              </span>

            </button>

          </nav>

        </div>
      )}

    </header>
  );
}

export default DoctorNavbar;