"use client";
import DashboardLayout from "@/components/ui/DashboardLayout";

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="text-[#404042]">
        <h1 className="text-2xl font-bold mb-4">Alerts Report</h1>
        <p className="text-sm">Mostrando 1 a 25 de <span className="text-red-500">xx</span> entradas (filtradas)</p>

        <div className="mt-6">
          <button className="bg-[#404042] text-white px-4 py-2 rounded mr-2">+ Add Alert</button>
          <button className="bg-[#404042] text-white px-4 py-2 rounded">Export to CSV</button>
        </div>

        <div className="mt-12 text-4xl font-bold text-red-500 rotate-[-10deg]">
          Aquí irá la tabla de alerts
        </div>
      </div>
    </DashboardLayout>
  );
}
