"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Upload, FileText } from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Papa from "papaparse";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useToast } from "../../../components/ui/use-toast";
import DashboardLayout from "@/components/ui/DashboardLayout";

const FIELD_TYPES = ["Make", "Model", "Trim"];

export default function ProductAliasPage() {
  const [rows, setRows] = useState<{ type: string; value: string; alias: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [editRows, setEditRows] = useState<{ type: string; value: string; alias: string }[]>([]);

  const addEditRow = (type: string) => {
    setEditRows([...editRows, { type, value: "", alias: "" }]);
  };

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedRows = (results.data as any[]).map(row => ({
            type: row.type,
            value: row.value,
            alias: row.alias
          })).filter(row => row.type && row.value);
          setRows(prev => [...prev, ...parsedRows]);
        }
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    setRows(prev => [...prev, ...editRows.filter(r => r.value)]);
    setEditRows([]);
    toast({ title: "Datos enviados", description: "Los datos fueron agregados a las tablas." });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 w-full">
      <h1 className="text-3xl font-bold text-[#404042] mb-6">Product Alias</h1>
      <div className="bg-white rounded-xl border border-[#FAAE3A]/30 p-6 mb-8 shadow flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        {/* Add New Elements */}
        <div className="flex-1">
          <span className="text-lg font-semibold text-[#404042] block mb-2">Add New Elements</span>
          <div className="flex gap-2">
            {FIELD_TYPES.map(type => (
              <Button key={type} variant="outline" onClick={() => addEditRow(type)}>{type}</Button>
            ))}
          </div>
        </div>
        {/* Divider */}
        <div className="hidden md:block w-px bg-[#FAAE3A]/30 mx-4 my-2" />
        {/* Bulk Upload */}
        <div className="flex-1">
          <span className="text-lg font-semibold text-[#404042] block mb-2">Bulk Upload</span>
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleUploadClick}>
                    <Upload size={18}/> Upload
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload Product alias CSV</TooltipContent>
              </Tooltip>
              <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open('/ProductAlias.csv', '_blank')}>
                    <FileText size={18}/> Template
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download CSV template</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
      {editRows.length > 0 && (
        <div className="bg-white rounded shadow border border-[#FAAE3A]/30 p-6 mb-8 animate-fade-in">
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-[#FFF3D1]">
                <th className="text-left px-4 py-2 text-[#404042]">Type</th>
                <th className="text-left px-4 py-2 text-[#404042]">Value</th>
                <th className="text-left px-4 py-2 text-[#404042]">Alias</th>
              </tr>
            </thead>
            <tbody>
              {editRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 font-semibold text-[#FAAE3A]">{row.type}</td>
                  <td className="px-4 py-2"><input className="border rounded px-2 py-1 w-full focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30" value={row.value} onChange={e => setEditRows(editRows.map((r, i) => i === idx ? { ...r, value: e.target.value } : r))} placeholder={`${row.type}`} /></td>
                  <td className="px-4 py-2"><input className="border rounded px-2 py-1 w-full focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30" value={row.alias} onChange={e => setEditRows(editRows.map((r, i) => i === idx ? { ...r, alias: e.target.value } : r))} placeholder={`${row.type} Alias`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center">
            <Button variant="default" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      )}
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
                    <Button size="icon" variant="ghost" onClick={() => setRows(rows => rows.filter((r, i) => !(r.type === row.type && i === idx)))}>
                      <Trash2 className="text-red-500" size={18}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Accordion type="multiple" className="mt-8">
        {FIELD_TYPES.map(type => (
          <AccordionItem key={type} value={type}>
            <AccordionTrigger className="bg-[#FFF3D1] px-4 py-2 font-bold text-[#404042]">{type}s</AccordionTrigger>
            <AccordionContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 text-[#404042]">Value</th>
                    <th className="text-left px-4 py-2 text-[#404042]">Alias</th>
                    <th className="text-center px-4 py-2 text-[#404042]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.filter(r => r.type === type).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{row.value}</td>
                      <td className="px-4 py-2">{row.alias}</td>
                      <td className="px-4 py-2 text-center">
                        <Button size="icon" variant="ghost" onClick={() => setRows(rows => rows.filter((r, i) => !(r.type === type && i === rows.findIndex(rr => rr === row))))}>
                          <Trash2 className="text-red-500" size={18}/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
} 