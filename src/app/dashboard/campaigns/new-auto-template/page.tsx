"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search, ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import clsx from "clsx";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const advertisers = [
  { id: 1, name: "Alliance Auto Group LTD", hasWebInventory: true },
  { id: 2, name: "Am Ford", hasWebInventory: false },
];
const googleAdsCustomers = [
  { id: 1, name: "550-054-4980" },
  { id: 2, name: "170-908-1293" },
];
const campaigns = [
  { id: 1, name: "FFG VDP Search - Used" },
  { id: 2, name: "FFG Dynamic VDP - All Other New (Ford)" },
];
const negativeKeywordLists = [
  { id: 1, name: "Brand Exclusions" },
  { id: 2, name: "Competitor Exclusions" },
];

// Configuración dinámica de atributos
const filterConfig = {
  Color: {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["null", "black", "blue", "burgundy", "green", "grey", "orange", "pink", "purple", "red", "white", "yellow"]
  },
  condition: {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["certified", "new", "used"]
  },
  "count condition": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  description: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  discount: {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  doors: {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["2", "3", "4", "5"]
  },
  drivertrain: {
    operators: ["is", "is not"],
    valueType: "dropdown",
    options: ["4x2", "4x4", "AWD", "FWD", "RWD", "Other"]
  },
  "fuel type": {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["Electric", "Flex", "Gasoline", "Hybrid", "Other"]
  },
  "image type": {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["Dealer", "Placeholder", "Stock"]
  },
  make: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  "make count condition": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  mileage: {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  model: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  "model count": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  "model count condition": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  price: {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  "price alt.": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  title: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  "title orig.": {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  transmission: {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["Automatic", "Manual", "Other"]
  },
  trim: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  type: {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["Convertible", "Coupe", "Crossover", "Hatchback", "Minivan", "Sedan", "SUV", "Truck", "Van Wagon", "Wagon", "Other"]
  },
  "type count": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  "type count condition": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  URL: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  VIN: {
    operators: ["contains", "not contains", "starts with", "ends with"],
    valueType: "text"
  },
  "vehicle type": {
    operators: ["is", "is not"],
    valueType: "multiselect",
    options: ["Car_Truck", "Boat", "Commercial", "Motorcycle", "PowerSport", "RV_Camper", "Trailer", "Other"]
  },
  year: {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  "year count": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  },
  "year model count condition": {
    operators: [">", ">=", "<", "<=", "between", "=", "!="],
    valueType: "number"
  }
} as const;

export default function NewAutoTemplatePage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [googleCustomer, setGoogleCustomer] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [active, setActive] = useState(true);
  const [customSource, setCustomSource] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [campaign, setCampaign] = useState("");
  const [negativeLists, setNegativeLists] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  // Estado para Ad Group Naming
  const [adGroupName, setAdGroupName] = useState("");
  const [maxCpcBid, setMaxCpcBid] = useState("0.01");
  const [setMaxCpcOnCreate, setSetMaxCpcOnCreate] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  // Estado para tabs
  const [activeTab, setActiveTab] = useState("adgroup");
  const [adsTab, setAdsTab] = useState("responsive");
  const [showAdTypeMenu, setShowAdTypeMenu] = useState(false);
  const [adsPanels, setAdsPanels] = useState({ responsive: true, callonly: true });
  // Estado para keywords
  const [keywords, setKeywords] = useState<{ keyword: string; matchType: string }[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newMatchType, setNewMatchType] = useState("Broad");
  // Estado para mostrar el modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Estado para custom parameters
  const [customParams, setCustomParams] = useState<{ name: string; value: string }[]>([]);
  const [selectedParams, setSelectedParams] = useState<number[]>([]);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [showCustomError, setShowCustomError] = useState(false);
  // Estado para filter groups
  const [filterGroups, setFilterGroups] = useState([
    { id: 1, filters: [] as { id: number; field: string; operator: string; value: string }[], showAttrDropdown: false }
  ]);
  const [nextGroupId, setNextGroupId] = useState(2);
  const [nextFilterId, setNextFilterId] = useState(1);
  // Estado para búsqueda de atributos en el dropdown
  const [attributeSearch, setAttributeSearch] = useState("");
  // Estado para negative keywords dinámico
  const [negativeKeywordLists, setNegativeKeywordLists] = useState<string[]>([]);
  // Estados para switches de cada tab
  const [tabSwitches, setTabSwitches] = useState<Record<string, boolean>>({
    campaign: true,
    adgroup: true,
    ads: false,
    keywords: false,
    adext: false,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("negativeKeywordLists") || "[]");
    setNegativeKeywordLists(stored);
  }, []);

  const filterFields = [
    { value: "make", label: "Make" },
    { value: "model", label: "Model" },
    { value: "year", label: "Year" },
    { value: "price", label: "Price" },
    { value: "mileage", label: "Mileage" },
  ];
  const filterOperators = [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ];

  // Opciones de atributos para el filtro
  const filterAttributes = [
    "Color","condition", "count condition", "description", "discount", "doors", "drivertrain",
     "fuel type", "image type", "make", "make count condition", "mileage", "model", "model count",
      "model count condition", "price", "price alt.", "title", "title orig.", "transmission", "trim", 
      "type count", "type count condition", "URL", "VIN", "vehicle type", "year", "year count", 
      "year model count condition"
  ];

  // Validación robusta para alerta
  const handleAdvertiserChange = (e: any) => {
    const selectedId = e.target.value;
    setAdvertiser(selectedId);
    // Buscar advertiser seleccionado
    const adv = advertisers.find(a => String(a.id) === String(selectedId));
    // Mostrar alerta si no hay advertiser o si no tiene inventario web activo
    setShowAlert(!selectedId || (adv ? !adv.hasWebInventory : false));
  };

  function handleAddKeyword() {
    if (!newKeyword.trim()) return;
    setKeywords([...keywords, { keyword: newKeyword, matchType: newMatchType }]);
    setNewKeyword("");
    setNewMatchType("Broad");
  }

  function handleKeywordChange(idx: number, field: 'keyword' | 'matchType', value: string) {
    setKeywords(keywords.map((kw, i) => i === idx ? { ...kw, [field]: value } : kw));
  }

  function handleSelectKeyword(idx: number, checked: boolean) {
    if (checked) setSelectedKeywords([...selectedKeywords, idx]);
    else setSelectedKeywords(selectedKeywords.filter(i => i !== idx));
  }

  function handleAddCustomParam() {
    if (!newParamName.trim() || !newParamValue.trim()) {
      setShowCustomError(true);
      return;
    }
    setCustomParams([...customParams, { name: newParamName, value: newParamValue }]);
    setNewParamName("");
    setNewParamValue("");
  }

  function handleSelectParam(idx: number, checked: boolean) {
    if (checked) setSelectedParams([...selectedParams, idx]);
    else setSelectedParams(selectedParams.filter(i => i !== idx));
  }

  function addFilterGroup() {
    setFilterGroups([...filterGroups, { id: nextGroupId, filters: [], showAttrDropdown: false }]);
    setNextGroupId(nextGroupId + 1);
  }
  function removeFilterGroup(groupId: number) {
    setFilterGroups(filterGroups.filter(g => g.id !== groupId));
  }
  function duplicateFilterGroup(groupId: number) {
    const group = filterGroups.find(g => g.id === groupId);
    if (group) {
      setFilterGroups([...filterGroups, { id: nextGroupId, filters: group.filters.map(f => ({ ...f, id: nextFilterId + Math.random() })), showAttrDropdown: false }]);
      setNextGroupId(nextGroupId + 1);
    }
  }
  function addFilter(groupId: number) {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: [...g.filters, { id: nextFilterId, field: "make", operator: "equals", value: "" }]
    } : g));
    setNextFilterId(nextFilterId + 1);
  }
  function removeFilter(groupId: number, filterId: number) {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: g.filters.filter(f => f.id !== filterId)
    } : g));
  }
  function updateFilter(groupId: number, filterId: number, key: string, value: string) {
    setFilterGroups(filterGroups.map(g => g.id === groupId ? {
      ...g,
      filters: g.filters.map(f => f.id === filterId ? { ...f, [key]: value } : f)
    } : g));
  }

  const handleTabSwitch = (tab: string, value: boolean) => {
    setTabSwitches((prev) => ({ ...prev, [tab]: value }));
    // Si el tab activo se apaga, cambiar a otro tab activo
    if (!value && activeTab === tab) {
      const nextActive = Object.keys(tabSwitches).find((t) => t !== tab && tabSwitches[t]);
      if (nextActive) setActiveTab(nextActive);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-5xl px-4 sm:px-8 py-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: '#404042' }}>New Auto-Template</h1>
          </div>
          <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#404042' }}>Template Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <Label>Template Name</Label>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Internal name" />
                <Label>Advertiser</Label>
                <select className="w-full border rounded h-10 px-2" value={advertiser} onChange={handleAdvertiserChange}>
                  <option value="">Select advertiser</option>
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <Label>Google Ads Customer</Label>
                <select className="w-full border rounded h-10 px-2" value={googleCustomer} onChange={e => setGoogleCustomer(e.target.value)}>
                  <option value="">Select account</option>
                  {googleAdsCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={e => setEmailNotifications(e.target.checked)}
                    className="accent-[#FAAE3A] w-4 h-4 rounded"
                  />
                  <Label htmlFor="emailNotifications">Enable email notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={active} onCheckedChange={setActive} />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={customSource} onCheckedChange={setCustomSource} />
                  <Label>Use custom source for vehicles</Label>
                </div>
                {showAlert && (
                  <div className="flex items-center gap-2 text-destructive font-medium">
                    <AlertTriangle size={18} />
                    You must select a configured advertiser to access inventory filters.
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Label>Campaign</Label>
                <select className="w-full border rounded h-10 px-2" value={campaign} onChange={e => setCampaign(e.target.value)}>
                  <option value="">Select campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Label>Negative Keywords Lists Selection</Label>
                <MultiSelect
                  options={negativeKeywordLists.map(nk => ({ id: nk, name: nk }))}
                  value={negativeLists}
                  onChange={setNegativeLists}
                  placeholder="Select negative keyword lists..."
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" type="button"><Eye className="w-4 h-4 mr-2" />Preview</Button>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="authorized"
                      checked={authorized}
                      onChange={e => setAuthorized(e.target.checked)}
                      className="accent-[#FAAE3A] w-4 h-4 rounded"
                    />
                    <Label htmlFor="authorized">
                    I authorize Hoot support to revise Final URLs in ads within "Eligible Campaigns" in the event where clearly incorrect URLs are misspending the campaign budget</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
            <div className="flex gap-2 border-b mb-6">
              {[
                { key: "campaign", label: "Campaign Naming" },
                { key: "adgroup", label: "Ad Group Naming" },
                { key: "ads", label: "Ads" },
                { key: "keywords", label: "Keywords" },
                { key: "adext", label: "Ad Extensions" },
              ].map(tab => (
                <div key={tab.key} className="flex items-center gap-2">
                  <button
                    className={clsx(
                      "px-4 py-2 font-medium transition",
                      activeTab === tab.key && tabSwitches[tab.key]
                        ? "bg-[#FAAE3A] text-[#404042] rounded-t"
                        : "bg-transparent text-[#404042] hover:bg-[#FFF3D1]",
                      !tabSwitches[tab.key] && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => tabSwitches[tab.key] && setActiveTab(tab.key)}
                    disabled={!tabSwitches[tab.key]}
                  >
                    {tab.label}
                  </button>
                </div>
              ))}
            </div>
            {activeTab === "campaign" && (
              <div>{/* contenido de Campaign Naming */}</div>
            )}
            {activeTab === "adgroup" && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                  <button type="button" onClick={() => setShowPlaceholders(true)}
                    className="flex items-center gap-1 text-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] px-2 py-1 rounded transition-colors">
                    <Search className="w-4 h-4" />
                    <span className="text-xs">Available Placeholders</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Ad Group Name</Label>
                    <Input value={adGroupName} onChange={e => setAdGroupName(e.target.value)} placeholder="Ad Group Name" />
                  </div>
                  <div>
                    <Label>Max CPC Bid</Label>
                    <Input value={maxCpcBid} onChange={e => setMaxCpcBid(e.target.value)} placeholder="0.01" type="number" min="0" step="0.01" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={setMaxCpcOnCreate} onCheckedChange={setSetMaxCpcOnCreate} />
                    <Label>Set Max CPC Bid only on creation</Label>
                  </div>
                  <div>
                    <Label>Final URL</Label>
                    <Input value={finalUrl} onChange={e => setFinalUrl(e.target.value)} placeholder="Final URL" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "ads" && (
              <div>{/* contenido de Ads */}</div>
            )}
            {activeTab === "keywords" && (
              <div>{/* contenido de Keywords */}</div>
            )}
            {activeTab === "adext" && (
              <div>{/* contenido de Ad Extensions */}</div>
            )}
          </div>
          {showPlaceholders && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded shadow-lg p-6 min-w-[320px] max-w-[90vw]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-primary">Available Placeholders</h2>
                  <button onClick={() => setShowPlaceholders(false)} className="text-gray-500 hover:text-primary font-bold text-xl">&times;</button>
                </div>
                <div className="mb-4">
                  <div className="font-semibold mb-1">From Advertiser Settings</div>
                  <div className="pl-2 text-sm text-gray-700 space-y-1">
                    <div>[advertiser_website]</div>
                    <div>[advertiser_dba]</div>
                    <div>[advertiser_city]</div>
                    <div>[advertiser_state]</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold mb-1">From Product Alias</div>
                  <div className="pl-2 text-sm text-gray-700 space-y-1">
                    <div>[Make_alt]</div>
                    <div>[Model_alt]</div>
                    <div>[Trim_alt]</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setShowPlaceholders(false)} className="bg-gray-300 hover:bg-primary text-gray-800 font-semibold py-1 px-4 rounded">Close</button>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center border border-[#FAAE3A]/40">
                <div className="flex flex-col items-center mb-6">
                  <div className="rounded-full border-4 border-[#FAAE3A] bg-[#FFF8E1] flex items-center justify-center mb-4" style={{ width: 80, height: 80 }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" stroke="#FAAE3A" strokeWidth="4" fill="#FFF8E1" />
                      <rect x="22" y="14" width="4" height="16" rx="2" fill="#FAAE3A" />
                      <rect x="22" y="34" width="4" height="4" rx="2" fill="#FAAE3A" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#404042] mb-2 text-center">Are you sure?</h2>
                  <p className="text-[#404042] text-center text-lg opacity-80">You are going to delete selected keywords</p>
                </div>
                <div className="flex gap-4 mt-2 w-full justify-center">
                  <button
                    className="bg-[#FF6B6B] hover:bg-[#E74C3C] text-white font-semibold px-7 py-2.5 rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/40"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#3498DB] hover:bg-[#2980B9] text-white font-semibold px-7 py-2.5 rounded-lg shadow transition-all border-2 border-[#3498DB] focus:outline-none focus:ring-2 focus:ring-[#3498DB]/40"
                    onClick={() => {
                      setKeywords(keywords.filter((_, idx) => !selectedKeywords.includes(idx)));
                      setSelectedKeywords([]);
                      setShowDeleteModal(false);
                    }}
                  >
                    Yes, delete it!
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button variant="secondary" type="button">Save</Button>
            <Button type="submit">Save and Apply</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

type MultiSelectOption = { id: string | number; name: string };

function MultiSelect({ options, value, onChange, placeholder = "Select option" }: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  const allSelected = value.length === options.length;
  return (
    <div className="relative" ref={ref}>
      <div
        className="border rounded w-full min-h-[40px] bg-white flex items-center flex-wrap gap-1 px-2 py-1 cursor-pointer"
        onClick={() => setOpen(v => !v)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {options.filter((o) => value.includes(String(o.id))).map((o) => (
              <span key={o.id} className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                {o.name}
                <button type="button" className="ml-1 text-[#F17625] hover:text-[#FAAE3A]" onClick={e => { e.stopPropagation(); onChange(value.filter(v => v !== String(o.id))); }}>×</button>
              </span>
            ))}
          </span>
        )}
        <span className="ml-auto text-gray-400">▼</span>
      </div>
      {open && (
        <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center px-2 py-1 border-b">
            <button type="button" className="text-xs text-[#FAAE3A] hover:underline" onClick={e => {e.stopPropagation(); onChange(options.map(o => String(o.id)));}}>Select All</button>
            <button type="button" className="text-xs text-[#FAAE3A] hover:underline" onClick={e => {e.stopPropagation(); onChange([]);}}>Deselect All</button>
          </div>
          {options.map((o) => (
            <label key={o.id} className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={value.includes(String(o.id))}
                onChange={e => {
                  if (e.target.checked) {
                    onChange([...value, String(o.id)]);
                  } else {
                    onChange(value.filter(v => v !== String(o.id)));
                  }
                }}
                className="mr-2"
                onClick={e => e.stopPropagation()}
              />
              {o.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
} 