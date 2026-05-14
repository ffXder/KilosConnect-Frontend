import React, { useId, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import KilosGymImg from "../assets/images/image-5.png";
import KILOSWhiteLogo1 from "../assets/images/KILOS-white-logo-1.png";

export const ForgotPasswordPage: React.FC = () => {
  const formId = useId();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setSuccess(data.message);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-x-hidden">
      
      {/* Left panel */}
      <section
        aria-labelledby={`${formId}-title`}
        className="w-full md:w-[40%] lg:w-[35%] min-h-screen flex flex-col items-center justify-center p-6 md:p-12
                   bg-[linear-gradient(180deg,#072821_21%,#111B30_100%)]"
      >
        <img
          className="w-[180px] md:w-[238px] mb-8 object-contain"
          alt="KILOS"
          src={KILOSWhiteLogo1}
        />

        <h1 id={`${formId}-title`} className="font-poppins font-semibold text-[#fdffe0] text-3xl md:text-4xl mb-4">
          FORGOT PASSWORD
        </h1>

        <p className="font-poppins text-[#fdffe0]/70 text-sm text-center mb-8 max-w-[400px]">
          This page is for admin accounts only. Enter your admin email and we'll send you a reset link.
        </p>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-[400px] mb-4 bg-red-500/20 border border-red-400 rounded-md p-3">
            <p className="font-poppins text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="w-full max-w-[400px] mb-4 bg-green-500/20 border border-green-400 rounded-md p-3">
            <p className="font-poppins text-green-300 text-sm text-center">{success}</p>
          </div>
        )}

        <form className="w-full max-w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-email`} className="font-poppins text-[#fdffe0] text-lg md:text-xl">
              Email
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[45px] bg-white rounded-md px-4 text-black font-poppins focus:ring-2 focus:ring-[#ba6300] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-4 bg-[#ba6300] hover:bg-[#a35600] text-[#fdffe0] rounded-md font-poppins font-medium text-xl transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-poppins text-[#fdffe0]/70 hover:text-[#fdffe0] text-sm underline transition-all"
            >
              Back to Login
            </button>
          </div>
        </form>
      </section>

      {/* Right panel */}
      <aside className="hidden md:block md:flex-1 h-screen">
        <img className="w-full h-full object-cover" alt="Gym interior" src={KilosGymImg} />
      </aside>
    </main>
  );
};