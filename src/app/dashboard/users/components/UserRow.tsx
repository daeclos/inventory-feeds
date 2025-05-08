import { User } from "@/types/user";
import { Edit2, Trash2 } from "lucide-react";

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  return (
    <tr className="border-b text-sm text-[#404042] hover:bg-gray-50">
      <td className="px-4 py-2 font-medium whitespace-nowrap">{user.name}</td>
      <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
      <td className="px-4 py-2 text-center capitalize">{user.role}</td>
      <td className="px-4 py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${user.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{user.active ? 'Active' : 'Inactive'}</span>
      </td>
      <td className="px-4 py-2 text-center whitespace-nowrap">{user.createdAt}</td>
      <td className="px-4 py-2 text-center">
        <div className="flex gap-2 justify-center">
          <Edit2 className="w-5 h-5 cursor-pointer text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625]" onClick={() => onEdit(user)} />
          <Trash2 className="w-5 h-5 cursor-pointer text-[#F17625] hover:text-[#FAAE3A] active:text-[#404042]" onClick={() => onDelete(user.id)} />
        </div>
      </td>
    </tr>
  );
} 