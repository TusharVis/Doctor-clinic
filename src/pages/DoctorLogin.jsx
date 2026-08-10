import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaSignInAlt,
} from "react-icons/fa";

function DoctorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      if (response.data.success) {
        localStorage.setItem(
          "doctorToken",
          response.data.token
        );

        localStorage.setItem(
          "doctor",
          JSON.stringify(response.data.doctor)
        );

        navigate("/dashboard");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-100 px-6 py-16">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-10"
      >

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-3xl text-sky-600">
          <FaUserMd />
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to manage your appointments.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="relative">
             

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@example.com"
                required
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-4 font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSignInAlt />

            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </motion.div>
    </section>
  );
}

export default DoctorLogin;