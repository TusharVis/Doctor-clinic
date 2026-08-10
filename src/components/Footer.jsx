import { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const [doctor, setDoctor] = useState(null);

  // =====================================================
  // GET PUBLIC DOCTOR PROFILE
  // =====================================================

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/public-profile"
      );

      if (response.data.success) {
        setDoctor(response.data.doctor);
      }
    } catch (error) {
      console.error(
        "Footer doctor profile error:",
        error
      );
    }
  };

  // =====================================================
  // PUBLIC DOCTOR DATA
  // =====================================================

  const doctorPhone =
    doctor?.phone || "";

  const doctorAddress =
    doctor?.clinicAddress || "";

  const doctorName =
    doctor?.name || "MediCare";

  const doctorSpecialization =
    doctor?.specialization ||
    "Professional Healthcare";

  // =====================================================
  // WHATSAPP NUMBER
  // =====================================================

  // Remove spaces and other characters
  // so WhatsApp gets a valid phone number.

  const whatsappNumber =
    doctorPhone.replace(
      /\D/g,
      ""
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <footer className="bg-slate-950 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* =================================================
            ABOUT
        ================================================= */}

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-xl font-bold">
              +
            </div>

            <div>

              <h2 className="text-xl font-bold">
                MediCare
              </h2>

              <p className="text-xs text-slate-500">
                {doctorSpecialization}
              </p>

            </div>

          </div>

          <p className="mt-5 leading-7 text-slate-400">

            Professional healthcare focused on
            providing compassionate and reliable
            medical care.

          </p>

          <div className="mt-6 flex gap-3">

            {/* FACEBOOK */}

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-sky-600"
            >
              <FaFacebookF />
            </a>

            {/* INSTAGRAM */}

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-sky-600"
            >
              <FaInstagram />
            </a>

            {/* WHATSAPP */}

            {whatsappNumber ? (

              <a
                href={`https://wa.me/91${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-green-500"
              >
                <FaWhatsapp />
              </a>

            ) : (

              <div
                aria-label="WhatsApp unavailable"
                className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-slate-800 text-slate-600"
              >
                <FaWhatsapp />
              </div>

            )}

          </div>

        </div>

        {/* =================================================
            QUICK LINKS
        ================================================= */}

        <div>

          <h3 className="text-lg font-bold">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-slate-400">

            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="transition hover:text-white"
            >
              About Doctor
            </Link>

            <Link
              to="/appointment"
              className="transition hover:text-white"
            >
              Appointment
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>

          </div>

        </div>

        {/* =================================================
            SERVICES
        ================================================= */}

        <div>

          <h3 className="text-lg font-bold">
            Services
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-slate-400">

            <p>
              General Checkup
            </p>

            <p>
              Medical Consultation
            </p>

            <p>
              Follow-up Care
            </p>

            <p>
              Health Checkup
            </p>

          </div>

        </div>

        {/* =================================================
            CONTACT
        ================================================= */}

        <div>

          <h3 className="text-lg font-bold">
            Contact Us
          </h3>

          <div className="mt-5 space-y-5 text-slate-400">

            {/* =================================================
                PHONE
            ================================================= */}

            {doctorPhone ? (

              <a
                href={`tel:${doctorPhone}`}
                className="flex gap-3 transition hover:text-white"
              >

                <FaPhoneAlt className="mt-1 shrink-0 text-sky-500" />

                <span>
                  {doctorPhone}
                </span>

              </a>

            ) : (

              <div className="flex gap-3">

                <FaPhoneAlt className="mt-1 shrink-0 text-sky-500" />

                <span>
                  Phone not available
                </span>

              </div>

            )}

            {/* =================================================
                CLINIC ADDRESS
            ================================================= */}

            <div className="flex gap-3">

              <FaMapMarkerAlt className="mt-1 shrink-0 text-sky-500" />

              {doctorAddress ? (

                <span>
                  {doctorAddress}
                </span>

              ) : (

                <span>
                  Clinic address not available
                </span>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">

        © {new Date().getFullYear()}{" "}

        {doctorName !== "MediCare"
          ? doctorName
          : "MediCare"}

        . All rights reserved.

      </div>

    </footer>
  );
}

export default Footer;