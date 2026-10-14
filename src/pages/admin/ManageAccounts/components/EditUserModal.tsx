import React, { useState, useEffect, useRef } from "react";
import {
  X,
  UserCog,
  Loader2,
  Save,
  AlertCircle,
  ChevronDown,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import type { UserAccount, NewUserForm } from "../../../../types/manageAccount";

interface EditUserModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onSubmit: (userId: string, data: Partial<NewUserForm>) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
}

const formatPHPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const cleanNumbers = digits.startsWith("63") ? digits.slice(2) : digits;

  let formatted = "+63";
  if (cleanNumbers.length > 0) formatted += " " + cleanNumbers.substring(0, 3);
  if (cleanNumbers.length > 3) formatted += " " + cleanNumbers.substring(3, 6);
  if (cleanNumbers.length > 6) formatted += " " + cleanNumbers.substring(6, 10);

  return formatted.trim();
};

/* Shared field styles (light + dark) */
const inputClass =
  "w-full px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl transition-colors " +
  "focus:outline-none focus:border-[#d86125] focus:ring-2 focus:ring-[#d86125]/20 " +
  "dark:text-slate-50 dark:placeholder:text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:focus:border-[#d86125]";

/** Horizontal row: label on the left, control on the right (stacks on mobile). */
const FormRow: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, required, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] sm:items-start gap-x-4 gap-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-slate-200 sm:pt-2.5"
    >
      {label}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
    <div className="min-w-0">{children}</div>
  </div>
);

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmit,
  onResetPassword,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "custodian" as "admin" | "custodian",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password reset: idle -> confirming -> sending -> done / error
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.toLowerCase() as "admin" | "custodian",
        phoneNumber: user.phoneNumber,
      });
      setError(null);
      setConfirmingReset(false);
      setResetDone(false);
      setResetError(null);
    }
  }, [user]);

  // Escape to close (not mid-request), lock background scroll, focus first field
  const busy = loading || resettingPassword;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, busy, onClose]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    if (name === "phoneNumber") {
      setFormData((prev) => ({ ...prev, [name]: formatPHPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(user.userId, formData);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    try {
      setResettingPassword(true);
      setResetError(null);
      await onResetPassword(user.userId);
      setConfirmingReset(false);
      setResetDone(true);
    } catch (err: any) {
      setResetError(err?.message ?? "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const emailInvalid = !!formData.email && !formData.email.includes("@");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        className="w-full max-w-lg flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#0b3026] px-6 py-5 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[#FDFFE0]">
              <UserCog size={20} />
            </div>
            <div className="min-w-0">
              <h3 id="edit-user-title" className="text-[#FDFFE0] text-lg font-bold leading-tight">
                Edit user
              </h3>
              <p className="text-[#FDFFE0]/60 text-sm mt-0.5 truncate font-mono">
                {user.userId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="shrink-0 -mr-2 p-2 rounded-lg text-[#FDFFE0]/70 hover:text-[#FDFFE0] hover:bg-white/10 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFFE0]/60"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-5">
            <FormRow id="edit-first-name" label="First name" required>
              <input
                ref={firstRef}
                id="edit-first-name"
                required
                name="firstName"
                autoComplete="off"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
              />
            </FormRow>

            <FormRow id="edit-last-name" label="Last name" required>
              <input
                id="edit-last-name"
                required
                name="lastName"
                autoComplete="off"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
              />
            </FormRow>

            <FormRow id="edit-email" label="Email">
              <input
                id="edit-email"
                name="email"
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={emailInvalid}
                aria-describedby={emailInvalid ? "edit-email-error" : undefined}
                placeholder="name@example.com"
                className={`${inputClass} ${
                  emailInvalid
                    ? "!border-red-400 focus:!ring-red-400/20 dark:!border-red-400"
                    : ""
                }`}
              />
              {emailInvalid && (
                <p id="edit-email-error" className="text-xs text-red-500 dark:text-red-400 mt-2">
                  Email must contain an "@" symbol
                </p>
              )}
            </FormRow>

            <FormRow id="edit-phone" label="Phone number" required>
              <input
                id="edit-phone"
                required
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="+63 XXX XXX XXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </FormRow>

            <FormRow id="edit-role" label="Role" required>
              <div className="relative">
                <select
                  id="edit-role"
                  required
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="custodian">Custodian</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 pointer-events-none"
                />
              </div>
            </FormRow>

            {/* Password reset: inline confirm instead of browser confirm()/alert() */}
            <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] sm:items-start gap-x-4 gap-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200 sm:pt-2.5">
                  Password
                </span>

                <div className="min-w-0">
                  {!confirmingReset ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmingReset(true);
                          setResetDone(false);
                          setResetError(null);
                        }}
                        disabled={busy}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-50 dark:text-amber-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                      >
                        <KeyRound size={16} />
                        Reset password
                      </button>
                      {resetDone && (
                        <p className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={16} className="shrink-0" />
                          Password reset requested.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        Reset the password for{" "}
                        <span className="font-semibold">
                          {user.firstName} {user.lastName}
                        </span>
                        ?
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={handleConfirmReset}
                          disabled={resettingPassword}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        >
                          {resettingPassword && <Loader2 size={14} className="animate-spin" />}
                          {resettingPassword ? "Sending..." : "Yes, reset"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingReset(false)}
                          disabled={resettingPassword}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors disabled:opacity-50 dark:text-amber-200 dark:hover:bg-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {resetError && (
                    <p
                      role="alert"
                      className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400 mt-2"
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      {resetError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d86125]/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#FDFFE0] bg-[#d86125] shadow-sm hover:bg-[#c2551e] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d86125]/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
