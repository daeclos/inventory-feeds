"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Plus, Minus, Copy, Trash2, HelpCircle } from "lucide-react";
import { useAdvertiserStore } from "@/store/advertiserStore";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { FilterBuilder, filterAttributes } from "@/components/ui/FilterBuilder";
import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function EditFeedPage() {
  const router = useRouter();
  const params = useParams();
  const feedId = params.feedId;
  const [feed, setFeed] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estado para los grupos de filtros
  const [filterGroups, setFilterGroups] = useState([
    { id: 1, filters: [] as { id: number; field: string; operator: string; value: string }[] }
  ]);
  const [nextGroupId, setNextGroupId] = useState(2);

  // Estado para los valores seleccionados en el filtro demo
  const [filterValues, setFilterValues] = React.useState<string[]>(["Placeholder"]);
  const valueOptions = ["Placeholder", "Stock", "Value 2"];

  // Estado para el operador seleccionado en el filtro demo
  const [filterOperator, setFilterOperator] = React.useState<string>("Is not");

  // Obtener advertiser y direcciones usando useMemo
  const advertiser = useMemo(() => 
    advertisers.find((a: any) => a.id === (form?.advertisers?.[0] || form?.advertisers)),
    [advertisers, form?.advertisers]
  );
  
  const advertiserName = useMemo(() => 
    advertiser?.name || "-",
    [advertiser?.name]
  );
  
  const addresses = useMemo(() => 
    advertiser?.addresses || [],
    [advertiser?.addresses]
  );
  
  const [selectedAddress, setSelectedAddress] = useState(form?.address || addresses[0]?.address || "");

  // Estado para mostrar el popover de placeholders
  const [showPlaceholders, setShowPlaceholders] = React.useState(false);
  const placeholders = [
    "longitude", "url", "mileage.unit", "drivetrain", "image[0].url", "vin", "model", "exterior_color", "address", "latitude", "state_of_vehicle", "make", "body_style", "mileage.value", "title", "price", "vehicle_id", "transmission"
  ];
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const helpBtnRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!showPlaceholders) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        helpBtnRef.current &&
        !helpBtnRef.current.contains(e.target as Node)
      ) {
        setShowPlaceholders(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPlaceholders]);

  // Estado para agregar y seleccionar URL Appends
  const [urlAppendInput, setUrlAppendInput] = React.useState({ name: "", value: "" });
  const [selectedAppends, setSelectedAppends] = React.useState<number[]>([]);
  const allSelected = form?.urlAppends && form.urlAppends.length > 0 && selectedAppends.length === form.urlAppends.length;

  useEffect(() => {
    // Eliminar lógica de localStorage:
    // const all = JSON.parse(localStorage.getItem("customFeeds") || "{}");
    // let found = null;
    // Object.values(all).forEach((arr: any) => {
    //   const f = (arr as any[]).find(x => x.id === feedId);
    //   if (f) found = f;
    // });
    setFeed(null);
    setForm(null);
  }, [feedId]);

  useEffect(() => {
    if (addresses.length > 0) setSelectedAddress(addresses[0].address);
  }, [advertiser, addresses]);

  if (!form) return <div className="p-8">Loading...</div>;

  // Handlers para los campos
  const handleChange = (key: string, value: any) => setForm({ ...form, [key]: value });
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
    setForm({ ...form, address: e.target.value });
  };

  // Guardar cambios
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Eliminar lógica de localStorage:
    // const all = JSON.parse(localStorage.getItem("customFeeds") || "" );
    // form.advertisers.forEach((advId: string) => { ... });
    // localStorage.setItem("customFeeds", JSON.stringify(all));
    router.push("/dashboard/feeds");
  };

  // MultiSelect para el campo 'Values'
  function MultiSelect({ options, value, onChange, placeholder = "Select option" }: { options: string[], value: string[], onChange: (v: string[]) => void, placeholder?: string }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    // Cerrar el menú si se hace clic fuera
    React.useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    // Navegación con teclado
    const [highlighted, setHighlighted] = React.useState<number>(-1);
    React.useEffect(() => { if (!open) setHighlighted(-1); }, [open]);
    return (
      <div className="relative" ref={ref}>
        <div
          className="border rounded w-full min-h-[40px] bg-white flex items-center flex-wrap gap-1 px-2 py-1 cursor-pointer"
          onClick={() => setOpen(v => !v)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "ArrowDown") { setOpen(true); setHighlighted(h => Math.min(h+1, options.length-1)); }
            if (e.key === "ArrowUp") { setOpen(true); setHighlighted(h => Math.max(h-1, 0)); }
            if (e.key === "Enter" && open && highlighted >= 0) {
              const opt = options[highlighted];
              if (!value.includes(opt)) onChange([...value, opt]);
            }
          }}
        >
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {value.map(val => (
                <span key={val} className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                  {val}
                  <button type="button" className="ml-1 text-[#F17625] hover:text-[#FAAE3A]" onClick={e => { e.stopPropagation(); onChange(value.filter(v => v !== val)); }}>×</button>
                </span>
              ))}
            </span>
          )}
          <span className="ml-auto text-gray-400">▼</span>
        </div>
        {open && (
          <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
            {options.length === 0 && <div className="px-3 py-2 text-gray-400">No options</div>}
            {options.map((opt, i) => (
              <div
                key={opt}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between ${value.includes(opt) ? 'font-bold text-[#F17625] bg-[#FAAE3A]/10' : ''} ${highlighted === i ? 'bg-[#F17625] text-white' : ''}`}
                onClick={e => { e.stopPropagation(); if (!value.includes(opt)) onChange([...value, opt]); setOpen(false); }}
                onMouseEnter={() => setHighlighted(i)}
              >
                {opt}
                {value.includes(opt) && <span className="ml-2 text-xs text-gray-400 font-semibold">Selected</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Agregar nuevo URL Append
  const handleAddUrlAppend = () => {
    if (!urlAppendInput.name && !urlAppendInput.value) return;
    const newArr = [...(form.urlAppends || []), { name: urlAppendInput.name, value: urlAppendInput.value }];
    setForm({ ...form, urlAppends: newArr });
    setUrlAppendInput({ name: "", value: "" });
  };
  // Eliminar seleccionados
  const handleDeleteSelectedAppends = () => {
    if (!form.urlAppends) return;
    const newArr = form.urlAppends.filter((_: any, idx: number) => !selectedAppends.includes(idx));
    setForm({ ...form, urlAppends: newArr });
    setSelectedAppends([]);
  };
  // Seleccionar todos
  const handleSelectAllAppends = (checked: boolean) => {
    if (checked && form.urlAppends) setSelectedAppends(form.urlAppends.map((_: any, idx: number) => idx));
    else setSelectedAppends([]);
  };
  // Seleccionar individual
  const handleSelectAppend = (idx: number, checked: boolean) => {
    if (checked) setSelectedAppends(prev => [...prev, idx]);
    else setSelectedAppends(prev => prev.filter(i => i !== idx));
  };

  // Handlers para los filtros
  const addFilterGroup = () => {
    setFilterGroups([...filterGroups, { id: nextGroupId, filters: [] }]);
    setNextGroupId(nextGroupId + 1);
  };

  const removeFilterGroup = (groupId: number) => {
    setFilterGroups(filterGroups.filter(g => g.id !== groupId));
  };

  const duplicateFilterGroup = (groupId: number) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (group) {
      setFilterGroups([...filterGroups, { id: nextGroupId, filters: group.filters.map(f => ({ ...f, id: Date.now() + Math.random() })) }]);
      setNextGroupId(nextGroupId + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#f7f7f9] min-h-screen py-8 px-2">
        <div className="bg-white rounded shadow border border-[#e5e7eb] mx-auto max-w-7xl p-12">
          <h1 className="text-2xl font-bold text-[#404042] mb-6">Edit Feed Subscription</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-4 items-center">
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Name</label>
              <div className="md:col-span-9">
                <Input value={form.name} onChange={e => handleChange("name", e.target.value)} className="w-full" />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Type</label>
              <div className="md:col-span-9">
                <Input value={form.type} readOnly className="w-full bg-gray-100" />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Format</label>
              <div className="md:col-span-9">
                <Input value={form.format} readOnly className="w-full bg-gray-100" />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Status</label>
              <div className="md:col-span-9">
                <span className={advertiser?.status ? 'text-green-600 font-semibold' : 'text-gray-500 font-semibold'}>
                  {advertiser?.status ? 'Active' : 'Inactive'}
                </span>
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Advertiser Name</label>
              <div className="md:col-span-9">
                <Input value={advertiserName} readOnly className="w-full bg-gray-100" />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Address</label>
              <div className="md:col-span-9">
                <select className="w-full border rounded px-2 py-2 bg-gray-100" value={selectedAddress} onChange={handleAddressChange}>
                  {addresses.length === 0 && <option>No addresses</option>}
                  {addresses.map((a: any, i: number) => <option key={i} value={a.address}>{a.address}</option>)}
                </select>
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Missing Price to $1</label>
              <div className="md:col-span-9 flex items-center gap-2">
                <input type="checkbox" checked={form.missingPrice} onChange={e => handleChange("missingPrice", e.target.checked)} />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Set new vehicles' miles to 0</label>
              <div className="md:col-span-9 flex items-center gap-2">
                <input type="checkbox" checked={form.setMilesZero} onChange={e => handleChange("setMilesZero", e.target.checked)} />
              </div>
              <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4 flex items-center gap-1">
                Add sale_price Column
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="inline text-[#FAAE3A] ml-1 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xl text-center bg-[#404042] text-white">
                    If not set, the feed will include the vehicle price listed in the 'price' attribute column. If set, vehicle's price will be displayed in 'sale_price' attribute and 'price' attribute will display vehicle's MSRP.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="md:col-span-9 flex items-center gap-2">
                <input type="checkbox" checked={form.addSalePrice} onChange={e => handleChange("addSalePrice", e.target.checked)} />
              </div>
              <label className="md:col-span-12 font-bold text-[#404042] mt-6 mb-2">URL Appends</label>
              <div className="md:col-span-12 bg-white rounded-xl shadow border border-[#e5e7eb] p-8 relative">
                {/* Botones de acción arriba a la derecha */}
                <div className="absolute right-8 top-8 flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white rounded w-10 h-10 flex items-center justify-center transition-colors" title="Eliminar seleccionados" onClick={handleDeleteSelectedAppends}>
                        <Trash2 size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar URL Appends seleccionados</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        ref={helpBtnRef}
                        className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white rounded w-10 h-10 flex items-center justify-center transition-colors"
                        title="Ayuda"
                        onClick={() => setShowPlaceholders(v => !v)}
                      >
                        <HelpCircle size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Ver placeholders disponibles</TooltipContent>
                  </Tooltip>
                  {showPlaceholders && (
                    <div ref={popoverRef} className="absolute right-0 top-14 z-50 w-64 bg-white border rounded shadow-xl">
                      <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Available placeholders</div>
                      <ul className="max-h-80 overflow-y-auto px-4 py-2">
                        {placeholders.map(ph => (
                          <li key={ph} className="py-1 text-[#404042]">{ph}</li>
                        ))}
                      </ul>
                      <div className="border-t px-4 py-2 text-xs text-gray-500">
                        Need Additional Help....Visit <a href="#" className="text-[#2A6BE9] underline">Here</a>
                      </div>
                    </div>
                  )}
                </div>
                {/* Tabla de URL Appends */}
                <div className="w-full mt-8">
                  <table className="w-full text-sm table-fixed">
                    <colgroup>
                      <col className="w-1/12" />
                      <col className="w-5/12" />
                      <col className="w-5/12" />
                      <col className="w-1/12" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="text-center font-bold text-[#404042]"><input type="checkbox" checked={allSelected} onChange={e => handleSelectAllAppends(e.target.checked)} /></th>
                        <th className="text-left px-2 font-bold text-[#404042]">Name</th>
                        <th className="text-left px-2 font-bold text-[#404042]">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!form.urlAppends || form.urlAppends.length === 0) ? (
                        <tr>
                          <td colSpan={3}>
                            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-2 text-center">No URL Appends have been added yet</div>
                          </td>
                        </tr>
                      ) : (
                        form.urlAppends.map((ua: any, idx: number) => (
                          <tr key={idx}>
                            <td className="text-center">
                              <input type="checkbox" checked={selectedAppends.includes(idx)} onChange={e => handleSelectAppend(idx, e.target.checked)} />
                            </td>
                            <td className="px-2"><Input value={ua.name} readOnly className="w-full h-12 text-base" /></td>
                            <td className="px-2"><Input value={ua.value} readOnly className="w-full h-12 text-base" /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Inputs para agregar alineados con la tabla */}
                <div className="grid grid-cols-12 gap-0 mt-6 w-full items-center">
                  <div className="col-span-1" />
                  <div className="col-span-5 pr-2">
                    <Input className="h-12 text-base w-full" value={urlAppendInput.name} onChange={e => setUrlAppendInput({ ...urlAppendInput, name: e.target.value })} />
                  </div>
                  <div className="col-span-5 pr-2">
                    <Input className="h-12 text-base w-full" value={urlAppendInput.value} onChange={e => setUrlAppendInput({ ...urlAppendInput, value: e.target.value })} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white rounded w-12 h-12 flex items-center justify-center transition-colors" title="Agregar URL Append" onClick={handleAddUrlAppend}>
                          <Plus size={24} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Agregar nuevo URL Append</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {/* Campaign URL Preview */}
                <div className="grid grid-cols-12 gap-0 mt-8 w-full items-center">
                  <div className="col-span-1" />
                  <div className="col-span-2 font-semibold text-[#404042]">Campaign URL Preview</div>
                  <div className="col-span-8">
                    <Input value={form.campaignUrlPreview || ""} readOnly className="h-12 bg-gray-100 text-[#404042] border border-gray-200 w-full" />
                  </div>
                  <div className="col-span-1" />
                </div>
              </div>
            </div>
            {/* Filtros y grupos */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                      onClick={addFilterGroup}
                    >
                      <Plus size={16} />
                      <span>Add Filter Group</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Agregar grupo de filtro</TooltipContent>
                </Tooltip>
              </div>
              {filterGroups.map((group, idx) => (
                <div key={group.id} className="mb-4">
                  <FilterBuilder
                    attributes={filterAttributes}
                    onCancel={() => removeFilterGroup(group.id)}
                    onSubmit={(filters) => {
                      setFilterGroups(groups => 
                        groups.map(g => g.id === group.id 
                          ? { ...g, filters: filters.map(f => ({ 
                              id: Date.now() + Math.random(), 
                              field: f.attribute, 
                              operator: f.operator, 
                              value: f.values.join(", ") 
                            }))}
                          : g
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button 
                type="button" 
                className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white font-semibold px-6 transition-colors" 
                onClick={() => router.push("/dashboard/feeds")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] text-white font-semibold px-6 transition-colors"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
} 