import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, "id" | "createdAt">) => void;
  initialData?: Partial<User>;
}

const roles: UserRole[] = ["admin", "user"];

export default function UserModal({ isOpen, onClose, onSave, initialData }: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [active, setActive] = useState(true);

  useEffect(() => {
    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setRole(initialData?.role || "user");
    setActive(initialData?.active ?? true);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, role, active });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-[#404042]">{initialData ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#404042] mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#404042] mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#404042] mb-1">Role</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
            >
              {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              className="w-5 h-5 accent-[#FAAE3A]"
              id="active"
            />
            <label htmlFor="active" className="text-sm font-medium text-[#404042]">Active</label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-[#404042] font-semibold hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#404042] text-white font-semibold hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 