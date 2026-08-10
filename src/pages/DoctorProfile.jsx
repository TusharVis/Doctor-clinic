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
  FaSave,
  FaArrowLeft,
  FaCamera,
  FaLock,
  FaKey,
  FaEdit,
} from "react-icons/fa";

function DoctorProfile() {
  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
  // CHANGE PASSWORD
  // =====================================================

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // =====================================================
  // CHANGE LOGIN EMAIL
  // =====================================================

  const [emailData, setEmailData] =
    useState({
      currentPassword: "",
      newEmail: "",
      confirmEmail: "",
    });

  const [changingEmail, setChangingEmail] =
    useState(false);

  const [emailMessage, setEmailMessage] =
    useState("");

  const [emailError, setEmailError] =
    useState("");

  // =====================================================
  // LOAD PROFILE
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
  // FETCH PROFILE
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
          email: doctor.email || "",
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

        // Keep localStorage synchronized
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
            ...doctor,
          })
        );
      }
    } catch (error) {
      console.error(
        "Fetch profile error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        logout();
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PROFILE INPUT
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

    if (!file) {
      return;
    }

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
        "Please select JPG, JPEG, PNG or WEBP image."
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(preview);

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  const getProfileImageUrl = () => {
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

  // =====================================================
  // SAVE NORMAL PROFILE
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
        logout();
        return;
      }

      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      // IMPORTANT:
      // Login email is NOT sent here.
      //
      // Public email is separate.
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
            ...updatedDoctor,

            // Always keep login email
            email:
              oldDoctor.email ||
              updatedDoctor.email,
          })
        );

        setFormData((previous) => ({
          ...previous,

          name:
            updatedDoctor.name || "",

          email:
            oldDoctor.email ||
            updatedDoctor.email ||
            "",

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
        }));

        setSelectedImage(null);

        if (imagePreview) {
          URL.revokeObjectURL(
            imagePreview
          );
        }

        setImagePreview("");

        setMessage(
          "Profile updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        logout();
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PASSWORD INPUT
  // =====================================================

  const handlePasswordChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setPasswordData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setPasswordMessage("");
    setPasswordError("");
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (
    e
  ) => {
    e.preventDefault();

    setChangingPassword(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      const token =
        localStorage.getItem(
          "doctorToken"
        );

      if (!token) {
        logout();
        return;
      }

      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setPasswordError(
          "Please fill all password fields."
        );

        setChangingPassword(false);
        return;
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        setPasswordError(
          "New password and confirm password do not match."
        );

        setChangingPassword(false);
        return;
      }

      if (
        passwordData.newPassword.length <
        6
      ) {
        setPasswordError(
          "New password must be at least 6 characters long."
        );

        setChangingPassword(false);
        return;
      }

      const response =
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
          {
            currentPassword:
              passwordData.currentPassword,

            newPassword:
              passwordData.newPassword,

            confirmPassword:
              passwordData.confirmPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setPasswordMessage(
          "Password changed successfully."
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      if (
        error.response?.status === 401 &&
        error.response?.data?.message !==
          "Current password is incorrect."
      ) {
        logout();
        return;
      }

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOGIN EMAIL INPUT
  // =====================================================

  const handleEmailChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setEmailData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setEmailMessage("");
    setEmailError("");
  };

  // =====================================================
  // CHANGE LOGIN EMAIL
  // =====================================================

  const handleChangeLoginEmail =
    async (e) => {
      e.preventDefault();

      setChangingEmail(true);
      setEmailMessage("");
      setEmailError("");

      try {
        const token =
          localStorage.getItem(
            "doctorToken"
          );

        if (!token) {
          logout();
          return;
        }

        const currentPassword =
          emailData.currentPassword.trim();

        const newEmail =
          emailData.newEmail
            .trim()
            .toLowerCase();

        const confirmEmail =
          emailData.confirmEmail
            .trim()
            .toLowerCase();

        if (
          !currentPassword ||
          !newEmail ||
          !confirmEmail
        ) {
          setEmailError(
            "Please fill all email-change fields."
          );

          setChangingEmail(false);
          return;
        }

        if (
          newEmail !==
          confirmEmail
        ) {
          setEmailError(
            "New email and confirm email do not match."
          );

          setChangingEmail(false);
          return;
        }

        if (
          !newEmail.includes("@")
        ) {
          setEmailError(
            "Please enter a valid email address."
          );

          setChangingEmail(false);
          return;
        }

        if (
          newEmail ===
          formData.email.toLowerCase()
        ) {
          setEmailError(
            "New email must be different from your current login email."
          );

          setChangingEmail(false);
          return;
        }

        const response =
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/auth/change-email`,
            {
              currentPassword,
              newEmail,
              confirmEmail,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setEmailMessage(
            "Login email changed successfully. Please login again with your new email."
          );

          setEmailData({
            currentPassword: "",
            newEmail: "",
            confirmEmail: "",
          });

          // The old JWT contains the old email.
          // Force fresh login with the new email.
          localStorage.removeItem(
            "doctorToken"
          );

          localStorage.removeItem(
            "doctor"
          );

          setTimeout(() => {
            window.location.href =
              "/doctor-login";
          }, 1800);
        }
      } catch (error) {
        console.error(
          "Change login email error:",
          error
        );

        if (
          error.response?.status === 401 &&
          error.response?.data?.message !==
            "Current password is incorrect."
        ) {
          logout();
          return;
        }

        setEmailError(
          error.response?.data?.message ||
            "Unable to change login email."
        );
      } finally {
        setChangingEmail(false);
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "doctorToken"
    );

    localStorage.removeItem(
      "doctor"
    );

    window.location.href =
      "/doctor-login";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />

          <p className="mt-4 text-slate-500">
            Loading profile...
          </p>

        </div>
      </div>
    );
  }

  const profileImageUrl =
    getProfileImageUrl();

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="flex w-full items-center justify-between px-5 py-4 md:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-xl font-bold text-white">
              +
            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-900">
                MediCare
              </h1>

              <p className="text-sm text-slate-500">
                Doctor Profile
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="w-full px-5 py-8 md:px-8">

        {/* TOP */}

        <div className="flex flex-col items-start justify-between gap-5 md:flex-row">

          <div>

            <p className="font-semibold text-sky-600">
              DOCTOR PROFILE
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900 md:text-5xl">
              Profile Settings
            </h1>

            <p className="mt-2 text-lg text-slate-500">
              Manage your professional and clinic information.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/dashboard")
            }
            className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

        </div>

        {/* =================================================
            DOCTOR CARD
        ================================================= */}

        <div className="mt-8 w-full rounded-3xl bg-slate-950 p-6 text-white md:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-4xl font-bold">

              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={
                    formData.name ||
                    "Doctor"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                formData.name
                  ?.charAt(0)
                  ?.toUpperCase() || (
                  <FaUserMd />
                )
              )}

            </div>

            <div>

              <h2 className="text-3xl font-bold">
                {formData.name ||
                  "Doctor Name"}
              </h2>

              <p className="mt-1 text-lg text-sky-300">
                {formData.specialization ||
                  "Specialization"}
              </p>

              <p className="mt-1 text-base text-slate-400">
                {formData.qualification ||
                  "Qualification"}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            PROFILE FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 w-full rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <h2 className="text-2xl font-bold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-base text-slate-500">
            Your professional information.
          </p>

          <div className="mt-7 grid gap-6 md:grid-cols-2">

            {/* LOGIN EMAIL */}

            <div>

              <ProfileField
                label="Login Email"
                icon={<FaEnvelope />}
                name="email"
                type="email"
                value={formData.email}
                onChange={() => {}}
                placeholder="doctor@example.com"
              />

              <p className="mt-2 text-xs text-slate-400">
                This email is used for doctor login.
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(
                      "change-login-email"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                }
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
              >

                <FaEdit />

                Change Login Email

              </button>

            </div>

            {/* PUBLIC EMAIL */}

            <ProfileField
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

            <ProfileField
              label="Doctor Name"
              icon={<FaUserMd />}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              required
            />

            <ProfileField
              label="Specialization"
              icon={<FaStethoscope />}
              name="specialization"
              value={
                formData.specialization
              }
              onChange={handleChange}
              placeholder="General Physician"
            />

            <ProfileField
              label="Qualification"
              icon={<FaGraduationCap />}
              name="qualification"
              value={
                formData.qualification
              }
              onChange={handleChange}
              placeholder="MBBS, MD"
            />

            <ProfileField
              label="Phone Number"
              icon={<FaPhone />}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <ProfileField
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

          <div className="my-10 border-t border-slate-100" />

          <h2 className="text-2xl font-bold text-slate-900">
            Profile Photo
          </h2>

          <p className="mt-1 text-base text-slate-500">
            Select a photo directly from your computer.
          </p>

          <div className="mt-6 flex w-full flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center">

            <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-5xl font-bold text-sky-600">

              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                formData.name
                  ?.charAt(0)
                  ?.toUpperCase() || (
                  <FaUserMd />
                )
              )}

            </div>

            <div>

              <label
                htmlFor="profileImage"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700"
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
                JPG, JPEG, PNG or WEBP
              </p>

              <p className="text-sm text-slate-400">
                Maximum 5 MB
              </p>

              {selectedImage && (
                <p className="mt-3 text-sm font-semibold text-green-600">
                  ✓ {selectedImage.name}
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              CLINIC
          ================================================= */}

          <div className="my-10 border-t border-slate-100" />

          <h2 className="text-2xl font-bold text-slate-900">
            Clinic Information
          </h2>

          <p className="mt-1 text-base text-slate-500">
            Information patients can use to visit your clinic.
          </p>

          <div className="mt-6">

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

          {/* BIO */}

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

          {/* MESSAGE */}

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

          {/* SAVE */}

          <div className="mt-8 flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-7 py-3.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >

              <FaSave />

              {saving
                ? "Saving..."
                : "Save Profile"}

            </button>

          </div>

        </form>

        {/* =================================================
            CHANGE LOGIN EMAIL
        ================================================= */}

        <section
          id="change-login-email"
          className="mt-6 w-full scroll-mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl text-sky-600">

              <FaEnvelope />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Change Login Email
              </h2>

              <p className="mt-1 text-slate-500">
                Change the email address you use to login to your doctor account.
              </p>

            </div>

          </div>

          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">

            <strong>Important:</strong>{" "}
            This changes your doctor login email.
            Your Public Email will not change.

          </div>

          <form
            onSubmit={
              handleChangeLoginEmail
            }
            className="mt-7 grid gap-5 md:grid-cols-2"
          >

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  emailData.currentPassword
                }
                onChange={
                  handleEmailChange
                }
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Login Email
              </label>

              <div className="relative">

                <input
                  type="email"
                  name="newEmail"
                  value={
                    emailData.newEmail
                  }
                  onChange={
                    handleEmailChange
                  }
                  placeholder="newemail@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  required
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Login Email
              </label>

              <div className="relative">

                <input
                  type="email"
                  name="confirmEmail"
                  value={
                    emailData.confirmEmail
                  }
                  onChange={
                    handleEmailChange
                  }
                  placeholder="Confirm new email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  required
                />

              </div>

            </div>

            {emailMessage && (
              <div className="md:col-span-2 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
                ✓ {emailMessage}
              </div>
            )}

            {emailError && (
              <div className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
                ⚠ {emailError}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">

              <button
                type="submit"
                disabled={
                  changingEmail
                }
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <FaEdit />

                {changingEmail
                  ? "Changing Email..."
                  : "Change Login Email"}

              </button>

            </div>

          </form>

        </section>

        {/* =================================================
            CHANGE PASSWORD
        ================================================= */}

        <section className="mt-6 w-full rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl text-sky-600">

              <FaKey />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Change Password
              </h2>

              <p className="mt-1 text-slate-500">
                Change the password used for doctor login.
              </p>

            </div>

          </div>

          <form
            onSubmit={
              handleChangePassword
            }
            className="mt-7 grid gap-5 md:grid-cols-3"
          >

            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={
                passwordData.currentPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={
                passwordData.newPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={
                passwordData.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            {passwordMessage && (
              <div className="md:col-span-3 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
                ✓ {passwordMessage}
              </div>
            )}

            {passwordError && (
              <div className="md:col-span-3 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
                ⚠ {passwordError}
              </div>
            )}

            <div className="md:col-span-3 flex justify-end">

              <button
                type="submit"
                disabled={
                  changingPassword
                }
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <FaKey />

                {changingPassword
                  ? "Changing Password..."
                  : "Change Password"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

// =====================================================
// PROFILE FIELD
// =====================================================

function ProfileField({
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
        readOnly={
          name === "email"
        }
        className={`w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${
          name === "email"
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : ""
        }`}
      />

    </div>
  );
}

// =====================================================
// PASSWORD FIELD
// =====================================================

function PasswordField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        required
      />

    </div>
  );
}

export default DoctorProfile;