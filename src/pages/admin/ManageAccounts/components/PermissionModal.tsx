import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Loader2, Save, AlertCircle } from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";
import { PERMISSION_GROUPS } from "../../../../constants/permission";

interface PermissionsModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onSubmit: (userId: string, permissions: string[]) => Promise<void>;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmit,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setSelected(user.permissions ?? []);
    setError(null);
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !user) return null;

  const original = user.permissions ?? [];
  const changed =
    selected.length !== original.length || selected.some((p) => !original.includes(p));

  const toggle = (value: string) => {
    setError(null);
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const toggleGroup = (values: string[]) => {
    setError(null);
    setSelected((prev) => {
      const allOn = values.every((v) => prev.includes(v));
      return allOn
        ? prev.filter((p) => !values.includes(p))
        : [...new Set([...prev, ...values])];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(user._id, selected);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="permissions-title"
        className="w-full max-w-lg flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#0b3026] px-6 py-5 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[#FDFFE0]">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0">
              <h3 id="permissions-title" className="text-[#FDFFE0] text-lg font-bold leading-tight">
                Permissions
              </h3>
              <p className="text-[#FDFFE0]/60 text-sm mt-0.5 truncate">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="shrink-0 -mr-2 p-2 rounded-lg text-[#FDFFE0]/70 hover:text-[#FDFFE0] hover:bg-white/10 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFFE0]/60"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-4">
            {PERMISSION_GROUPS.map((group) => {
              const values = group.options.map((o) => o.value);
              const allOn = values.every((v) => selected.includes(v));

              return (
                <fieldset
                  key={group.key}
                  className="rounded-xl border border-gray-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <legend className="text-sm font-semibold text-gray-900 dark:text-slate-100 float-left">
                      {group.label}
                    </legend>
                    {group.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleGroup(values)}
                        disabled={loading}
                        className="text-xs font-semibold text-[#d86125] hover:underline disabled:opacity-50"
                      >
                        {allOn ? "Clear all" : "Select all"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                    {group.options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                            checked
                              ? "bg-[#d86125]/5 dark:bg-[#d86125]/10"
                              : "hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(opt.value)}
                            disabled={loading}
                            className="h-4 w-4 shrink-0 accent-[#d86125] cursor-pointer"
                          />
                          <span className="text-sm text-gray-800 dark:text-slate-200">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

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
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d86125]/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !changed}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#FDFFE0] bg-[#d86125] shadow-sm hover:bg-[#c2551e] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d86125]/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Saving..." : "Save permissions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};