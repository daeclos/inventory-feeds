"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search, ChevronDown, Upload, Download, Trash, Plus, HelpCircle, RefreshCcw } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import clsx from "clsx";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNegativeKeywordStore } from "@/store/negativeKeywordStore";
import { FilterBuilder, filterAttributes as fbAttributes } from "@/components/ui/FilterBuilder";

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

interface FilterConfigBase {
  operators: string[];
  valueType: string;
}

interface MultiSelectFilterConfig extends FilterConfigBase {
  valueType: 'multiselect' | 'dropdown';
  options: string[];
}

interface TextFilterConfig extends FilterConfigBase {
  valueType: 'text';
}

interface NumberFilterConfig extends FilterConfigBase {
  valueType: 'number';
}

type FilterConfigType = MultiSelectFilterConfig | TextFilterConfig | NumberFilterConfig;

// Configuración dinámica de atributos
const filterConfig: Record<string, FilterConfigType> = {
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
  const [activeTab, setActiveTab] = useState("campaign");
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
  const { lists: negativeKeywordLists } = useNegativeKeywordStore();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("negativeKeywordLists") || "[]");
    setNegativeLists(stored);
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

  const tabList = [
    { key: "campaign", label: "Campaign Settings" },
    { key: "adgroup", label: "Ad Group Naming" },
    { key: "ads", label: "Ads" },
    { key: "keywords", label: "Keywords" },
    { key: "adext", label: "Ad Group Custom Parameters" },
  ];

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
                  options={negativeKeywordLists.map((nk, idx) => ({ id: idx, name: nk.name }))}
                  value={negativeLists}
                  onChange={setNegativeLists}
                  placeholder="Select negative keyword lists..."
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
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
          {showAlert && (
            <div className="bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg p-4 mt-4">
              <p className="text-[#D32F2F] text-sm">
                Web Inventory Filters are not available because the selected Advertiser is not yet configured or no Advertiser is selected.
              </p>
            </div>
          )}

          {/* Filter Builder Section */}
          {advertiser && (
            <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
              <h2 className="text-lg font-semibold mb-6" style={{ color: '#404042' }}>Filter Builder</h2>
              <FilterBuilder attributes={fbAttributes} />
            </div>
          )}

          <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
            <div className="flex gap-0 border-b border-[#FAAE3A] bg-[#FFF8E1] rounded-t-xl overflow-x-auto">
              {tabList.map(tab => (
                <button
                  key={tab.key}
                  className={clsx(
                    "px-6 py-3 font-semibold text-sm transition-all focus:outline-none",
                    activeTab === tab.key
                      ? "bg-[#faad39ff] text-[#404042] border-b-4 border-[#faad39ff] rounded-t-xl"
                      : "bg-white text-[#404042]/70 border-b-4 border-transparent hover:bg-[#FFF3D1] rounded-t-lg"
                  )}
                  onClick={() => setActiveTab(tab.key)}
                  style={{ minWidth: 160 }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === "campaign" && (
              <div className="bg-white border border-[#FAAE3A]/30 rounded-b-xl p-8 mt-0">
                <div className="mb-6">
                  <span className="text-[#FAAE3A] font-bold text-lg">Campaign Settings</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Campaign Selection</div>
                  <div className="md:col-span-3">
                    <select className="w-full border border-[#FAAE3A]/40 rounded-lg h-11 px-3 bg-[#FFF8E1] text-[#404042] focus:ring-2 focus:ring-[#FAAE3A]" value={campaign} onChange={e => setCampaign(e.target.value)}>
                      <option value="">Select a Google Ads customer before set the campaign.</option>
                      {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      type="button"
                      className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1] min-w-[40px] min-h-[40px] rounded-lg shadow-none"
                    >
                      <RefreshCcw className="w-5 h-5" />
                      Refresh
                    </Button>
                  </div>
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Negative Keywords Lists Selection</div>
                  <div className="md:col-span-4">
                    <MultiSelect
                      options={negativeKeywordLists.map((nk, idx) => ({ id: idx, name: nk.name }))}
                      value={negativeLists}
                      onChange={setNegativeLists}
                      placeholder="Select negative keyword lists..."
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "adgroup" && (
              <div className="bg-white border border-[#FAAE3A]/30 rounded-b-xl p-8 mt-0">
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-[#FAAE3A] font-bold text-lg">Ad Group Naming</span>
                  <button type="button" onClick={() => setShowPlaceholders(true)} className="flex items-center gap-1 text-[#1976D2] hover:underline text-xs font-semibold">
                    <span className="material-icons text-base">search</span> Available Placeholders
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Ad Group Name</div>
                  <div className="md:col-span-4"><Input value={adGroupName} onChange={e => setAdGroupName(e.target.value)} className="bg-[#FFF8E1] border-[#FAAE3A]/40 rounded-lg" /></div>
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Max CPC Bid</div>
                  <div className="md:col-span-4"><Input value={maxCpcBid} disabled className="bg-[#F5F5F5] border-[#FAAE3A]/40 rounded-lg text-[#404042]/60" /></div>
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Set Max CPC Bid only on creation</div>
                  <div className="md:col-span-4"><Switch checked={setMaxCpcOnCreate} onCheckedChange={setSetMaxCpcOnCreate} /></div>
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Final URL</div>
                  <div className="md:col-span-4 flex items-center gap-2">
                    <Input value={finalUrl} onChange={e => setFinalUrl(e.target.value)} className="bg-[#FFF8E1] border-[#FAAE3A]/40 rounded-lg" />
                    <span className="material-icons text-[#1976D2] cursor-pointer" title="Help">help_outline</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "ads" && (
              <div className="bg-white border border-[#FAAE3A]/30 rounded-b-xl p-8 mt-0">
                <div className="mb-6 text-[#FAAE3A] font-bold text-lg">Ads</div>
                <div className="space-y-6">
                  {/* Responsive Search Ads Accordion */}
                  <div className="border border-[#FAAE3A]/20 rounded-lg bg-[#FFF8E1]">
                    <button
                      type="button"
                      className="w-full flex justify-between items-center px-4 py-2 border-b border-[#FAAE3A]/20 text-[#404042] font-semibold focus:outline-none"
                      onClick={() => setAdsPanels(p => ({ ...p, responsive: !p.responsive }))}
                    >
                      <span>Responsive Search Ads</span>
                      <span
                        className={`transition-transform duration-200 ${adsPanels.responsive ? 'rotate-0' : 'rotate-180'}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 10l5 5 5-5" stroke="#404042" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {adsPanels.responsive && (
                      <div className="px-4 py-4 text-[#404042]/80 text-sm">There are no Responsive Search Ads added, if you like, you can add one by clicking the plus sign.</div>
                    )}
                  </div>
                  {/* Call-Only Ads Accordion */}
                  <div className="border border-[#FAAE3A]/20 rounded-lg bg-[#FFF8E1]">
                    <button
                      type="button"
                      className="w-full flex justify-between items-center px-4 py-2 border-b border-[#FAAE3A]/20 text-[#404042] font-semibold focus:outline-none"
                      onClick={() => setAdsPanels(p => ({ ...p, callonly: !p.callonly }))}
                    >
                      <span>Call-Only Ads</span>
                      <span
                        className={`transition-transform duration-200 ${adsPanels.callonly ? 'rotate-0' : 'rotate-180'}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 10l5 5 5-5" stroke="#404042" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {adsPanels.callonly && (
                      <div className="px-4 py-4 text-[#404042]/80 text-sm">There are no Call-Only Ads added, if you like, you can add one by clicking the plus sign.</div>
                    )}
                  </div>
                  <Button
                    variant="default"
                    type="button"
                    className="flex items-center gap-2 bg-[#faad39ff] hover:bg-[#F17625] text-[#404042ff] font-bold px-6 py-2 rounded-lg shadow-none min-w-[40px] min-h-[40px]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ad
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "keywords" && (
              <div className="bg-white border border-[#FAAE3A]/30 rounded-b-xl p-8 mt-0">
                <div className="mb-6 text-[#FAAE3A] font-bold text-lg">Keywords</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-2 rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-[#404042] bg-[#FFF3D1]">Keyword</th>
                        <th className="text-left px-4 py-2 font-semibold text-[#404042] bg-[#FFF3D1]">Match Type</th>
                        <th className="px-4 py-2 bg-[#FFF3D1]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.length === 0 ? (
                        <tr><td colSpan={3} className="bg-[#FFF8E1] text-[#404042]/70 px-4 py-4 text-center text-sm">No keywords have been added yet</td></tr>
                      ) : (
                        keywords.map((kw, idx) => (
                          <tr key={idx} className="hover:bg-[#FFF3D1]">
                            <td className="px-4 py-2">{kw.keyword}</td>
                            <td className="px-4 py-2">{kw.matchType}</td>
                            <td className="px-4 py-2"><input type="checkbox" checked={selectedKeywords.includes(idx)} onChange={e => handleSelectKeyword(idx, e.target.checked)} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Botones de archivo y eliminar */}
                  <div className="flex gap-2 mb-4 mt-2">
                    <Button variant="outline" className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]">
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]" onClick={() => setShowDeleteModal(true)}>
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                  {/* Input para agregar keyword */}
                  <div className="flex flex-col sm:flex-row gap-2 items-center mt-2">
                    <Input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} className="bg-[#FFF8E1] border-[#faad39ff] rounded-lg flex-1 min-w-[180px] text-[#404042ff]" placeholder="Add keyword..." />
                    <select className="border border-[#faad39ff] rounded-lg h-11 px-2 bg-[#FFF8E1] text-[#404042ff] focus:ring-2 focus:ring-[#faad39ff]" value={newMatchType} onChange={e => setNewMatchType(e.target.value)}>
                      <option value="Broad">Broad</option>
                      <option value="Phrase">Phrase</option>
                      <option value="Exact">Exact</option>
                    </select>
                    <Button
                      variant="default"
                      className="flex items-center gap-2 bg-[#faad39ff] hover:bg-[#F17625] text-[#404042ff] font-bold px-6 py-2 rounded-lg shadow-none"
                      onClick={handleAddKeyword}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "adext" && (
              <div className="bg-white border border-[#FAAE3A]/30 rounded-b-xl p-8 mt-0">
                <div className="mb-6 text-[#FAAE3A] font-bold text-lg">Ad Group Custom Parameters</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-2 rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-[#404042] bg-[#FFF3D1]">Name</th>
                        <th className="text-left px-4 py-2 font-semibold text-[#404042] bg-[#FFF3D1]">Value</th>
                        <th className="px-4 py-2 bg-[#FFF3D1]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {customParams.length === 0 ? (
                        <tr><td colSpan={3} className="bg-[#FFF8E1] text-[#404042]/70 px-4 py-4 text-center text-sm">No URL Appends have been added yet</td></tr>
                      ) : (
                        customParams.map((param, idx) => (
                          <tr key={idx} className="hover:bg-[#FFF3D1]">
                            <td className="px-4 py-2">{param.name}</td>
                            <td className="px-4 py-2">{param.value}</td>
                            <td className="px-4 py-2"><input type="checkbox" checked={selectedParams.includes(idx)} onChange={e => handleSelectParam(idx, e.target.checked)} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-[#faad39ff] text-[#404042ff] bg-white hover:bg-[#FFF3D1]"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input value={newParamName} onChange={e => setNewParamName(e.target.value)} className="bg-[#FFF8E1] border-[#FAAE3A]/40 rounded-lg" />
                    <Input value={newParamValue} onChange={e => setNewParamValue(e.target.value)} className="bg-[#FFF8E1] border-[#FAAE3A]/40 rounded-lg" />
                    <Button
                      variant="default"
                      className="flex items-center gap-2 bg-[#faad39ff] hover:bg-[#F17625] text-[#404042ff] font-bold px-6 py-2 rounded-lg shadow-none"
                      onClick={handleAddCustomParam}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
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