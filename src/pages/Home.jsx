import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaCalendarCheck,
  FaUserMd,
  FaHeartbeat,
  FaClock,
  FaArrowRight,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaEnvelope,
} from "react-icons/fa";

function Home() {
  // =====================================================
  // DOCTOR PUBLIC PROFILE
  // =====================================================

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET PUBLIC DOCTOR PROFILE
  // =====================================================

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/public-profile`
      );

      const data = await response.json();

      if (data.success) {
        setDoctor(data.doctor);
      }
    } catch (error) {
      console.error(
        "Home doctor profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DOCTOR DATA
  // =====================================================

  const doctorName =
    doctor?.name || "Our Doctor";

  const specialization =
    doctor?.specialization ||
    "General Physician";

  const qualification =
    doctor?.qualification ||
    "MBBS";

  // PUBLIC EMAIL
  // This is NOT the login email.
  const doctorEmail =
    doctor?.publicEmail || "";

  // PUBLIC PHONE
  const doctorPhone =
    doctor?.phone || "";

  const clinicAddress =
    doctor?.clinicAddress || "";

  const consultationFee =
    doctor?.consultationFee || 0;

  const doctorBio =
    doctor?.bio ||
    "Professional and compassionate healthcare for you and your family.";

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
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            {/* TRUSTED CARE */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">

              <FaHeartbeat />

              Trusted Medical Care

            </div>

            {/* TITLE */}

            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">

              Your Health,

              <span className="block text-sky-600">
                Our Priority
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {doctorBio}
            </p>

            {/* CLINIC ADDRESS */}

            {clinicAddress && (
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">

                <FaMapMarkerAlt className="mt-1 shrink-0 text-sky-600" />

                <span>
                  {clinicAddress}
                </span>

              </div>
            )}

            {/* PUBLIC EMAIL */}

            {doctorEmail && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">

                <FaEnvelope className="shrink-0 text-sky-600" />

                <a
                  href={`mailto:${doctorEmail}`}
                  className="transition hover:text-sky-600"
                >
                  {doctorEmail}
                </a>

              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-4">

              {/* BOOK APPOINTMENT */}

              <Link
                to="/appointment"
                className="flex items-center gap-2 rounded-full bg-sky-600 px-7 py-4 font-bold text-white shadow-xl shadow-sky-600/20 transition hover:bg-sky-700"
              >

                <FaCalendarCheck />

                Book Appointment

              </Link>

              {/* CALL DOCTOR */}

              {doctorPhone ? (

                <a
                  href={`tel:${doctorPhone}`}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
                >

                  <FaPhoneAlt />

                  Call Doctor

                </a>

              ) : (

                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-7 py-4 font-bold text-slate-400"
                >

                  <FaPhoneAlt />

                  Call Doctor

                </button>

              )}

            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">

              <div>

                <h3 className="text-2xl font-bold text-slate-900">
                  10+
                </h3>

                <p className="text-sm text-slate-500">
                  Years Experience
                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-slate-900">
                  5K+
                </h3>

                <p className="text-sm text-slate-500">
                  Happy Patients
                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-slate-900">
                  4.9
                </h3>

                <p className="text-sm text-slate-500">
                  Patient Rating
                </p>

              </div>

            </div>

          </motion.div>

          {/* =================================================
              RIGHT SIDE - DOCTOR IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative"
          >

            {/* BACKGROUND CIRCLE */}

            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-sky-200/50 blur-2xl" />

            {/* IMAGE CARD */}

            <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border-8 border-white bg-sky-100 shadow-2xl">

              {/* DOCTOR IMAGE */}

              {profileImage ? (

                <img
                  src={profileImage}
                  alt={doctorName}
                  className="h-[500px] w-full object-cover"
                />

              ) : (

                <div className="flex h-[500px] w-full items-center justify-center bg-sky-100">

                  <FaUserMd className="text-8xl text-sky-300" />

                </div>

              )}

              {/* DOCTOR INFORMATION CARD */}

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100">

                    <FaUserMd className="text-xl text-sky-600" />

                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-slate-900">

                      {doctorName}

                    </h3>

                    <p className="truncate text-sm text-slate-500">

                      {qualification}

                      {" • "}

                      {specialization}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =================================================
          SERVICES
      ================================================= */}

      <section
        id="services"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          {/* SECTION TITLE */}

          <div className="mx-auto max-w-2xl text-center">

            <span className="font-semibold text-sky-600">
              OUR SERVICES
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Complete Healthcare Services
            </h2>

            <p className="mt-4 text-slate-600">
              Quality healthcare focused on your needs and
              wellbeing.
            </p>

          </div>

          {/* SERVICE CARDS */}

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <ServiceCard
              icon={<FaHeartbeat />}
              title="General Checkup"
              text="Regular health checkups and consultation."
            />

            <ServiceCard
              icon={<FaUserMd />}
              title="Expert Consultation"
              text="Professional medical advice from an experienced doctor."
            />

            <ServiceCard
              icon={<FaCalendarCheck />}
              title="Appointments"
              text="Easy and convenient appointment booking."
            />

            <ServiceCard
              icon={<FaClock />}
              title="Follow-up Care"
              text="Continuous care and follow-up for your health."
            />

          </div>

        </div>

      </section>

      {/* =================================================
          DOCTOR INFORMATION
      ================================================= */}

      {doctor && (
        <section className="bg-slate-50 py-16">

          <div className="mx-auto max-w-7xl px-6">

            <div className="grid gap-8 md:grid-cols-2">

              {/* =================================================
                  ABOUT DOCTOR
              ================================================= */}

              <div className="rounded-3xl bg-white p-8 shadow-sm">

                <span className="font-semibold text-sky-600">
                  ABOUT DOCTOR
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {doctorName}
                </h2>

                <p className="mt-2 font-semibold text-sky-600">
                  {specialization}
                </p>

                <p className="mt-5 leading-7 text-slate-600">
                  {doctorBio}
                </p>

                {/* PUBLIC EMAIL */}

                {doctorEmail && (
                  <div className="mt-6 flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                      <FaEnvelope />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Public Email
                      </p>

                      <a
                        href={`mailto:${doctorEmail}`}
                        className="font-semibold text-slate-900 transition hover:text-sky-600"
                      >
                        {doctorEmail}
                      </a>

                    </div>

                  </div>
                )}

              </div>

              {/* =================================================
                  CLINIC INFORMATION
              ================================================= */}

              <div className="rounded-3xl bg-white p-8 shadow-sm">

                <span className="font-semibold text-sky-600">
                  CLINIC INFORMATION
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Visit Our Clinic
                </h2>

                {/* QUALIFICATION */}

                <div className="mt-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                    <FaUserMd />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Qualification
                    </p>

                    <p className="font-semibold text-slate-900">
                      {qualification}
                    </p>

                  </div>

                </div>

                {/* PUBLIC EMAIL */}

                {doctorEmail && (
                  <div className="mt-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                      <FaEnvelope />

                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-slate-500">
                        Email
                      </p>

                      <a
                        href={`mailto:${doctorEmail}`}
                        className="break-all font-semibold text-slate-900 transition hover:text-sky-600"
                      >
                        {doctorEmail}
                      </a>

                    </div>

                  </div>
                )}

                {/* PHONE */}

                {doctorPhone && (
                  <div className="mt-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                      <FaPhoneAlt />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Phone
                      </p>

                      <a
                        href={`tel:${doctorPhone}`}
                        className="font-semibold text-slate-900 transition hover:text-sky-600"
                      >
                        {doctorPhone}
                      </a>

                    </div>

                  </div>
                )}

                {/* ADDRESS */}

                {clinicAddress && (

                  <div className="mt-5 flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                      <FaMapMarkerAlt />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Clinic Address
                      </p>

                      <p className="font-semibold text-slate-900">
                        {clinicAddress}
                      </p>

                    </div>

                  </div>

                )}

                {/* CONSULTATION FEE */}

                <div className="mt-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">

                    <FaRupeeSign />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Consultation Fee
                    </p>

                    <p className="font-semibold text-slate-900">
                      ₹{consultationFee}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          CTA
      ================================================= */}

      <section className="bg-sky-600 py-16">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Need a Doctor?
            </h2>

            <p className="mt-2 text-sky-100">
              Schedule your appointment today.
            </p>

          </div>

          <div className="flex flex-wrap justify-center gap-3">

            <Link
              to="/appointment"
              className="flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-sky-600 transition hover:bg-sky-50"
            >

              Book Appointment

              <FaArrowRight />

            </Link>

            {doctorPhone && (

              <a
                href={`tel:${doctorPhone}`}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-sky-700 px-7 py-4 font-bold text-white transition hover:bg-sky-800"
              >

                <FaPhoneAlt />

                Call Now

              </a>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}

// =====================================================
// SERVICE CARD
// =====================================================

function ServiceCard({
  icon,
  title,
  text,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      className="rounded-2xl border border-slate-100 bg-slate-50 p-7 shadow-sm transition hover:shadow-xl"
    >

      {/* ICON */}

      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-2xl text-sky-600">

        {icon}

      </div>

      {/* TITLE */}

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p className="mt-3 leading-7 text-slate-600">
        {text}
      </p>

      {/* LEARN MORE */}

      <Link
        to="/appointment"
        className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-600 transition hover:text-sky-700"
      >

        Learn More

        <FaArrowRight />

      </Link>

    </motion.div>
  );
}

export default Home;