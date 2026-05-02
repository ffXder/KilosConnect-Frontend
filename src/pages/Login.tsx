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
    <main className="bg-white w-full min-w-[1920px] min-h-[1080px] flex">
      {/* Left panel */}
      <section
        aria-labelledby={`${formId}-title`}
        className="w-[705px] h-[1080px] relative bg-[linear-gradient(180deg,rgba(7,40,33,1)_21%,rgba(17,27,48,1)_100%)]"
      >
        <img
          className="absolute top-[142px] left-[234px] w-[238px] h-[134px] object-contain"
          alt="KILOS"
          src={KILOSWhiteLogo1}
        />

        <h1
          id={`${formId}-title`}
          className="absolute top-[calc(50%-264px)] left-[calc(50%-110px)] w-[219px] h-[110px] flex items-center justify-center font-poppins font-semibold text-[#fdffe0] text-4xl text-center"
        >
          LOG IN
        </h1>

        {/* Error message */}
        {error && (
          <div className="absolute top-[358px] left-[119px] w-[467px] bg-red-500/20 border border-red-400 rounded-md px-3 py-2">
            <p className="font-poppins text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="contents" onSubmit={handleSubmit} aria-label="Login form">
          {formFields.map((field, index) => {
            const labelTop = index === 0 ? "top-[398px]" : "top-[518px]";
            const inputTop = index === 0 ? "top-[438px]" : "top-[559px]";
            const labelWidth = index === 0 ? "w-32" : "w-[116px]";

            return (
              <div key={field.id}>
                <label
                  htmlFor={`${formId}-${field.id}`}
                  className={`absolute ${labelTop} left-[119px] ${labelWidth} h-7 flex items-center justify-center font-poppins text-[#fdffe0] text-2xl`}
                >
                  {field.label}
                </label>
                <div className={`absolute ${inputTop} left-[119px] w-[467px] h-[42px] flex rounded-md`}>
                  <input
                    id={`${formId}-${field.id}`}
                    name={field.id}
                    type={field.id === "password" && showPassword ? "text" : field.type}
                    autoComplete={field.autoComplete}
                    value={formValues[field.id]}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.value,
                      }))
                    }
                    aria-label={field.label}
                    className="w-full h-full bg-white rounded-[var(--sizes-global-radius)] px-[12px] 
                              text-black [font-family:'Poppins-Regular',Helvetica] font-normal text-base leading-[normal] 
                              placeholder:text-white/60 shadow-[0_0_0_1px_#00000014]"
                  />

                  {/* Eye Icon for Password field */}
                  {field.id === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
                </div>
              </div>
            );
          })}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="absolute top-[680px] left-[119px] w-[467px] h-[42px] flex items-center justify-center bg-[#ba6300] rounded-md cursor-pointer disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fdffe0]"
          >
            <span className="font-poppins font-medium text-[#fdffe0] text-xl">
              {loading ? "Logging in..." : "Log in"}
            </span>
          </button>
        </form>
      </section>

      {/* Right panel */}
      <aside className="w-[1285px] h-[1080px]">
        <img className="w-full h-full object-cover" alt="Gym interior" src={KilosGymImg} />
      </aside>
    </main>
  );
};