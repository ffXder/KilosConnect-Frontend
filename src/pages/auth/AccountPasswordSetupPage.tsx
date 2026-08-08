import React, { useId, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { completeAccountSetup } from "../../services/authService"; // Import your helper
import KilosGymImg from "../../assets/images/image-5.png";
import KILOSWhiteLogo1 from "../../assets/images/KILOS-white-logo-1.png";

export const NewAccountPasswordSetupPage: React.FC = () => {
  const formId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const accountId = searchParams.get("accountId") || location.state?.accountId;

  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!accountId) {
      return setError("Missing account reference. Please return to login.");
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (formValues.newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setLoading(true);

    try {
      // Calls your central service helper
      await completeAccountSetup(accountId, formValues.newPassword);

      setSuccess("Account set up successfully! Redirecting to login...");
      
      // Send user back to log in with their permanent password
      setSuccess("Account set up successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    {
      id: "newPassword",
      label: "New Password",
      show: showPassword,
      toggle: () => setShowPassword(!showPassword),
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      show: showConfirm,
      toggle: () => setShowConfirm(!showConfirm),
    },
  ] as const;

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

        <h1
          id={`${formId}-title`}
          className="font-poppins font-semibold text-[#fdffe0] text-2xl md:text-3xl mb-2 text-center"
        >
          WELCOME TO KILOS
        </h1>

        <p className="font-poppins text-[#fdffe0]/70 text-sm text-center mb-8 max-w-[400px]">
          Your account requires a password update. Please choose a new permanent password to complete setup.
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
          {passwordFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label htmlFor={`${formId}-${field.id}`} className="font-poppins text-[#fdffe0] text-lg md:text-xl">
                {field.label}
              </label>
              <div className="relative w-full">
                <input
                  id={`${formId}-${field.id}`}
                  name={field.id}
                  type={field.show ? "text" : "password"}
                  value={formValues[field.id]}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                  }
                  className="w-full h-[45px] bg-white rounded-md px-4 text-black font-poppins focus:ring-2 focus:ring-[#ba6300] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {field.show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-4 bg-[#ba6300] hover:bg-[#a35600] text-[#fdffe0] rounded-md font-poppins font-medium text-xl transition-all disabled:opacity-50"
          >
            {loading ? "Setting Password..." : "Set Password & Continue"}
          </button>

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