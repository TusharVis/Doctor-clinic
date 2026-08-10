import { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Contact() {
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
        "Contact doctor profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />

          <p className="mt-4 text-slate-500">
            Loading contact information...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // DOCTOR DATA
  // =====================================================

  const doctorName =
    doctor?.name || "Our Doctor";

  const specialization =
    doctor?.specialization ||
    "General Physician";

  const phone =
    doctor?.phone || "";

  const clinicAddress =
    doctor?.clinicAddress || "";

  const consultationFee =
    doctor?.consultationFee || 0;

  const qualification =
    doctor?.qualification || "MBBS";

  const bio =
    doctor?.bio ||
    "Professional and compassionate healthcare for you and your family.";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-gradient-to-br from-sky-50 via-white to-cyan-50">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <span className="font-semibold text-sky-600">
            CONTACT US
          </span>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Get In Touch
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Contact {doctorName} for appointments,
            consultations and healthcare information.
          </p>

        </div>

      </section>


      {/* =================================================
          CONTACT SECTION
      ================================================= */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* =================================================
                LEFT - DOCTOR INFORMATION
            ================================================= */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <span className="font-semibold text-sky-600">
                DOCTOR INFORMATION
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {doctorName}
              </h2>

              <p className="mt-2 font-semibold text-sky-600">
                {specialization}
              </p>

              <p className="mt-5 leading-7 text-slate-600">
                {bio}
              </p>


              {/* =================================================
                  PHONE
              ================================================= */}

              {phone && (
                <div className="mt-8 flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                    <FaPhoneAlt />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Phone
                    </p>

                    <a
                      href={`tel:${phone}`}
                      className="text-lg font-bold text-slate-900 hover:text-sky-600"
                    >
                      {phone}
                    </a>

                  </div>

                </div>
              )}


              {/* =================================================
                  ADDRESS
              ================================================= */}

              {clinicAddress && (
                <div className="mt-6 flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                    <FaMapMarkerAlt />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Clinic Address
                    </p>

                    <p className="font-bold leading-6 text-slate-900">
                      {clinicAddress}
                    </p>

                  </div>

                </div>
              )}


              {/* =================================================
                  QUALIFICATION
              ================================================= */}

              <div className="mt-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                  <FaUserMd />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Qualification
                  </p>

                  <p className="font-bold text-slate-900">
                    {qualification}
                  </p>

                </div>

              </div>


              {/* =================================================
                  CONSULTATION FEE
              ================================================= */}

              <div className="mt-6 flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                  ₹

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Consultation Fee
                  </p>

                  <p className="font-bold text-slate-900">
                    ₹{consultationFee}
                  </p>

                </div>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/appointment"
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-bold text-white transition hover:bg-sky-700"
                >

                  <FaCalendarCheck />

                  Book Appointment

                </Link>


                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
                  >

                    <FaPhoneAlt />

                    Call Now

                  </a>
                )}

              </div>

            </div>


            {/* =================================================
                RIGHT - CLINIC
            ================================================= */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <span className="font-semibold text-sky-600">
                VISIT OUR CLINIC
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Clinic Information
              </h2>


              {/* =================================================
                  ADDRESS CARD
              ================================================= */}

              <div className="mt-8 rounded-2xl bg-sky-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                    <FaMapMarkerAlt />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Clinic Address
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {clinicAddress ||
                        "Clinic address not available."}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  DOCTOR
              ================================================= */}

              <div className="mt-5 rounded-2xl bg-slate-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                    <FaUserMd />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      {doctorName}
                    </h3>

                    <p className="mt-1 text-sky-600">
                      {specialization}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {qualification}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CONTACT HOURS
              ================================================= */}

              <div className="mt-5 rounded-2xl bg-slate-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                    <FaClock />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Consultation
                    </h3>

                    <p className="mt-1 text-slate-600">
                      Please book an appointment
                      before visiting.
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CALL BUTTON
              ================================================= */}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-4 font-bold text-white transition hover:bg-sky-700"
                >

                  <FaPhoneAlt />

                  Call {doctorName}

                </a>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section className="bg-sky-600 py-16">

        <div className="mx-auto max-w-7xl px-6 text-center">

          <h2 className="text-3xl font-bold text-white">
            Need an Appointment?
          </h2>

          <p className="mt-3 text-sky-100">
            Book your appointment with{" "}
            {doctorName} today.
          </p>

          <Link
            to="/appointment"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-sky-600 transition hover:bg-sky-50"
          >

            <FaCalendarCheck />

            Book Appointment

          </Link>

        </div>

      </section>

    </main>
  );
}

export default Contact;