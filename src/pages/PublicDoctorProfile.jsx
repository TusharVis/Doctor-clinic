import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaStethoscope,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCamera,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";

function PublicDoctorProfile() {
  // =====================================================
  // PUBLIC PROFILE DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    publicEmail: "",
    specialization: "",
    qualification: "",
    phone: "",
    clinicAddress: "",
    consultationFee: "",
    bio: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // LOAD PUBLIC PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  // =====================================================
  // GET DOCTOR PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
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
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        const doctor =
          response.data.doctor;

        setFormData({
          name: doctor.name || "",

          // =================================================
          // PUBLIC EMAIL
          // IMPORTANT:
          // This is NOT the login email.
          // =================================================

          publicEmail:
            doctor.publicEmail || "",

          specialization:
            doctor.specialization || "",

          qualification:
            doctor.qualification || "",

          phone:
            doctor.phone || "",

          clinicAddress:
            doctor.clinicAddress || "",

          consultationFee:
            doctor.consultationFee || "",

          bio:
            doctor.bio || "",

          profileImage:
            doctor.profileImage || "",
        });
      }
    } catch (error) {
      console.error(
        "Public profile loading error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load public profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrorMessage(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image size must be less than 5 MB."
      );

      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getProfileImage = () => {
    if (imagePreview) {
      return imagePreview;
    }

    if (!formData.profileImage) {
      return "";
    }

    if (
      formData.profileImage.startsWith(
        "http://"
      ) ||
      formData.profileImage.startsWith(
        "https://"
      )
    ) {
      return formData.profileImage;
    }

    return `${import.meta.env.VITE_API_URL}${formData.profileImage}`;
  };

  const profileImage =
    getProfileImage();

  // =====================================================
  // SAVE PUBLIC PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const token =
        localStorage.getItem(
          "doctorToken"
        );

      if (!token) {
        window.location.href =
          "/doctor-login";

        return;
      }

      const data =
        new FormData();

      // =================================================
      // PUBLIC PROFILE INFORMATION
      // =================================================

      data.append(
        "name",
        formData.name
      );

      // IMPORTANT:
      // PUBLIC EMAIL ONLY
      //
      // DO NOT use:
      // data.append("email", ...)
      //
      // Login email must remain separate.
      // =================================================

      data.append(
        "publicEmail",
        formData.publicEmail
      );

      data.append(
        "specialization",
        formData.specialization
      );

      data.append(
        "qualification",
        formData.qualification
      );

      data.append(
        "phone",
        formData.phone
      );

      data.append(
        "clinicAddress",
        formData.clinicAddress
      );

      data.append(
        "consultationFee",
        formData.consultationFee
      );

      data.append(
        "bio",
        formData.bio
      );

      // =================================================
      // IMAGE
      // =================================================

      if (selectedImage) {
        data.append(
          "profileImage",
          selectedImage
        );
      }

      const response =
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        const updatedDoctor =
          response.data.doctor;

        // =================================================
        // KEEP LOGIN EMAIL UNCHANGED
        // =================================================

        const oldDoctor =
          JSON.parse(
            localStorage.getItem(
              "doctor"
            ) || "{}"
          );

        localStorage.setItem(
          "doctor",
          JSON.stringify({
            ...oldDoctor,

            // Updated public information
            ...updatedDoctor,

            // IMPORTANT:
            // Always preserve the existing login email.
            email:
              oldDoctor.email ||
              updatedDoctor.email,
          })
        );

        // =================================================
        // UPDATE FORM
        // =================================================

        setFormData({
          name:
            updatedDoctor.name || "",

          publicEmail:
            updatedDoctor.publicEmail ||
            "",

          specialization:
            updatedDoctor.specialization ||
            "",

          qualification:
            updatedDoctor.qualification ||
            "",

          phone:
            updatedDoctor.phone || "",

          clinicAddress:
            updatedDoctor.clinicAddress ||
            "",

          consultationFee:
            updatedDoctor.consultationFee ||
            "",

          bio:
            updatedDoctor.bio || "",

          profileImage:
            updatedDoctor.profileImage ||
            "",
        });

        setSelectedImage(null);

        if (imagePreview) {
          URL.revokeObjectURL(
            imagePreview
          );
        }

        setImagePreview("");

        setMessage(
          "Public profile saved successfully."
        );
      }
    } catch (error) {
      console.error(
        "Save public profile error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to save public profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />

          <p className="mt-4 text-slate-500">
            Loading public profile...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex min-h-[85px] max-w-7xl items-center justify-between px-5">

          <div>

            <p className="text-sm font-semibold text-sky-600">
              PUBLIC PROFILE
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Public Profile Settings
            </h1>

          </div>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/dashboard")
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
          >

            <h2 className="text-2xl font-bold text-slate-900">
              Doctor Information
            </h2>

            <p className="mt-2 text-slate-500">
              This information will be visible to normal
              patients on your website.
            </p>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <FormField
                label="Doctor Name"
                icon={<FaUserMd />}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Tushar"
                required
              />

              {/* =================================================
                  PUBLIC EMAIL
              ================================================= */}

              <FormField
                label="Public Email"
                icon={<FaEnvelope />}
                name="publicEmail"
                type="email"
                value={
                  formData.publicEmail
                }
                onChange={handleChange}
                placeholder="doctor@clinic.com"
              />

              <FormField
                label="Specialization"
                icon={<FaStethoscope />}
                name="specialization"
                value={
                  formData.specialization
                }
                onChange={handleChange}
                placeholder="General Physician"
              />

              <FormField
                label="Qualification"
                icon={<FaGraduationCap />}
                name="qualification"
                value={
                  formData.qualification
                }
                onChange={handleChange}
                placeholder="MBBS, MD"
              />

              <FormField
                label="Phone Number"
                icon={<FaPhone />}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />

              <FormField
                label="Consultation Fee"
                icon={<FaRupeeSign />}
                name="consultationFee"
                type="number"
                value={
                  formData.consultationFee
                }
                onChange={handleChange}
                placeholder="500"
                min="0"
              />

            </div>

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}

            <div className="mt-8 border-t border-slate-100 pt-8">

              <h3 className="text-xl font-bold text-slate-900">
                Profile Photo
              </h3>

              <div className="mt-5 flex items-center gap-6">

                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-5xl text-sky-600">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Doctor"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserMd />
                  )}

                </div>

                <div>

                  <label
                    htmlFor="profileImage"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700"
                  >

                    <FaCamera />

                    Choose Photo

                  </label>

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    JPG, PNG or WEBP • Maximum 5 MB
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                CLINIC ADDRESS
            ================================================= */}

            <div className="mt-8 border-t border-slate-100 pt-8">

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <FaMapMarkerAlt className="text-sky-600" />

                Clinic Address

              </label>

              <textarea
                name="clinicAddress"
                value={
                  formData.clinicAddress
                }
                onChange={handleChange}
                rows="3"
                placeholder="Enter complete clinic address"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* =================================================
                ABOUT DOCTOR
            ================================================= */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                About Doctor
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short professional introduction..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* =================================================
                MESSAGES
            ================================================= */}

            {message && (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
                ✓ {message}
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
                ⚠ {errorMessage}
              </div>
            )}

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="mt-8 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-7 py-3.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              >

                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Public Profile"}

              </button>

            </div>

          </form>

          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-sky-600">
              LIVE PREVIEW
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Patient View
            </h2>

            {/* IMAGE */}

            <div className="mt-7 flex justify-center">

              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-6xl text-sky-600">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Doctor"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserMd />
                )}

              </div>

            </div>

            {/* NAME */}

            <div className="mt-5 text-center">

              <h3 className="text-2xl font-bold text-slate-900">
                {formData.name ||
                  "Dr. Doctor Name"}
              </h3>

              <p className="mt-2 font-semibold text-sky-600">
                {formData.specialization ||
                  "General Physician"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {formData.qualification ||
                  "MBBS, MD"}
              </p>

            </div>

            {/* DETAILS */}

            <div className="mt-6 space-y-3">

              {formData.publicEmail && (
                <PreviewItem
                  icon={<FaEnvelope />}
                  text={
                    formData.publicEmail
                  }
                />
              )}

              {formData.phone && (
                <PreviewItem
                  icon={<FaPhone />}
                  text={formData.phone}
                />
              )}

              {formData.clinicAddress && (
                <PreviewItem
                  icon={
                    <FaMapMarkerAlt />
                  }
                  text={
                    formData.clinicAddress
                  }
                />
              )}

              {formData.consultationFee && (
                <PreviewItem
                  icon={<FaRupeeSign />}
                  text={`₹${formData.consultationFee} consultation`}
                />
              )}

            </div>

            {/* BIO */}

            {formData.bio && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                <p className="text-sm leading-6 text-slate-600">
                  {formData.bio}
                </p>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// FORM FIELD
// =====================================================

function FormField({
  label,
  icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

        <span className="text-sky-600">
          {icon}
        </span>

        {label}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />

    </div>
  );
}

// =====================================================
// PREVIEW ITEM
// =====================================================

function PreviewItem({
  icon,
  text,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">

      <span className="mt-0.5 text-sky-600">
        {icon}
      </span>

      <span className="text-sm text-slate-600">
        {text}
      </span>

    </div>
  );
}

export default PublicDoctorProfile;