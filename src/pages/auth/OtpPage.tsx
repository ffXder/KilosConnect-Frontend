import React, { useId, useState, useRef, useEffect } from "react";
import type { FormEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp, getRole } from "../../services/authService";
import KilosGymImg from "../../assets/images/image-5.png";
import KILOSWhiteLogo1 from "../../assets/images/KILOS-white-logo-1.png";
import { ArrowLeft } from "lucide-react";

export const OtpPage: React.FC = () => {
  const formId = useId();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first digit input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend option
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    // Only allow single numeric digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input field
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // focus field after last pasted digit
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setError("");
      setCanResend(false);
      setResendTimer(60);
      await resendOtp();
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter the complete 6-digit authentication code.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const data = await verifyOtp(code);
      const role = data?.user?.role() || getRole();

      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (role === "custodian") {
        navigate("/custodian/dashboard", { replace: true });
      } else {
        navigate("/unauthorized");
      }
    } catch (err: any) {
      setError(err.message || "Invalid authentication code. Please try again.");
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

        <h1 id={`${formId}-title`} className="font-poppins font-semibold text-[#fdffe0] text-3xl md:text-4xl mb-3 text-center">
          VERIFICATION
        </h1>

        <p className="font-poppins text-[#fdffe0]/70 text-sm md:text-base mb-8 text-center max-w-[320px]">
          Enter the 6-digit security code sent to your registered email.
        </p>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-[400px] mb-4 bg-red-500/20 border border-red-400 rounded-md p-3">
            <p className="font-poppins text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="w-full max-w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
          
          {/* 6-Digit Code Inputs */}
          <div className="flex flex-col gap-2">
            <label className="font-poppins text-[#fdffe0] text-lg md:text-xl text-center">
              Security Code
            </label>
            <div className="flex justify-between gap-2 my-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                    }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 md:w-13 md:h-16 text-center text-2xl font-bold font-poppins bg-white text-black rounded-md outline-none focus:ring-2 focus:ring-[#ba6300] transition-all"
                />
              ))}
            </div>
          </div>

          {/* Resend OTP Link */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-poppins text-[#fdffe0] hover:text-white text-sm underline transition-all bg-transparent border-none cursor-pointer"
              >
                Resend authentication code
              </button>
            ) : (
              <p className="font-poppins text-[#fdffe0]/50 text-xs">
                Resend code in <span className="font-semibold text-[#fdffe0]">{resendTimer}s</span>
              </p>
            )}
            <p className="font-poppins text-[#fdffe0]/50 text-xs mt-1">
              For security compliance & verification
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-2 bg-[#ba6300] hover:bg-[#a35600] text-[#fdffe0] rounded-md font-poppins font-medium text-xl transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center mt-2">
            <button
                type="button"
                onClick={() => navigate("/login")}
                className="group inline-flex items-center justify-center gap-2 font-poppins text-[#fdffe0]/70 hover:text-[#fdffe0] text-sm underline bg-transparent border-none cursor-pointer transition-colors duration-200 ease-in-out"
            >
                <ArrowLeft 
                size={16} 
                className="transition-transform duration-200 ease-in-out group-hover:-translate-x-1" 
                />
                <span>Back to Login</span>
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