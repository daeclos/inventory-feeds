"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DashboardLayout from "@/components/ui/DashboardLayout";
import UserTabs from "./components/UserTabs";
import UserModal from "./components/UserModal";
import { useUserStore } from "./store";
import { User } from "@/types/user";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

export default function UserAdminPage() {
  const users = useUserStore((s) => s.users);
  const addUser = useUserStore((s) => s.addUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const deleteUser = useUserStore((s) => s.deleteUser);
  const setUsers = useUserStore((s) => s.setUsers);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Export helpers
  const getTableData = () => users.map(u => ({
    Name: u.name,
    Email: u.email,
    Role: u.role,
    Status: u.active ? "Active" : "Inactive",
    Created: u.createdAt,
  }));

  const handleCopy = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join("\t");
    const rows = data.map((row) => Object.values(row).join("\t"));
    const text = [header, ...rows].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado al portapapeles!");
  };
  const handleCSV = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).map(v => `"${v}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExcel = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  // CRUD
  const handleAdd = (user: Omit<User, "id" | "createdAt">) => {
    addUser({ ...user, id: uuidv4(), createdAt: new Date().toLocaleString() });
    setModalOpen(false);
    toast.success("User added!");
  };
  const handleEdit = (user: Omit<User, "id" | "createdAt">) => {
    if (editUser) {
      updateUser(editUser.id, { ...user });
      setEditUser(null);
      setModalOpen(false);
      toast.success("User updated!");
    }
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      toast.success("User deleted!");
    }
  };

  // Determinar si hay algún usuario admin (puedes ajustar según tu lógica de autenticación real)
  const isAdminUser = users.some(u => u.role === "admin");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#404042] mb-1">User Admin</h1>
            <p className="text-gray-500 text-sm">Manage your users, roles and access.</p>
          </div>
          {/* Botones removidos del header principal */}
        </div>
        <UserTabs
          onEdit={u => { setEditUser(u); setModalOpen(true); }}
          onDelete={handleDelete}
          onAddUser={() => setModalOpen(true)}
        />
        <UserModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditUser(null); }}
          onSave={editUser ? handleEdit : handleAdd}
          initialData={editUser || undefined}
        />
      </div>
    </DashboardLayout>
  );
} 