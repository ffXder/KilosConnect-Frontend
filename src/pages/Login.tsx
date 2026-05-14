import React, { useId, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import KilosGymImg from "../assets/images/image-5.png";
import KILOSWhiteLogo1 from "../assets/images/KILOS-white-logo-1.png";

const formFields = [
  { id: "username", label: "Username", type: "text", autoComplete: "username" },
  { id: "password", label: "Password", type: "password", autoComplete: "current-password" },
] as const;

export const LoginPage: React.FC = () => {
  const formId = useId();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formValues.username, formValues.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-x-hidden">
      
      {/* Left panel: Full width on mobile, 35% on desktop */}
      <section
        aria-labelledby={`${formId}-title`}
        className="w-full md:w-[40%] lg:w-[35%] min-h-screen flex flex-col items-center justify-center p-6 md:p-12 
                   bg-[linear-gradient(180deg,#072821_21%,#111B30_100%)]"
      >
        {/* Logo */}
        <img
          className="w-[180px] md:w-[238px] mb-8 object-contain"
          alt="KILOS"
          src={KILOSWhiteLogo1}
        />

        <h1 id={`${formId}-title`} className="font-poppins font-semibold text-[#fdffe0] text-3xl md:text-4xl mb-8">
          LOG IN
        </h1>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-[400px] mb-4 bg-red-500/20 border border-red-400 rounded-md p-3">
            <p className="font-poppins text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="w-full max-w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label htmlFor={`${formId}-${field.id}`} className="font-poppins text-[#fdffe0] text-lg md:text-xl">
                {field.label}
              </label>
              <div className="relative w-full">
                <input
                  id={`${formId}-${field.id}`}
                  name={field.id}
                  type={field.id === "password" && showPassword ? "text" : field.type}
                  value={formValues[field.id]}
                  onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full h-[45px] bg-white rounded-md px-4 text-black font-poppins focus:ring-2 focus:ring-[#ba6300] outline-none"
                />
                {field.id === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="text-center">
  
           <a href="/forgot-password"
            className="font-poppins text-[#fdffe0]/70 hover:text-[#fdffe0] text-sm underline transition-all"
            >
            Forgot Password?
          </a>
          <p className="font-poppins text-[#fdffe0]/50 text-xs mt-1">
            For admin accounts only
          </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-4 bg-[#ba6300] hover:bg-[#a35600] text-[#fdffe0] rounded-md font-poppins font-medium text-xl transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </section>

      {/* Right panel*/}
      <aside className="hidden md:block md:flex-1 h-screen">
        <img className="w-full h-full object-cover" alt="Gym interior" src={KilosGymImg} />
      </aside>
    </main>
  );
};