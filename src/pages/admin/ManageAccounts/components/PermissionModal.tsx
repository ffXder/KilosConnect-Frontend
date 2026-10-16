import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Loader2, Save, AlertCircle } from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";
import {
  PERMISSION_GROUPS,
  type PermissionGroup,
} from "../../../../constants/permission";

interface PermissionsModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onSubmit: (userId: string, permissions: string[]) => Promise<void>;
}

// view permission of a group
const getReadValue = (group: PermissionGroup) =>
  group.options.find((o) => o.value.endsWith(":read"))?.value;

// drops any permission whose group's view permission isn't granted.
const normalize = (perms: string[]) => {
  const set = new Set(perms);
  PERMISSION_GROUPS.forEach((g) => {
    const read = getReadValue(g);
    if (read && !set.has(read)) g.options.forEach((o) => set.delete(o.value));
  });
  return [...set];
};

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-[background-color,opacity] duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d86125]/50 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? "bg-[#d86125]" : "bg-gray-300 dark:bg-slate-600"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

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
    setSelected(normalize(user.permissions ?? []));
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

  const toggle = (value: string, group: PermissionGroup) => {
    setError(null);
    const read = getReadValue(group);
    const groupValues = group.options.map((o) => o.value);

    setSelected((prev) => {
      const isOn = prev.includes(value);

      // Turning view off clears every permission in that group
      if (value === read && isOn) {
        return prev.filter((p) => !groupValues.includes(p));
      }
      // Other permissions can't be turned on without view
      if (read && value !== read && !prev.includes(read)) {
        return prev;
      }
      return isOn ? prev.filter((p) => p !== value) : [...prev, value];
    });
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
              const readValue = getReadValue(group);
              const readOn = !readValue || selected.includes(readValue);

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

                  <div className="flex flex-col gap-1 p-2">
                    {group.options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      const dependsOnRead = !!readValue && opt.value !== readValue;
                      const disabled = loading || (dependsOnRead && !readOn);

                      return (
                        <label
                          key={opt.value}
                          title={
                            dependsOnRead && !readOn
                              ? "Enable view access first"
                              : undefined
                          }
                          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                            disabled ? "cursor-not-allowed" : "cursor-pointer"
                          } ${
                            checked
                              ? "bg-[#d86125]/5 dark:bg-[#d86125]/10"
                              : disabled
                              ? ""
                              : "hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              disabled && !loading
                                ? "text-gray-400 dark:text-slate-500"
                                : "text-gray-800 dark:text-slate-200"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <Toggle
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggle(opt.value, group)}
                          />
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