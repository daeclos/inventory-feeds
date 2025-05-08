import { useState } from "react";
import MyProfile from "./MyProfile";
import UserTable from "./UserTable";
import { useUserStore } from "../store";
import { User } from "@/types/user";

interface UserTabsProps {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserTabs({ onEdit, onDelete }: UserTabsProps) {
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
      {tab === "users" && <UserTable users={users} onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
} 