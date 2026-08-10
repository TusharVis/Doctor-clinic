import { useEffect, useState } from "react";

import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaUserMd,
  FaCalendarCheck,
} from "react-icons/fa";

import {
  NavLink,
  Link,
} from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [doctor, setDoctor] =
    useState(null);

  // =====================================================
  // GET PUBLIC DOCTOR PROFILE
  // =====================================================

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/public-profile`
      );

      const data =
        await response.json();

      if (data.success) {
        setDoctor(data.doctor);
      }
    } catch (error) {
      console.error(
        "Navbar doctor profile error:",
        error
      );
    }
  };

  // =====================================================
  // PUBLIC DOCTOR PHONE
  // =====================================================
  // This comes from PublicDoctorProfile.
  // It is NOT the login email/password.
  // =====================================================

  const doctorPhone =
    doctor?.phone || "";

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navItems = [
    {
      label: "Home",
      to: "/",
    },

    {
      label: "About",
      to: "/about",
    },

    {
      label: "Services",
      to: "/#services",
    },

    {
      label: "Appointment",
      to: "/appointment",
    },

    {
      label: "Check Appointment",
      to: "/appointment-status",
    },

    {
      label: "Contact",
      to: "/contact",
    },
  ];

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="w-full border-b border-slate-100 bg-white">

      {/* =================================================
          DESKTOP NAVBAR
      ================================================= */}

      <div className="mx-auto hidden min-h-[76px] max-w-[1600px] items-center px-5 lg:flex">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="flex min-w-[210px] items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-xl text-white shadow-sm">
            <FaUserMd />
          </div>

          <div>

            <h1 className="text-xl font-extrabold text-slate-900">
              MediCare
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Your Health, Our Priority
            </p>

          </div>

        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex flex-1 items-center justify-center gap-1">

          {navItems.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                }`
              }
            >

              {item.label}

            </NavLink>

          ))}

        </nav>

        {/* =================================================
            RIGHT BUTTONS
        ================================================= */}

        <div className="flex min-w-[300px] items-center justify-end gap-3">

          {/* =================================================
              CALL NOW
          ================================================= */}

          {doctorPhone ? (

            <a
              href={`tel:${doctorPhone}`}
              className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-600 transition hover:bg-sky-50"
            >

              <FaPhoneAlt />

              Call Now

            </a>

          ) : (

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400"
            >

              <FaPhoneAlt />

              Call Now

            </button>

          )}

          {/* =================================================
              DOCTOR LOGIN
          ================================================= */}

          <Link
            to="/doctor-login"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
          >

            <FaUserMd />

            Doctor Login

          </Link>

          {/* =================================================
              BOOK APPOINTMENT
          ================================================= */}

          <Link
            to="/appointment"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
          >

            <FaCalendarCheck />

            Book Appointment

          </Link>

        </div>

      </div>

      {/* =================================================
          MOBILE NAVBAR
      ================================================= */}

      <div className="flex min-h-[70px] items-center justify-between px-4 lg:hidden">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg text-white">
            <FaUserMd />
          </div>

          <div>

            <h1 className="text-lg font-extrabold text-slate-900">
              MediCare
            </h1>

            <p className="text-[10px] text-slate-500">
              Your Health, Our Priority
            </p>

          </div>

        </Link>

        {/* =================================================
            MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="rounded-xl bg-slate-100 p-3 text-lg text-slate-700 transition hover:bg-slate-200"
          aria-label="Toggle navigation"
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

        <div className="border-t border-slate-200 bg-white px-4 pb-5 lg:hidden">

          <nav className="space-y-1 pt-3">

            {/* =================================================
                NAVIGATION LINKS
            ================================================= */}

            {navItems.map((item) => (

              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >

                {item.label}

              </NavLink>

            ))}

            {/* =================================================
                MOBILE CALL NOW
            ================================================= */}

            {doctorPhone ? (

              <a
                href={`tel:${doctorPhone}`}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50"
              >

                <FaPhoneAlt />

                Call Now

              </a>

            ) : (

              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400">

                <FaPhoneAlt />

                Phone not available

              </div>

            )}

            {/* =================================================
                MOBILE DOCTOR LOGIN
            ================================================= */}

            <NavLink
              to="/doctor-login"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >

              <FaUserMd />

              Doctor Login

            </NavLink>

            {/* =================================================
                MOBILE BOOK APPOINTMENT
            ================================================= */}

            <Link
              to="/appointment"
              onClick={closeMobileMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700"
            >

              <FaCalendarCheck />

              Book Appointment

            </Link>

          </nav>

        </div>

      )}

    </header>
  );
}

export default Navbar;