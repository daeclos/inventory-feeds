// app/dashboard/campaigns/page.tsx
"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Edit, AlertTriangle, Copy, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Ejemplo de datos dinámicos
const templates = [
  {
    advertiser: "Alliance Auto Group LTD",
    templateName: "VDP All Used",
    account: "550-054-4980",
    library: "AUTO",
    campaignName: "FFG VDP Search - Used",
    maxCPC: "$2.00",
    filter: "",
    hasAlert: false,
  },
  {
    advertiser: "Am Ford",
    templateName: "VDP All New",
    account: "170-908-1293",
    library: "AUTO",
    campaignName: "FFG Dynamic VDP - All Other New (Ford)",
    maxCPC: "$1.80",
    filter: "",
    hasAlert: true,
  },
  // ... más datos
];

export default function CampaignsPage() {
  const [activeOnly, setActiveOnly] = useState(true);

  // Handlers para menús
  const handleAutoTemplates = (action: string) => {
    if (action === 'New Template') {
      window.location.href = '/dashboard/campaigns/new-auto-template';
    } else if (action === 'Product Alias') {
      window.location.href = '/dashboard/product-alias';
    } else if (action === 'Negative Keywords') {
      window.location.href = '/dashboard/negative-keywords';
    } else {
      alert(`Auto-Templates: ${action}`);
    }
  };
  const handlePrebuildTemplates = (action: string) => {
    if (action === 'New Template') {
      window.location.href = '/dashboard/campaigns/new-prebuild-template';
    } else if (action === 'Edit Libraries') {
      window.location.href = '/dashboard/campaigns/edit-libraries';
    } else if (action === 'Negative Keywords') {
      window.location.href = '/dashboard/negative-keywords';
    } else {
      alert(`Prebuild-Templates: ${action}`);
    }
  };
  const handleExport = (type: string) => {
    alert(`Exportar a ${type}`);
  };
  const handleEdit = (row: any) => {
    alert(`Editar: ${row.templateName}`);
  };
  const handleAlert = (row: any) => {
    alert(`Ver alertas de: ${row.templateName}`);
  };
  const handleCopy = (row: any) => {
    alert(`Clonar: ${row.templateName}`);
  };
  const handleDelete = (row: any) => {
    alert(`Eliminar: ${row.templateName}`);
  };

  // Filtrado por activo (simulado)
  const filteredTemplates = activeOnly ? templates.filter(() => true) : templates;

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-7xl px-4 sm:px-8 pt-8">
          {/* Botones superiores */}
          <div className="flex gap-4 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground font-medium flex items-center gap-2 px-4 py-2 shadow-sm">
                  Auto-Templates <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAutoTemplates('New Template')}>New Template</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAutoTemplates('Product Alias')}>Product Alias</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAutoTemplates('Negative Keywords')}>Negative Keywords</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground font-medium flex items-center gap-2 px-4 py-2 shadow-sm">
                  Prebuild-Templates <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handlePrebuildTemplates('New Template')}>New Template</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/campaigns/edit-libraries">Edit Libraries</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrebuildTemplates('Negative Keywords')}>Negative Keywords</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filtros y exportación */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
              <span className="font-medium text-primary">Active Only</span>
            </div>
            <Button onClick={() => handleExport('Excel')} className="bg-secondary text-secondary-foreground px-4 py-2 border border-border">Excel</Button>
            <Button onClick={() => handleExport('CSV')} className="bg-secondary text-secondary-foreground px-4 py-2 border border-border">CSV</Button>
            <div className="flex items-center gap-2 ml-auto">
              <span>Show</span>
              <Input type="number" min={1} max={100} defaultValue={25} className="w-16 h-8 bg-background border border-border" />
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Search:</span>
              <Input className="h-8 bg-background border border-border" placeholder="" />
            </div>
          </div>

          {/* Tabla principal */}
          <div className="overflow-x-auto bg-card rounded-xl shadow border border-border">
            <table className="min-w-full table-auto text-sm rounded-xl overflow-hidden">
              <thead className="bg-muted text-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Advertiser Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Template Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Associated Account</th>
                  <th className="px-4 py-2 text-left font-semibold">Library</th>
                  <th className="px-4 py-2 text-left font-semibold">Campaign Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Max. CPC</th>
                  <th className="px-4 py-2 text-left font-semibold">Template Filter</th>
                  <th className="px-4 py-2 text-left font-semibold">Functions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/60">
                    <td className="px-4 py-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                      {row.advertiser}
                    </td>
                    <td className="px-4 py-2">{row.templateName}</td>
                    <td className="px-4 py-2">{row.account}</td>
                    <td className="px-4 py-2">{row.library}</td>
                    <td className="px-4 py-2">{row.campaignName}</td>
                    <td className="px-4 py-2">{row.maxCPC}</td>
                    <td className="px-4 py-2">{row.filter || <span className="text-muted-foreground">&darr;</span>}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button title="Edit" onClick={() => handleEdit(row)} className="text-primary hover:text-primary-foreground"><Edit size={18} /></button>
                      <button title="Alert" onClick={() => handleAlert(row)} className={row.hasAlert ? "text-destructive" : "text-muted-foreground"}><AlertTriangle size={18} /></button>
                      <button title="Copy" onClick={() => handleCopy(row)} className="text-primary hover:text-primary-foreground"><Copy size={18} /></button>
                      <button title="Delete" onClick={() => handleDelete(row)} className="text-primary hover:text-destructive"><Trash size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
