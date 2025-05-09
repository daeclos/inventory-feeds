import { useState } from "react";
import MyProfile from "./MyProfile";
import UserTable from "./UserTable";
import { useUserStore } from "../store";
import { User } from "@/types/user";

interface UserTabsProps {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onAddUser: () => void;
}

export default function UserTabs({ onEdit, onDelete, onAddUser }: UserTabsProps) {
  const [tab, setTab] = useState<"profile" | "users">("profile");
  const users = useUserStore((s) => s.users);

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-colors ${tab === "profile" ? "bg-[#FAAE3A] text-[#404042] shadow" : "bg-gray-100 text-[#404042] hover:bg-[#FFF3D1]"}`}
          onClick={() => setTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-colors ${tab === "users" ? "bg-[#FAAE3A] text-[#404042] shadow" : "bg-gray-100 text-[#404042] hover:bg-[#FFF3D1]"}`}
          onClick={() => setTab("users")}
        >
          User Profiles
        </button>
      </div>
      {tab === "profile" && <MyProfile />}
      {tab === "users" && (
        <>
          <div className="flex justify-end mb-2">
            <button
              className="bg-[#404042] text-white font-semibold text-sm px-3 py-1 rounded hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
              onClick={onAddUser}
            >
              + Add User
            </button>
          </div>
          <UserTable users={users} onEdit={onEdit} onDelete={onDelete} />
        </>
      )}
    </div>
  );
} 