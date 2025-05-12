"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { useAdvertiserStore } from "@/app/dashboard/advertisers/store";
import { 
  Info, 
  Plus, 
  Minus, 
  Copy, 
  Trash2, 
  ArrowLeft, 
  ArrowRight,
  X, 
  Check,
  Filter,
  HelpCircle
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";

export default function FeedSubscriptionPage() {
  const router = useRouter();
  const advertisers = useAdvertiserStore(state => state.advertisers);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    feedName: "",
    feedType: "Default",
    feedFormat: "Google Ads",
    advertiserIds: [] as string[],
    missingPrice: false,
    setMilesZero: false,
    addSalePrice: false,
    urlAppends: [] as { name: string; value: string }[],
  });
  const [urlAppendInput, setUrlAppendInput] = useState({ name: "", value: "" });
  const [urlAppendError, setUrlAppendError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showAdvertiserError, setShowAdvertiserError] = useState(false);

  // Paso final: Resumen readonly y filtros
  const [filterGroups, setFilterGroups] = useState([
    { id: 1, filters: [] as { id: number; field: string; operator: string; value: string }[] }
  ]);
  const [nextGroupId, setNextGroupId] = useState(2);
  const [nextFilterId, setNextFilterId] = useState(1);

  // Filtros disponibles (puedes personalizar)
  const filterFields = [
    { value: "make", label: "Make" },
    { value: "model", label: "Model" },
    { value: "year", label: "Year" },
    { value: "price", label: "Price" },
    { value: "mileage", label: "Mileage" },
  ];
  const filterOperators = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "greater", label: ">" },
    { value: "less", label: "<" },
    { value: "contains", label: "Contains" },
  ];

  // Agregar estado para Google VLA
  const [vehicleFulfillment, setVehicleFulfillment] = useState<string[]>([]);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef<HTMLDivElement>(null);
  const [storeCode, setStoreCode] = useState("");
  const [setMilesZero, setSetMilesZero] = useState(false);
  const vehicleFulfillmentOptions = [
    "In Store",
    "Ship to Store",
    "Online"
  ];

  // Cerrar dropdown al hacer clic fuera
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(e.target as Node)) setVehicleDropdownOpen(false);
    }
    if (vehicleDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [vehicleDropdownOpen]);

  const handleAddUrlAppend = () => {
    if (!urlAppendInput.name || !urlAppendInput.value) {
      setUrlAppendError("Please complete all fields before adding more.");
      return;
    }
    setFormData({
      ...formData,
      urlAppends: [...formData.urlAppends, urlAppendInput],
    });
    setUrlAppendInput({ name: "", value: "" });
    setUrlAppendError("");
  };

  const handleRemoveUrlAppend = (idx: number) => {
    setFormData({
      ...formData,
      urlAppends: formData.urlAppends.filter((_, i) => i !== idx),
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.feedName) return;
      setStep(2);
    } else if (step === 2) {
      if ((formData.feedFormat === "Facebook (Automotive)" || 
           formData.feedFormat === "Facebook (Retail)" ||
           formData.feedFormat === "Google Ads") && formData.advertiserIds.length === 0) {
        setShowAdvertiserError(true);
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  // Campaign URL Preview (simple example)
  const campaignUrlPreview = `https://example.com/feed?name=${formData.feedName}&type=${formData.feedType}&format=${formData.feedFormat}${formData.urlAppends.map(u => `&${u.name}=${u.value}`).join("")}`;

  // Estado para mostrar/ocultar campos de URL Appends
  const [showUrlAppendFields, setShowUrlAppendFields] = useState(false);

  // Extrae la UI de URL Appends a un componente interno reutilizable
  function UrlAppendsSection() {
    const [showPlaceholders, setShowPlaceholders] = useState(false);
    const placeholderRef = useRef<HTMLDivElement>(null);
    // Cerrar popup de placeholders al hacer clic fuera
    React.useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (placeholderRef.current && !placeholderRef.current.contains(e.target as Node)) setShowPlaceholders(false);
      }
      if (showPlaceholders) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [showPlaceholders]);
    return (
      <>
        {!showUrlAppendFields ? (
          <div className="w-full">
            <Button type="button" className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4" onClick={() => setShowUrlAppendFields(true)}>+URL</Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full items-center">
              <Input
                value={urlAppendInput.name}
                onChange={e => setUrlAppendInput({ ...urlAppendInput, name: e.target.value })}
                placeholder="Name"
                className="w-1/2 border-2 border-[#e5e7eb] focus:border-[#FAAE3A] focus:ring-0 text-[#404042]"
              />
              <Input
                value={urlAppendInput.value}
                onChange={e => setUrlAppendInput({ ...urlAppendInput, value: e.target.value })}
                placeholder="Value"
                className="w-1/2 border-2 border-[#e5e7eb] focus:border-[#FAAE3A] focus:ring-0 text-[#404042]"
              />
              <Button type="button" style={{ background: '#FAAE3A', color: 'white' }} className="font-semibold px-4 rounded hover:bg-[#F17625]" onClick={() => { handleAddUrlAppend(); setShowUrlAppendFields(false); }}>Add</Button>
              <Button type="button" style={{ background: '#F17625', color: 'white' }} className="font-semibold px-4 rounded hover:bg-[#FAAE3A]" onClick={() => { setShowUrlAppendFields(false); setUrlAppendInput({ name: '', value: '' }); }}>Cancel</Button>
              <button type="button" className="ml-1 flex items-center justify-center rounded border border-[#F17625] bg-[#FFF3D1] p-2 transition hover:bg-[#FAAE3A]" onClick={() => setShowPlaceholders(v => !v)}>
                <HelpCircle size={18} color="#F17625" />
              </button>
              {showPlaceholders && (
                <div ref={placeholderRef} className="absolute z-30 bg-white border rounded shadow-lg p-4 w-full left-0 top-12">
                  <div className="font-semibold text-gray-700 mb-2">Available placeholders</div>
                  <ul className="text-[#404042] text-sm space-y-1 mb-2">
                    <li>Item Description</li>
                    <li>Item Category</li>
                    <li>ID</li>
                    <li>Image URL</li>
                    <li>Final URL</li>
                    <li>Item Title</li>
                  </ul>
                  <div className="bg-gray-100 text-xs p-2 rounded">
                    Need Additional Help....Visit <a href="#" className="text-blue-600 underline">Here</a>
                  </div>
                </div>
              )}
            </div>
            {urlAppendError && <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-2 w-full">{urlAppendError}</div>}
            <div className="border rounded bg-yellow-50 text-yellow-800 text-center py-2 mb-2 w-full" style={{ display: formData.urlAppends.length === 0 ? 'block' : 'none' }}>
              No URL Appends have been added yet
            </div>
            {formData.urlAppends.length > 0 && (
              <table className="w-full mb-2">
                <thead>
                  <tr>
                    <th className="text-left px-2">Name</th>
                    <th className="text-left px-2">Value</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.urlAppends.map((u, i) => (
                    <tr key={i}>
                      <td className="px-2">{u.name}</td>
                      <td className="px-2">{u.value}</td>
                      <td><Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveUrlAppend(i)}>🗑️</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </>
    );
  }

  // Step 1: Campos principales
  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4 items-center max-w-4xl mx-auto">
      <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Name</label>
      <div className="md:col-span-9">
        <Input
          value={formData.feedName}
          onChange={e => setFormData({ ...formData, feedName: e.target.value })}
          placeholder=""
          className="w-full"
          required
        />
      </div>
      <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Type</label>
      <div className="md:col-span-9">
        <Select
          value={formData.feedType}
          onValueChange={value => setFormData({ ...formData, feedType: value })}
        >
          <SelectTrigger className="w-full" >
            <SelectValue placeholder="Select feed type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default</SelectItem>
            <SelectItem value="Aging inventory">Aging inventory</SelectItem>
            <SelectItem value="Highest Prices">Highest Prices</SelectItem>
            <SelectItem value="Lowest Prices">Lowest Prices</SelectItem>
            <SelectItem value="Now Available">Now Available</SelectItem>
            <SelectItem value="Price Drops">Price Drops</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Format</label>
      <div className="md:col-span-9">
        <Select
          value={formData.feedFormat}
          onValueChange={value => setFormData({ ...formData, feedFormat: value })}
        >
          <SelectTrigger className="w-full" >
            <SelectValue placeholder="Select feed format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Facebook (Automotive)">Facebook (Automotive)</SelectItem>
            <SelectItem value="Facebook (Retail)">Facebook (Retail)</SelectItem>
            <SelectItem value="Google Ads">Google Ads</SelectItem>
            <SelectItem value="Google My Business">Google My Business</SelectItem>
            <SelectItem value="Google VLA">Google VLA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Multiselect custom para advertisers
  function AdvertiserMultiSelect({ advertisers, value, onChange, error }: { advertisers: any[], value: string[], onChange: (v: string[]) => void, error?: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Cerrar el menú si se hace clic fuera
    React.useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const allSelected = value.length === advertisers.length;

    return (
      <div className="relative" ref={ref}>
        <div
          className={`border rounded w-full min-h-[40px] bg-white flex items-center flex-wrap gap-1 px-2 py-1 cursor-pointer ${error ? 'border-red-400' : ''}`}
          onClick={() => setOpen((v) => !v)}
        >
          {value.length === 0 ? (
            <span className="text-gray-400">Select advertisers...</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {advertisers.filter(a => value.includes(a.id)).map(a => (
                <span key={a.id} className="bg-[#FAAE3A]/20 text-[#404042] rounded px-2 py-0.5 text-xs font-semibold">{a.name}</span>
              ))}
            </span>
          )}
          <span className="ml-auto text-gray-400">▼</span>
        </div>
        {open && (
          <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center px-2 py-1 border-b">
              <button type="button" className="text-xs text-blue-600 hover:underline" onClick={e => {e.stopPropagation(); onChange(advertisers.map(a => a.id));}}>Select All</button>
              <button type="button" className="text-xs text-blue-600 hover:underline" onClick={e => {e.stopPropagation(); onChange([]);}}>Deselect All</button>
            </div>
            {advertisers.map(a => (
              <label key={a.id} className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value.includes(a.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      onChange([...value, a.id]);
                    } else {
                      onChange(value.filter(id => id !== a.id));
                    }
                  }}
                  className="mr-2"
                  onClick={e => e.stopPropagation()}
                />
                {a.name}
              </label>
            ))}
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    );
  }

  // Step 2: Para Facebook Automotive, Facebook Retail y Google Ads
  const renderStep2 = () => {
    if (formData.feedFormat === "Facebook (Automotive)" || 
        formData.feedFormat === "Facebook (Retail)" ||
        formData.feedFormat === "Google Ads") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4 items-center max-w-4xl mx-auto">
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Name</label>
          <div className="md:col-span-9">
            <Input value={formData.feedName} readOnly className="w-full" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Type</label>
          <div className="md:col-span-9">
            <Input value={formData.feedType} readOnly className="w-full" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Format</label>
          <div className="md:col-span-9">
            <Input value={formData.feedFormat} readOnly className="w-full" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Advertisers</label>
          <div className="md:col-span-9">
            <AdvertiserMultiSelect
              advertisers={advertisers}
              value={formData.advertiserIds}
              onChange={ids => { setFormData({ ...formData, advertiserIds: ids }); setShowAdvertiserError(false); }}
              error={showAdvertiserError ? 'At least one advertiser is required.' : undefined}
            />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">URL Appends</label>
          <div className="md:col-span-9">
            <UrlAppendsSection />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Campaign URL Preview</label>
          <div className="md:col-span-9">
            <Input value={campaignUrlPreview} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" />
          </div>
        </div>
      );
    } else if (formData.feedFormat === "Google VLA") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4 items-center max-w-4xl mx-auto">
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Name</label>
          <div className="md:col-span-9">
            <Input value={formData.feedName} readOnly className="w-full bg-gray-100" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Type</label>
          <div className="md:col-span-9">
            <Input value={formData.feedType} readOnly className="w-full bg-gray-100" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Format</label>
          <div className="md:col-span-9">
            <Input value={formData.feedFormat} readOnly className="w-full bg-gray-100" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Advertisers</label>
          <div className="md:col-span-9">
            <Input value={advertisers.filter(a => formData.advertiserIds.includes(a.id)).map(a => a.name).join(", ")} readOnly className="w-full bg-gray-100" placeholder="Nothing selected" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4 flex items-center gap-1">Store Code
            <span className="relative group cursor-pointer">
              <span className="ml-1 text-[#404042] bg-[#FFF3D1] rounded-full px-1">?</span>
              <span className="absolute left-0 top-full mt-2 z-10 w-72 bg-[#404042] text-white text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">If is not set, the Store Code at the Advertiser level will be used</span>
            </span>
          </label>
          <div className="md:col-span-9">
            <Input value={storeCode} onChange={e => setStoreCode(e.target.value)} className="w-full" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Vehicle Fulfillment</label>
          <div className="md:col-span-9">
            <div className="relative" ref={vehicleDropdownRef}>
              <div className="border rounded w-full min-h-[40px] bg-white flex items-center flex-wrap gap-1 px-2 py-1 cursor-pointer" onClick={() => setVehicleDropdownOpen(v => !v)}>
                <span className="flex flex-wrap gap-1">
                  {vehicleFulfillment.length === 0 ? (
                    <span className="text-gray-400">Nothing selected</span>
                  ) : (
                    vehicleFulfillment.map(opt => (
                      <span key={opt} className="bg-[#FAAE3A]/20 text-[#404042] rounded px-2 py-0.5 text-xs font-semibold">{opt}</span>
                    ))
                  )}
                </span>
                <span className="ml-auto text-gray-400">▼</span>
              </div>
              {vehicleDropdownOpen && (
                <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
                  <div className="flex justify-between items-center px-2 py-1 border-b">
                    <button type="button" className="text-xs text-[#FAAE3A] hover:underline" onClick={e => {e.stopPropagation(); setVehicleFulfillment(vehicleFulfillmentOptions); setVehicleDropdownOpen(false);}}>Select All</button>
                    <button type="button" className="text-xs text-[#FAAE3A] hover:underline" onClick={e => {e.stopPropagation(); setVehicleFulfillment([]); setVehicleDropdownOpen(false);}}>Deselect All</button>
                  </div>
                  {vehicleFulfillmentOptions.map(opt => (
                    <label key={opt} className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={vehicleFulfillment.includes(opt)}
                        onChange={e => {
                          if (e.target.checked) setVehicleFulfillment([...vehicleFulfillment, opt]);
                          else setVehicleFulfillment(vehicleFulfillment.filter(o => o !== opt));
                          setVehicleDropdownOpen(false);
                        }}
                        className="mr-2"
                        onClick={e => e.stopPropagation()}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Set new vehicles' miles to 0</label>
          <div className="md:col-span-9 flex items-center">
            <input type="checkbox" checked={setMilesZero} onChange={e => setSetMilesZero(e.target.checked)} className="mr-2" />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">URL Appends</label>
          <div className="md:col-span-9">
            <UrlAppendsSection />
          </div>
          <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Campaign URL Preview</label>
          <div className="md:col-span-9">
            <Input value={campaignUrlPreview} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" />
          </div>
        </div>
      );
    }
    return null;
  };

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
      setFilterGroups([...filterGroups, { id: nextGroupId, filters: group.filters.map(f => ({ ...f, id: nextFilterId + Math.random() })) }]);
      setNextGroupId(nextGroupId + 1);
    }
  };
  const addFilter = (groupId: number) => {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: [...g.filters, { id: nextFilterId, field: "make", operator: "equals", value: "" }]
    } : g));
    setNextFilterId(nextFilterId + 1);
  };
  const removeFilter = (groupId: number, filterId: number) => {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: g.filters.filter(f => f.id !== filterId)
    } : g));
  };
  const updateFilter = (groupId: number, filterId: number, key: string, value: string) => {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: g.filters.map(f => f.id === filterId ? { ...f, [key]: value } : f)
    } : g));
  };

  const handleFinalSubmit = () => {
    // Crear el nuevo feed
    const newFeed = {
      id: Date.now().toString(),
      name: formData.feedName,
      type: formData.feedType,
      format: formData.feedFormat,
      urlAppends: formData.urlAppends,
      advertisers: formData.advertiserIds,
      filters: filterGroups,
    };
    // Guardar en localStorage por cada advertiser
    const existing = JSON.parse(localStorage.getItem('customFeeds') || '{}');
    formData.advertiserIds.forEach(id => {
      if (!existing[id]) existing[id] = [];
      existing[id].push(newFeed);
    });
    localStorage.setItem('customFeeds', JSON.stringify(existing));
    router.push("/dashboard/feeds");
  };

  // Paso final: resumen y filtros
  const renderFinalStep = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-4 items-center max-w-4xl mx-auto mb-8">
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Name</label>
        <div className="md:col-span-9"><Input value={formData.feedName} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Type</label>
        <div className="md:col-span-9"><Input value={formData.feedType} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Feed Format</label>
        <div className="md:col-span-9"><Input value={formData.feedFormat} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Advertisers</label>
        <div className="md:col-span-9">
          <Input value={advertisers.filter(a => formData.advertiserIds.includes(a.id)).map(a => a.name).join(", ") || "-"} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042] mb-2" />
          <span className="font-semibold text-[#404042] mr-2">Address</span>
          <select disabled className="border-2 border-[#e5e7eb] bg-gray-100 text-[#404042] px-2 py-1 rounded">
            {advertisers.filter(a => formData.advertiserIds.includes(a.id)).map(a => (
              <option key={a.id} value={a.id}>{a.addresses?.[0]?.address || "-"}</option>
            ))}
          </select>
        </div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Missing Price to $1</label>
        <div className="md:col-span-9"><Input value={formData.missingPrice ? "True" : "False"} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Set new vehicles' miles to 0</label>
        <div className="md:col-span-9"><Input value={formData.setMilesZero ? "True" : "False"} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
        <label className="md:col-span-3 font-semibold text-[#404042] text-right pr-4">Add sale_price Column</label>
        <div className="md:col-span-9"><Input value={formData.addSalePrice ? "True" : "False"} readOnly className="w-full border-2 border-[#e5e7eb] bg-gray-100 text-[#404042]" /></div>
      </div>
      {/* Filtros por grupo */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] text-white px-2 py-1 rounded flex items-center gap-1" onClick={addFilterGroup}>
            <Plus size={16} />
            <span>Add Filter Group</span>
          </Button>
        </div>
        {filterGroups.map((group, idx) => (
          <div key={group.id} className="border rounded bg-[#f7f7f9] mb-4">
            <div className="flex items-center gap-2 px-4 py-2 border-b">
              <span className="font-semibold text-[#404042]">Filter Group {idx + 1}</span>
              <Button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] text-white px-2 py-1 rounded flex items-center gap-1" onClick={() => addFilter(group.id)}>
                <Plus size={16} />
                <span>Add Filter</span>
              </Button>
              <Button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] text-white px-2 py-1 rounded flex items-center gap-1" onClick={() => removeFilterGroup(group.id)}>
                <Trash2 size={16} />
                <span>Remove Group</span>
              </Button>
              <Button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] text-white px-2 py-1 rounded flex items-center gap-1" onClick={() => duplicateFilterGroup(group.id)}>
                <Copy size={16} />
                <span>Duplicate</span>
              </Button>
            </div>
            {group.filters.length === 0 ? (
              <div className="bg-yellow-100 text-yellow-800 text-center py-4 px-2 flex items-center justify-center gap-2">
                <Filter size={20} />
                <span>There are currently no filters added. If you like, you can add one by clicking the plus sign on the filter group.</span>
              </div>
            ) : (
              <div className="p-4">
                {group.filters.map((filter, fidx) => (
                  <div key={filter.id} className="flex items-center gap-2 mb-2">
                    <select value={filter.field} onChange={e => updateFilter(group.id, filter.id, "field", e.target.value)} className="border rounded px-2 py-1">
                      {filterFields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <select value={filter.operator} onChange={e => updateFilter(group.id, filter.id, "operator", e.target.value)} className="border rounded px-2 py-1">
                      {filterOperators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <Input value={filter.value} onChange={e => updateFilter(group.id, filter.id, "value", e.target.value)} className="w-40 border" />
                    <Button type="button" className="bg-[#404042] hover:bg-[#FAAE3A] text-white px-2 py-1 rounded flex items-center gap-1" onClick={() => removeFilter(group.id, filter.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-start md:justify-end gap-4 mt-8 max-w-4xl mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/feeds")}
          className="px-6 border-2 border-[#404042] text-[#404042] bg-white hover:bg-[#FAAE3A] hover:text-white hover:border-[#FAAE3A] flex items-center gap-2"
        >
          <X size={16} />
          Cancel
        </Button>
        <Button
          type="button"
          className="px-6 bg-[#404042] hover:bg-[#FAAE3A] text-white font-semibold border-2 border-[#404042] hover:border-[#FAAE3A] flex items-center gap-2"
          onClick={handleFinalSubmit}
        >
          <Check size={16} />
          Submit
        </Button>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="max-w-full bg-[#f7f7f9] min-h-screen py-4 px-2">
        <div className="bg-white rounded shadow border border-[#e5e7eb] mx-auto mt-2" style={{ maxWidth: 1800 }}>
          <div className="border-b border-[#e5e7eb] px-6 py-4">
            <h1 className="text-2xl font-bold text-[#404042]">New Feed Subscription</h1>
          </div>
          <form className="w-full px-6 py-8" onSubmit={e => { e.preventDefault(); handleNext(); }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderFinalStep()}
            <div className="flex flex-row justify-start md:justify-end gap-4 mt-8 max-w-4xl mx-auto">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="px-6 border-2 border-[#404042] text-[#404042] bg-white hover:bg-[#FAAE3A] hover:text-white hover:border-[#FAAE3A] flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button
                  type="submit"
                  className="px-6 bg-[#404042] hover:bg-[#FAAE3A] text-white font-semibold border-2 border-[#404042] hover:border-[#FAAE3A] flex items-center gap-2"
                  disabled={
                    (step === 1 && !formData.feedName) ||
                    (step === 2 && (formData.feedFormat === "Facebook (Automotive)" || 
                                  formData.feedFormat === "Facebook (Retail)" ||
                                  formData.feedFormat === "Google Ads") && formData.advertiserIds.length === 0)
                  }
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
} 