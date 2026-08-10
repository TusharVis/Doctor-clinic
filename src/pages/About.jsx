import { useEffect, useState } from "react";

import {
  FaUserMd,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaGraduationCap,
  FaEnvelope,
  FaHeartbeat,
} from "react-icons/fa";

function About() {
  // =====================================================
  // DOCTOR PUBLIC PROFILE
  // =====================================================

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PUBLIC DOCTOR PROFILE
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
        "About doctor profile error:",
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
            Loading doctor information...
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

  const qualification =
    doctor?.qualification ||
    "MBBS";

  // IMPORTANT:
  // This is PUBLIC EMAIL.
  // It is NOT the doctor's login email.
  const publicEmail =
    doctor?.publicEmail || "";

  const phone =
    doctor?.phone || "";

  const clinicAddress =
    doctor?.clinicAddress || "";

  const consultationFee =
    doctor?.consultationFee || 0;

  const bio =
    doctor?.bio ||
    "Professional and compassionate healthcare focused on patient wellbeing.";

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
  // PAGE
  // =====================================================

  return (
    <main className="bg-slate-50">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="bg-gradient-to-br from-sky-50 via-white to-cyan-50">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <span className="font-semibold text-sky-600">
            ABOUT US
          </span>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">
            About Our Doctor
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Get to know our doctor, qualifications,
            experience and clinic information.
          </p>

        </div>

      </section>


      {/* =================================================
          DOCTOR PROFILE
      ================================================= */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* =================================================
                DOCTOR IMAGE
            ================================================= */}

            <div className="relative">

              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-sky-200/50 blur-3xl" />

              <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border-8 border-white bg-sky-100 shadow-2xl">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt={doctorName}
                    className="h-[500px] w-full object-cover"
                  />

                ) : (

                  <div className="flex h-[500px] w-full items-center justify-center">

                    <FaUserMd className="text-9xl text-sky-300" />

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                DOCTOR INFORMATION
            ================================================= */}

            <div>

              <span className="font-semibold text-sky-600">
                MEET OUR DOCTOR
              </span>

              <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
                {doctorName}
              </h2>

              <p className="mt-2 text-xl font-semibold text-sky-600">
                {specialization}
              </p>


              {/* =================================================
                  BIO
              ================================================= */}

              <p className="mt-6 leading-8 text-slate-600">
                {bio}
              </p>


              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="mt-8 space-y-5">

                {/* =================================================
                    QUALIFICATION
                ================================================= */}

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                    <FaGraduationCap />

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
                    PUBLIC EMAIL
                ================================================= */}

                {publicEmail && (

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                      <FaEnvelope />

                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-slate-500">
                        Email
                      </p>

                      <a
                        href={`mailto:${publicEmail}`}
                        className="break-all font-bold text-slate-900 transition hover:text-sky-600"
                      >
                        {publicEmail}
                      </a>

                    </div>

                  </div>

                )}


                {/* =================================================
                    PHONE
                ================================================= */}

                {phone && (

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                      <FaPhoneAlt />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Phone Number
                      </p>

                      <a
                        href={`tel:${phone}`}
                        className="font-bold text-slate-900 transition hover:text-sky-600"
                      >
                        {phone}
                      </a>

                    </div>

                  </div>

                )}


                {/* =================================================
                    CLINIC ADDRESS
                ================================================= */}

                {clinicAddress && (

                  <div className="flex items-start gap-4">

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
                    CONSULTATION FEE
                ================================================= */}

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">

                    <FaRupeeSign />

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

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          WHY CHOOSE US
      ================================================= */}

      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <span className="font-semibold text-sky-600">
              WHY CHOOSE US
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Quality Healthcare You Can Trust
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              We focus on providing professional,
              compassionate and convenient healthcare.
            </p>

          </div>


          {/* =================================================
              CARDS
          ================================================= */}

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* CARD 1 */}

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-2xl text-sky-600">

                <FaUserMd />

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Experienced Doctor
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Professional medical consultation
                focused on your health.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-2xl text-sky-600">

                <FaHeartbeat />

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Patient Focused
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Every patient receives personal
                attention and care.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-2xl text-sky-600">

                <FaPhoneAlt />

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Easy Contact
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Contact the doctor easily for
                appointments and consultation.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;