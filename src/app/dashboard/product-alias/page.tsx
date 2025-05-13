"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Upload, FileText } from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

const FIELD_TYPES = ["Make", "Model", "Trim"];

export default function ProductAliasPage() {
  const [rows, setRows] = useState<{ type: string; value: string; alias: string }[]>([]);

  const addRow = (type: string) => {
    setRows([...rows, { type, value: "", alias: "" }]);
  };

  const updateRow = (idx: number, key: "value" | "alias", val: string) => {
    setRows(rows.map((row, i) => i === idx ? { ...row, [key]: val } : row));
  };

  const copyRow = (idx: number) => {
    setRows([...rows, { ...rows[idx] }]);
  };

  const deleteRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="max-w-6xl mx-auto px-4 py-8 w-full">
          <h1 className="text-3xl font-bold text-[#404042] mb-6">Product Alias</h1>
          <div className="bg-white rounded-xl border border-[#FAAE3A]/30 p-6 mb-8 shadow">
            <div className="mb-4">
              <span className="text-lg font-semibold text-[#404042]">Add New Elements</span>
              <div className="flex gap-2 mt-2">
                {FIELD_TYPES.map(type => (
                  <Button key={type} variant="outline" onClick={() => addRow(type)}>{type}</Button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-lg font-semibold text-[#404042]">Bulk Upload</span>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex items-center gap-2"><Upload size={18}/> Upload</Button>
                <Button variant="outline" className="flex items-center gap-2"><FileText size={18}/> Template</Button>
              </div>
            </div>
          </div>
          {rows.length > 0 && (
            <div className="bg-white rounded shadow border border-[#FAAE3A]/30 p-6 mb-8">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-[#FFF3D1]">
                    <th className="text-left px-4 py-2 text-[#404042]">Type</th>
                    <th className="text-left px-4 py-2 text-[#404042]">Value</th>
                    <th className="text-left px-4 py-2 text-[#404042]">Alias</th>
                    <th className="text-center px-4 py-2 text-[#404042]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="px-4 py-2 font-semibold text-[#FAAE3A]">{row.type}</td>
                      <td className="px-4 py-2"><input className="border rounded px-2 py-1 w-full focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30" value={row.value} onChange={e => updateRow(idx, "value", e.target.value)} placeholder={`${row.type}`} /></td>
                      <td className="px-4 py-2"><input className="border rounded px-2 py-1 w-full focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30" value={row.alias} onChange={e => updateRow(idx, "alias", e.target.value)} placeholder={`${row.type} Alias`} /></td>
                      <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <Button size="icon" variant="ghost" onClick={() => copyRow(idx)}><Copy className="text-[#404042]" size={18}/></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteRow(idx)}><Trash2 className="text-red-500" size={18}/></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center">
                <Button variant="default">Submit</Button>
              </div>
            </div>
          )}
          {/* Sección de tablas agrupadas por tipo */}
          <div className="mt-8">
            {FIELD_TYPES.map(type => (
              <div key={type} className="mb-6">
                <div className="bg-[#FFF3D1] px-4 py-2 font-bold text-[#404042]">{type}s <span className="text-xs">▼</span></div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-2 text-[#404042]">Value</th>
                      <th className="text-left px-4 py-2 text-[#404042]">Alias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.filter(r => r.type === type).map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{row.value}</td>
                        <td className="px-4 py-2">{row.alias}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 