import React, { useState } from "react";
import type { NewUserForm } from "../../../../types/manageAccount";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<NewUserForm, "password">) => Promise<void>;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "custodian" as "admin" | "custodian",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatPHPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    const cleanNumbers = digits.startsWith("63") ? digits.slice(2) : digits;

    let formatted = "+63";
    if (cleanNumbers.length > 0) formatted += " " + cleanNumbers.substring(0, 3);
    if (cleanNumbers.length > 3) formatted += " " + cleanNumbers.substring(3, 6);
    if (cleanNumbers.length > 6) formatted += " " + cleanNumbers.substring(6, 10);

    return formatted.trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert("Error adding user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] w-full max-w-[420px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-[#072821] px-7 py-5">
          <h3 className="text-[#FDFFE0] text-xl font-bold">Add User</h3>
        </div>
        <form className="p-7 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-gray-700 dark:text-slate-200">First Name: <span className="text-red-500">*</span></label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-gray-700 dark:text-slate-200">Last Name: <span className="text-red-500">*</span></label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-gray-700 dark:text-slate-200">Email:</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full border rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${formData.email && !formData.email.includes("@") ? "border-red-400" : "border-gray-300 dark:border-slate-600"}`} 
            />
            {formData.email && !formData.email.includes("@") && (
              <p className="text-[10px] text-red-500 mt-1 animate-pulse">Email must contain an "@" symbol</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-gray-700 dark:text-slate-200">Phone Number: <span className="text-red-500">*</span></label>
            <input 
              required 
              name="phoneNumber" 
              placeholder="+63 XXX XXX XXXX"
              value={formData.phoneNumber} 
              onChange={handleChange} 
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-gray-700 dark:text-slate-200">Role: <span className="text-red-500">*</span></label>
            <select required name="role" value={formData.role} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              <option value="custodian">Custodian</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="w-full py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 dark:bg-slate-800">Cancel</button>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#d86125] text-[#FDFFE0] rounded-lg text-sm font-bold disabled:opacity-50">
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};