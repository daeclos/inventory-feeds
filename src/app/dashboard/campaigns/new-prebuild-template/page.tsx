"use client";
import { useState, useRef, useEffect, useReducer } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Info, ChevronDown, Plus, Upload, Download, Trash } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCampaignTemplateStore } from '@/store/campaignTemplateStore';
import { v4 as uuidv4 } from 'uuid';
import { useAdvertiserStore } from '@/store/advertiserStore';
import { Label } from "@/components/ui/label";

const libraries = ["Default Library"];
const makes = ["Acura", "BMW", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Isuzu", "Lexus"];
const negativeKeywordLists = ["Nothing selected", "Brand Exclusions", "Competitor Exclusions"];

const newVehiclesByYearTemplate = {
  templateName: "Suggested Default Template - New Vehicles by Year",
  advertiser: "",
  includeLocation: true,
  location: "",
  library: "Default Library",
  date: "",
  makeFilter: [],
  yearStart: "2020",
  yearEnd: "2021",
  authorize: true,
  campaignName: "Dynamic New make | year",
  campaignStatus: "Active",
  budget: ",01",
  networks: "Google Search",
  enhancedCpc: "Disabled",
  mobileBidModifier: "0",
  adRotation: "Optimize for clicks",
  negativeKeywords: [],
  adGroupName: "year | make | model",
  adGroupStatus: "Paused",
  finalUrl: "",
  maxCpcBid: "",
  setMaxCpcOnCreate: false,
};

const newVehiclesByYearKeywords = [
  { keyword: ["year", "make", "model"], matchType: "Phrase" },
  { keyword: ["year", "make", "model"], matchType: "Exact" },
  { keyword: ["year", "make", "model"], matchType: "Broad" },
  { keyword: ["year", "model"], matchType: "Broad" },
  { keyword: ["New", "year", "make", "model"], matchType: "Broad" },
];

const adGroupPlaceholders = [
  "advertiser_website",
  "advertiser_dba",
  "advertiser_city",
  "advertiser_state",
  "Make_alt",
  "Model_alt",
  "Trim_alt",
];

interface ResponsiveAd {
  headlines: string[];
  headlinesAlt: string[];
  descriptions: string[];
  descriptionsAlt: string[];
  paths: string[];
  pathsAlt: string[];
}

interface CallOnlyAd {
  businessName: string;
  phoneNumber: string;
  countryCode: string;
  headlines: string[];
  headlinesAlt: string[];
  descriptions: string[];
  descriptionsAlt: string[];
  paths: string[];
  pathsAlt: string[];
  verificationUrl: string;
  callTracking: boolean;
  showFinalUrl: boolean;
  conversionAction: string;
}

interface TemplateFormState {
  templateName: string;
  advertiser: string;
  includeLocation: boolean;
  location: string;
  library: string;
  date: string;
  makeFilter: string[];
  yearStart: string;
  yearEnd: string;
  authorize: boolean;
  campaignName: string;
  campaignStatus: string;
  budget: string;
  networks: string;
  enhancedCpc: string;
  mobileBidModifier: string;
  adRotation: string;
  negativeKeywords: string[];
  adGroupName: string;
  adGroupStatus: string;
  finalUrl: string;
  maxCpcBid: string;
  setMaxCpcOnCreate: boolean;
}

type TemplateFormAction = 
  | { type: 'SET_FIELD'; field: keyof TemplateFormState; value: any }
  | { type: 'SET_MAKE_FILTER'; value: string[] }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_TEMPLATE'; template: Partial<TemplateFormState> };

const initialFormState: TemplateFormState = {
  templateName: "",
  advertiser: "",
  includeLocation: true,
  location: "",
  library: libraries[0],
  date: "",
  makeFilter: [],
  yearStart: "",
  yearEnd: "",
  authorize: true,
  campaignName: "",
  campaignStatus: "Active",
  budget: "0",
  networks: "Google Search",
  enhancedCpc: "Enabled",
  mobileBidModifier: "0",
  adRotation: "Optimize for clicks",
  negativeKeywords: [],
  adGroupName: "",
  adGroupStatus: "Paused",
  finalUrl: "",
  maxCpcBid: "",
  setMaxCpcOnCreate: false,
};

function formReducer(state: TemplateFormState, action: TemplateFormAction): TemplateFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_MAKE_FILTER':
      return {
        ...state,
        makeFilter: action.value
      };
    case 'RESET_FORM':
      return initialFormState;
    case 'LOAD_TEMPLATE':
      return {
        ...initialFormState,
        ...action.template
      };
    default:
      return state;
  }
}

function KeywordTags({ keyword, index, updateKeyword }: { 
  keyword: string[], 
  index: number,
  updateKeyword: (index: number, newKeywords: string[]) => void 
}) {
  const removeWord = (wordIndex: number) => {
    const newKeywords = keyword.filter((_, i) => i !== wordIndex);
    updateKeyword(index, newKeywords);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keyword.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1"
        >
          {word}
          <button
            type="button"
            className="ml-1 text-[#F17625] hover:text-[#FAAE3A]"
            onClick={() => removeWord(wordIndex)}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

function AdGroupNameTags({ 
  value, 
  onChange,
  inputRef,
  onKeyDown,
  setShowDropdown
}: { 
  value: string, 
  onChange: (value: string) => void,
  inputRef: React.RefObject<HTMLInputElement | null>,
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  setShowDropdown: (show: boolean) => void
}) {
  const tags = value.split(' ').filter(Boolean);
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags.join(' '));
  };

  return (
    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-[#FFF8E1] border border-[#faad39ff] rounded-lg">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            className="ml-1 text-[#F17625] hover:text-[#FAAE3A]"
            onClick={() => removeTag(tag)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-[#404042] placeholder-gray-400"
        placeholder="Type or select placeholders..."
        onKeyDown={onKeyDown}
        onFocus={() => setShowDropdown(true)}
      />
    </div>
  );
}

export default function NewPrebuildTemplatePage() {
  const [form, dispatch] = useReducer(formReducer, initialFormState);
  const [tabSwitches, setTabSwitches] = useState<Record<string, boolean>>({
    campaign: true,
    adgroup: true,
    ads: false,
    keywords: false,
    adext: false,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [activeTab, setActiveTab] = useState("campaign");
  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [showAdGroupPlaceholderDropdown, setShowAdGroupPlaceholderDropdown] = useState(false);
  const [adGroupPlaceholderDropdownPos, setAdGroupPlaceholderDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const adGroupInputRef = useRef<HTMLInputElement | null>(null);
  const [showFinalUrlDropdown, setShowFinalUrlDropdown] = useState(false);
  const [finalUrlDropdownPos, setFinalUrlDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const finalUrlInputRef = useRef<HTMLInputElement | null>(null);
  const [responsiveAds, setResponsiveAds] = useState<ResponsiveAd[]>([]);
  const [showResponsiveAlt, setShowResponsiveAlt] = useState(false);
  const [callOnlyAds, setCallOnlyAds] = useState<CallOnlyAd[]>([]);
  const [showCallOnlyAlt, setShowCallOnlyAlt] = useState(false);
  const [showAdTypeDropdown, setShowAdTypeDropdown] = useState(false);
  const adTypeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [adTypeDropdownPos, setAdTypeDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const [adsPanels, setAdsPanels] = useState({ responsive: false, callonly: false });
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [newMatchType, setNewMatchType] = useState("Broad");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const addTemplate = useCampaignTemplateStore(state => state.addTemplate);
  const advertisers = useAdvertiserStore(state => state.advertisers);

  const handleTabSwitch = (tab: string, value: boolean) => {
    setTabSwitches((prev) => ({ ...prev, [tab]: value }));
    if (!value && activeTab === tab) {
      const nextActive = Object.keys(tabSwitches).find((t) => t !== tab && tabSwitches[t]);
      if (nextActive) setActiveTab(nextActive);
    }
  };

  function handleAdGroupNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "[") {
      const input = adGroupInputRef.current;
      if (input) {
        const rect = input.getBoundingClientRect();
        setAdGroupPlaceholderDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setShowAdGroupPlaceholderDropdown(true);
    }
  }

  function handleSelectAdGroupPlaceholder(placeholder: string) {
    const input = adGroupInputRef.current;
    if (!input) return;
    
    // Instead of inserting at cursor position, we'll add it as a tag
    const newTags = [...(form.adGroupName ? form.adGroupName.split(' ') : []), placeholder];
    dispatch({ type: 'SET_FIELD', field: 'adGroupName', value: newTags.join(' ') });
    setShowAdGroupPlaceholderDropdown(false);
  }

  function handleFinalUrlKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "[") {
      const input = finalUrlInputRef.current;
      if (input) {
        const rect = input.getBoundingClientRect();
        setFinalUrlDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setShowFinalUrlDropdown(true);
    }
  }

  function handleSelectFinalUrlPlaceholder(placeholder: string) {
    const input = finalUrlInputRef.current;
    if (!input) return;
    const start = form.finalUrl ? input.selectionStart || 0 : 0;
    const end = form.finalUrl ? input.selectionEnd || 0 : 0;
    const before = form.finalUrl.slice(0, start);
    const after = form.finalUrl.slice(end);
    const insert = `[${placeholder}]`;
    dispatch({ type: 'SET_FIELD', field: 'finalUrl', value: before + insert + after });
    setShowFinalUrlDropdown(false);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(before.length + insert.length, before.length + insert.length);
    }, 0);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showAdGroupPlaceholderDropdown && adGroupInputRef.current && !adGroupInputRef.current.contains(e.target as Node)) {
        setShowAdGroupPlaceholderDropdown(false);
      }
      if (showFinalUrlDropdown && finalUrlInputRef.current && !finalUrlInputRef.current.contains(e.target as Node)) {
        setShowFinalUrlDropdown(false);
      }
    }
    if (showAdGroupPlaceholderDropdown || showFinalUrlDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAdGroupPlaceholderDropdown, showFinalUrlDropdown]);

  function handleAddResponsiveAd() {
    setResponsiveAds([
      ...responsiveAds,
      {
        headlines: ["", "", ""],
        headlinesAlt: ["", "", ""],
        descriptions: ["", ""],
        descriptionsAlt: ["", ""],
        paths: ["", ""],
        pathsAlt: ["", ""],
      },
    ]);
    setShowAdTypeDropdown(false);
  }

  function handleRemoveResponsiveAd(idx: number) {
    setResponsiveAds(responsiveAds.filter((_, i) => i !== idx));
  }

  function handleResponsiveArrayFieldChange(idx: number, field: keyof ResponsiveAd, arrIdx: number, value: string) {
    setResponsiveAds(responsiveAds.map((ad, i) =>
      i === idx ? { ...ad, [field]: ad[field].map((v, j) => j === arrIdx ? value : v) } : ad
    ));
  }

  function handleAddArrayField(idx: number, field: keyof ResponsiveAd, max: number) {
    setResponsiveAds(responsiveAds.map((ad, i) =>
      i === idx && ad[field].length < max ? { ...ad, [field]: [...ad[field], ""] } : ad
    ));
  }

  function handleRemoveArrayField(idx: number, field: keyof ResponsiveAd, min: number) {
    setResponsiveAds(responsiveAds.map((ad, i) =>
      i === idx && ad[field].length > min ? { ...ad, [field]: ad[field].slice(0, -1) } : ad
    ));
  }

  function handleAddCallOnlyAd() {
    setCallOnlyAds([
      ...callOnlyAds,
      {
        businessName: "",
        phoneNumber: "",
        countryCode: "USA - US",
        headlines: ["", ""],
        headlinesAlt: ["", ""],
        descriptions: ["", ""],
        descriptionsAlt: ["", ""],
        paths: ["", ""],
        pathsAlt: ["", ""],
        verificationUrl: "",
        callTracking: false,
        showFinalUrl: false,
        conversionAction: ""
      }
    ]);
    setShowAdTypeDropdown(false);
  }

  function handleRemoveCallOnlyAd(idx: number) {
    setCallOnlyAds(callOnlyAds.filter((_, i) => i !== idx));
  }

  function handleCallOnlyFieldChange(idx: number, field: keyof CallOnlyAd, value: any) {
    setCallOnlyAds(callOnlyAds.map((ad, i) => i === idx ? { ...ad, [field]: value } : ad));
  }

  function handleCallOnlyArrayFieldChange(idx: number, field: keyof CallOnlyAd, arrIdx: number, value: string) {
    setCallOnlyAds(callOnlyAds.map((ad, i) => {
      if (i !== idx) return ad;
      if (Array.isArray(ad[field])) {
        const arr = ad[field] as string[];
        return { ...ad, [field]: arr.map((v, j) => j === arrIdx ? value : v) };
      }
      return ad;
    }));
  }

  function handleAddCallOnlyArrayField(idx: number, field: keyof CallOnlyAd, max: number) {
    setCallOnlyAds(callOnlyAds.map((ad, i) => {
      if (i !== idx) return ad;
      if (Array.isArray(ad[field])) {
        const arr = ad[field] as string[];
        if (arr.length < max) {
          return { ...ad, [field]: [...arr, ""] };
        }
      }
      return ad;
    }));
  }

  function handleRemoveCallOnlyArrayField(idx: number, field: keyof CallOnlyAd, min: number) {
    setCallOnlyAds(callOnlyAds.map((ad, i) => {
      if (i !== idx) return ad;
      if (Array.isArray(ad[field])) {
        const arr = ad[field] as string[];
        if (arr.length > min) {
          return { ...ad, [field]: arr.slice(0, -1) };
        }
      }
      return ad;
    }));
  }

  function handleAddKeyword() {
    if (!newKeyword.trim()) return;
    const words = newKeyword.trim().split(/\s+/);
    setKeywords([...keywords, { keyword: words, matchType: newMatchType }]);
    setNewKeyword("");
    setNewMatchType("Broad");
  }

  function handleSelectKeyword(idx: number, checked: boolean) {
    if (checked) setSelectedKeywords([...selectedKeywords, idx]);
    else setSelectedKeywords(selectedKeywords.filter(i => i !== idx));
  }

  function handleDeleteKeywords() {
    setKeywords(keywords.filter((_, idx) => !selectedKeywords.includes(idx)));
    setSelectedKeywords([]);
  }

  function handleUploadKeywords(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const newKws = lines.map(line => {
        const [keyword, matchType] = line.split(",");
        return { keyword: keyword ? keyword.split(/\s+/) : [], matchType: matchType || "Broad" };
      });
      setKeywords(prev => [...prev, ...newKws]);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDownloadKeywords() {
    const csv = keywords.map(kw => `${kw.keyword.join(" ")},${kw.matchType}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keywords.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleSave = () => {
    const newTemplate = {
      id: uuidv4(),
      ...form,
      responsiveAds,
      callOnlyAds,
      keywords,
      createdAt: new Date().toISOString(),
      account: '',
      googleCustomer: '',
      maxCPC: '',
      filter: '',
      hasAlert: false,
    };
    addTemplate(newTemplate);
    router.push('/dashboard/campaigns');
  };

  const handleFormChange = (field: keyof TemplateFormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleMakeFilterChange = (value: string[]) => {
    dispatch({ type: 'SET_MAKE_FILTER', value });
  };

  const handleLoadTemplate = (template: Partial<TemplateFormState>) => {
    dispatch({ type: 'LOAD_TEMPLATE', template });
  };

  const updateKeyword = (index: number, newKeywords: string[]) => {
    setKeywords(keywords.map((kw, i) => 
      i === index ? { ...kw, keyword: newKeywords } : kw
    ));
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={() => {}} />
        <main className="max-w-5xl mx-auto px-4 py-8 w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: '#404042' }}>Prebuild Template - New</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#FAAE3A] text-[#404042] font-medium flex items-center gap-2 px-4 py-2 shadow-sm">
                  Use Template <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  handleLoadTemplate(newVehiclesByYearTemplate);
                  setKeywords(newVehiclesByYearKeywords);
                }}>
                  New Vehicles by Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  handleLoadTemplate({
                    templateName: "Suggested Default Template - Used Make Model",
                    campaignName: "Dynamic Used Vehicles - Make/Model",
                    adGroupName: "make model"
                  });
                  setKeywords([
                    { keyword: ["used", "make", "model"], matchType: "Phrase" },
                    { keyword: ["used", "make", "model"], matchType: "Exact" },
                    { keyword: ["used", "make", "model"], matchType: "Broad" },
                    { keyword: ["preowned", "make", "model"], matchType: "Broad" },
                    { keyword: ["make", "model", "for", "sale"], matchType: "Broad" },
                  ]);
                }}>
                  Used Make Model
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  handleLoadTemplate({
                    templateName: "Suggested Default Template - Used Year Make Model",
                    campaignName: "Dynamic Used Vehicles - Year/Make/Model",
                    adGroupName: "year make model"
                  });
                  setKeywords([
                    { keyword: ["used", "year", "make", "model"], matchType: "Phrase" },
                    { keyword: ["used", "year", "make", "model"], matchType: "Exact" },
                    { keyword: ["used", "year", "make", "model"], matchType: "Broad" },
                    { keyword: ["preowned", "year", "make", "model"], matchType: "Broad" },
                    { keyword: ["year", "make", "model", "for", "sale"], matchType: "Broad" },
                  ]);
                }}>
                  Used Year Make Model
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#404042' }}>Template Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-[#404042]">Template Name</label>
                <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.templateName} onChange={e => handleFormChange('templateName', e.target.value)} />
                <label className="font-semibold text-[#404042]">Advertiser</label>
                <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.advertiser} onChange={e => handleFormChange('advertiser', e.target.value)}>
                  <option value="">Select advertiser</option>
                  {advertisers.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
                <label className="font-semibold text-[#404042]">Location</label>
                <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.location} onChange={e => handleFormChange('location', e.target.value)} />
                <label className="font-semibold text-[#404042]">Library</label>
                <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.library} onChange={e => handleFormChange('library', e.target.value)}>
                  {libraries.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-[#404042]">Use Only Products Added Since...</label>
                <input type="date" className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.date} onChange={e => handleFormChange('date', e.target.value)} />
                <label className="font-semibold text-[#404042]">Make Filter</label>
                <DropdownMenu open={makeDropdownOpen} onOpenChange={setMakeDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="w-full min-w-0 border border-gray-300 rounded px-3 py-2 text-left bg-white flex flex-wrap gap-1 min-h-[40px] items-center relative">
                      {form.makeFilter.length === 0 ? (
                        <span className="text-gray-400">Nothing selected</span>
                      ) : (
                        form.makeFilter.map((make) => (
                          <span key={make} className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                            {make}
                            <button type="button" className="ml-1 text-[#F17625] hover:text-[#FAAE3A]" onClick={e => { e.stopPropagation(); handleMakeFilterChange(form.makeFilter.filter(m => m !== make)); }}>×</button>
                          </span>
                        ))
                      )}
                      <ChevronDown className={`ml-auto transition-transform ${makeDropdownOpen ? 'rotate-180' : ''}`} size={18} style={{ color: '#404042' }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-60 overflow-y-auto w-64 bg-white border border-[#FAAE3A]">
                    {makes.map((make) => (
                      <DropdownMenuCheckboxItem
                        key={make}
                        checked={form.makeFilter.includes(make)}
                        onCheckedChange={(checked) => {
                          handleMakeFilterChange(checked ? [...form.makeFilter, make] : form.makeFilter.filter(m => m !== make));
                        }}
                        className="data-[state=checked]:bg-[#FAAE3A] data-[state=checked]:text-[#404042] hover:bg-[#FFF3D1] text-[#404042]"
                      >
                        {make}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <label className="font-semibold text-[#404042]">Year Range</label>
                <div className="flex gap-2">
                  <input className="w-1/2 min-w-0 border border-gray-300 rounded px-3 py-2" placeholder="Year Start" value={form.yearStart} onChange={e => handleFormChange('yearStart', e.target.value)} />
                  <input className="w-1/2 min-w-0 border border-gray-300 rounded px-3 py-2" placeholder="End Year" value={form.yearEnd} onChange={e => handleFormChange('yearEnd', e.target.value)} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={form.authorize} onChange={e => handleFormChange('authorize', e.target.checked)} />
                  <span className="text-[#404042] text-sm">I authorize Hoot support to revise Final URLs in ads within "Eligible Campaigns" in the event where clearly incorrect URLs are misspending the campaign budget
                    <span className="inline-block align-middle ml-1 relative">
                      <Info size={16} className="text-[#2A6BE9] cursor-pointer" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} />
                      {showTooltip && (
                        <span className="absolute left-6 top-0 bg-[#404042] text-white text-xs rounded px-3 py-2 z-50 w-96 shadow-lg">
                          Example: An incorrect URL like advertiserdomain.com/vehicles/?makkkke=Honda is clearly a mistake intended to be: advertiserdomain.com/vehicles/?make=Honda. In this clear situation, Hoot support will update the URLs on behalf of the user.
                        </span>
                      )}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.advertiser ? (advertisers.find(a => a.name === form.advertiser)?.status ?? false) : false}
                    onCheckedChange={checked => {
                      if (!form.advertiser) return;
                      const adv = advertisers.find(a => a.name === form.advertiser);
                      if (adv && adv.id) {
                        useAdvertiserStore.getState().updateAdvertiserStatus(adv.id, checked);
                      }
                    }}
                  />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-8">
            <div className="flex gap-0 border-b border-[#faad39ff] bg-[#FFF8E1] rounded-t-xl overflow-x-auto mb-6">
              {[
                { key: "campaign", label: "Campaign Naming" },
                { key: "adgroup", label: "Ad Group Naming" },
                { key: "ads", label: "Ads" },
                { key: "keywords", label: "Keywords" },
                { key: "adext", label: "Ad Extensions" },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={clsx(
                    "px-6 py-3 font-semibold text-sm transition-all focus:outline-none",
                    activeTab === tab.key
                      ? "bg-[#FFF8E1] text-[#404042] border-b-4 border-[#faad39ff] rounded-t-xl"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Campaign Name</label>
                  <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.campaignName} onChange={e => handleFormChange('campaignName', e.target.value)} />
                  <label className="font-semibold text-[#404042]">Campaign Status</label>
                  <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.campaignStatus} onChange={e => handleFormChange('campaignStatus', e.target.value)}>
                    <option>Active</option>
                    <option>Paused</option>
                  </select>
                  <label className="font-semibold text-[#404042]">Budget</label>
                  <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.budget} onChange={e => handleFormChange('budget', e.target.value)} />
                  <label className="font-semibold text-[#404042]">Networks</label>
                  <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.networks} onChange={e => handleFormChange('networks', e.target.value)} />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Enhanced CPC</label>
                  <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.enhancedCpc} onChange={e => handleFormChange('enhancedCpc', e.target.value)}>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                  <label className="font-semibold text-[#404042]">Mobile Bid Modifier</label>
                  <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.mobileBidModifier} onChange={e => handleFormChange('mobileBidModifier', e.target.value)} />
                  <label className="font-semibold text-[#404042]">Ad Rotation</label>
                  <input className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.adRotation} onChange={e => handleFormChange('adRotation', e.target.value)} />
                  <label className="font-semibold text-[#404042]">Negative Keywords Lists Selection</label>
                  <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={form.negativeKeywords[0] || ""} onChange={e => handleFormChange('negativeKeywords', [e.target.value])}>
                    {negativeKeywordLists.map(nk => <option key={nk}>{nk}</option>)}
                  </select>
                </div>
              </div>
            )}
            {activeTab === "adgroup" && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-[#404042]">Ad Group Name</Label>
                      <button type="button" className="flex items-center gap-1 text-[#404042] hover:text-[#faad39ff]">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <AdGroupNameTags
                        value={form.adGroupName}
                        onChange={(value) => handleFormChange('adGroupName', value)}
                        inputRef={adGroupInputRef}
                        onKeyDown={handleAdGroupNameKeyDown}
                        setShowDropdown={setShowAdGroupPlaceholderDropdown}
                      />
                      {showAdGroupPlaceholderDropdown && (
                        <div
                          className="absolute left-0 mt-1 w-full bg-white border border-[#faad39ff] rounded-lg shadow-lg z-50"
                        >
                          {adGroupPlaceholders.map(ph => (
                            <div
                              key={ph}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-[#404042]"
                              onMouseDown={e => { e.preventDefault(); handleSelectAdGroupPlaceholder(ph); }}
                            >
                              {ph}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="font-semibold text-[#404042]">Ad Group Status</Label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#faad39ff] text-[#404042]"
                      value={form.adGroupStatus}
                      onChange={e => handleFormChange('adGroupStatus', e.target.value)}
                    >
                      <option>Paused</option>
                      <option>Active</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-[#404042]">Final URL</Label>
                      <button type="button" className="flex items-center gap-1 text-[#404042] hover:text-[#faad39ff]">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#faad39ff] text-[#404042]"
                        value={form.finalUrl}
                        onChange={e => handleFormChange('finalUrl', e.target.value)}
                        onKeyDown={handleFinalUrlKeyDown}
                        ref={finalUrlInputRef}
                        placeholder="Final URL"
                      />
                      {showFinalUrlDropdown && (
                        <div
                          className="absolute left-0 mt-1 w-full bg-white border border-[#faad39ff] rounded-lg shadow-lg z-50"
                        >
                          {adGroupPlaceholders.map(ph => (
                            <div
                              key={ph}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-[#404042]"
                              onMouseDown={e => { e.preventDefault(); handleSelectFinalUrlPlaceholder(ph); }}
                            >
                              {ph}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "ads" && (
              <div className="bg-white border rounded-xl p-6">
                {/* Panel Responsive Search Ads */}
                <div className="mb-4">
                  <div
                    className="border rounded bg-gray-100 px-4 py-3 font-semibold cursor-pointer"
                    style={{ color: '#404042', borderColor: '#faad39ff' }}
                    onClick={() => setAdsPanels(p => ({ ...p, responsive: !p.responsive }))}
                  >
                    Responsive Search Ads
                  </div>
                  {adsPanels.responsive && (
                    <div>
                      {responsiveAds.length === 0 && (
                        <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mt-2 mb-2">
                          There are no Responsive Search Ads added, if you like, you can add one by clicking the plus sign.
                        </div>
                      )}
                      {responsiveAds.map((ad, idx) => (
                        <div className="p-4 border rounded-xl bg-white mb-4" key={idx}>
                          <div className="font-semibold mb-2" style={{ color: '#404042' }}>Responsive Search Ads</div>
                          <div className="mb-4">
                            <div className="font-semibold mb-2">Headlines</div>
                            {ad.headlines.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <Label className="w-32">Headline {i+1}</Label>
                                <input
                                  value={h}
                                  maxLength={30}
                                  onChange={e => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, headlines: a.headlines.map((v, vi) => vi === i ? e.target.value : v) } : a))}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                                />
                                <span className="text-xs text-gray-500">{h.length} / 30 chars</span>
                              </div>
                            ))}
                            <div className="flex gap-2 mb-2">
                              <Button size="icon" variant="default" onClick={() => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, headlines: [...a.headlines, ""], headlinesAlt: [...a.headlinesAlt, ""] } : a))}>+</Button>
                              <Button size="icon" variant="destructive" onClick={() => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, headlines: a.headlines.slice(0, -1), headlinesAlt: a.headlinesAlt.slice(0, -1) } : a))}>-</Button>
                            </div>
                            {showResponsiveAlt && ad.headlinesAlt.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <Label className="w-32">Headline {i+1} Alternate</Label>
                                <input
                                  value={h}
                                  maxLength={30}
                                  onChange={e => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, headlinesAlt: a.headlinesAlt.map((v, vi) => vi === i ? e.target.value : v) } : a))}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                                />
                                <span className="text-xs text-gray-500">{h.length} / 30 chars</span>
                              </div>
                            ))}
                          </div>
                          <div className="mb-4">
                            <div className="font-semibold mb-2">Descriptions</div>
                            {ad.descriptions.map((d, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <Label className="w-32">Description {i+1}</Label>
                                <input
                                  value={d}
                                  maxLength={90}
                                  onChange={e => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, descriptions: a.descriptions.map((v, vi) => vi === i ? e.target.value : v) } : a))}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                                />
                                <span className="text-xs text-gray-500">{d.length} / 90 chars</span>
                              </div>
                            ))}
                            <div className="flex gap-2 mb-2">
                              <Button size="icon" variant="default" onClick={() => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, descriptions: [...a.descriptions, ""], descriptionsAlt: [...a.descriptionsAlt, ""] } : a))}>+</Button>
                              <Button size="icon" variant="destructive" onClick={() => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, descriptions: a.descriptions.slice(0, -1), descriptionsAlt: a.descriptionsAlt.slice(0, -1) } : a))}>-</Button>
                            </div>
                            {showResponsiveAlt && ad.descriptionsAlt.map((d, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <Label className="w-32">Description {i+1} Alternate</Label>
                                <input
                                  value={d}
                                  maxLength={90}
                                  onChange={e => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, descriptionsAlt: a.descriptionsAlt.map((v, vi) => vi === i ? e.target.value : v) } : a))}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                                />
                                <span className="text-xs text-gray-500">{d.length} / 90 chars</span>
                              </div>
                            ))}
                          </div>
                          <div className="mb-4">
                            <div className="font-semibold mb-2">Paths</div>
                            {ad.paths.map((p, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <Label className="w-32">Path {i+1}</Label>
                                <input
                                  value={p}
                                  maxLength={15}
                                  onChange={e => setResponsiveAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, paths: a.paths.map((v, vi) => vi === i ? e.target.value : v) } : a))}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                                />
                                <span className="text-xs text-gray-500">{p.length} / 15 chars</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Button size="icon" variant="default" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setShowResponsiveAlt(v => !v)}>
                              {showResponsiveAlt ? 'Hide alternate fields' : 'Show alternate fields'}
                            </Button>
                            <Button size="icon" variant="destructive" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setResponsiveAds(ads => ads.filter((_, i) => i !== idx))}>Delete Ad</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Panel Call-Only Ads */}
                <div className="mb-4">
                  <div
                    className="border rounded bg-gray-100 px-4 py-3 font-semibold cursor-pointer"
                    style={{ color: '#404042', borderColor: '#faad39ff' }}
                    onClick={() => setAdsPanels(p => ({ ...p, callonly: !p.callonly }))}
                  >
                    Call-Only Ads
                  </div>
                  {adsPanels.callonly && (
                    <div>
                      {callOnlyAds.length === 0 && (
                        <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mt-2 mb-2">
                          There are no Call-Only Ads added, if you like, you can add one by clicking the plus sign.
                        </div>
                      )}
                      {callOnlyAds.map((ad, idx) => (
                        <div className="p-4 border rounded-xl bg-white mb-4" key={idx}>
                          <div className="font-semibold mb-2" style={{ color: '#404042' }}>Call-Only Ads</div>
                          <div className="mb-4">
                            <Label className="w-32">Business name</Label>
                            <input
                              value={ad.businessName}
                              maxLength={25}
                              onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, businessName: e.target.value } : a))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                            />
                          </div>
                          <div className="mb-4">
                            <Label className="w-32">Phone Number</Label>
                            <input
                              value={ad.phoneNumber}
                              maxLength={1024}
                              onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, phoneNumber: e.target.value } : a))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                            />
                          </div>
                          <div className="mb-4">
                            <Label className="w-32">Country Code</Label>
                            <input
                              value={ad.countryCode}
                              onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, countryCode: e.target.value } : a))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#404042]"
                            />
                          </div>
                          <div className="mb-4">
                            <Label className="w-32">Description 1</Label>
                            <input
                              value={ad.descriptions[0]}
                              maxLength={90}
                              onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, descriptions: [e.target.value, ...a.descriptions.slice(1)] } : a))}
                              className="w-full"
                            />
                          </div>
                          <div className="mb-4">
                            <Label className="w-32">Verification URL</Label>
                            <input
                              value={ad.verificationUrl}
                              maxLength={1024}
                              onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, verificationUrl: e.target.value } : a))}
                              className="w-full"
                            />
                          </div>
                          <div className="mb-4 flex gap-4">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={ad.callTracking} onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, callTracking: e.target.checked } : a))} />
                              <Label>Call Tracking</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={ad.showFinalUrl} onChange={e => setCallOnlyAds(ads => ads.map((a, aidx) => aidx === idx ? { ...a, showFinalUrl: e.target.checked } : a))} />
                              <Label>Show Final URL Link</Label>
                            </div>
                          </div>
                          <div className="mb-4">
                            <Label className="w-32">Conversion Action</Label>
                            <span className="text-[#3b82f6] ml-2">Checking Conversions</span>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Button size="icon" variant="default" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setShowCallOnlyAlt(v => !v)}>
                              {showCallOnlyAlt ? 'Hide optional/alternate fields' : 'Show optional/alternate fields'}
                            </Button>
                            <Button size="icon" variant="destructive" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setCallOnlyAds(ads => ads.filter((_, i) => i !== idx))}>Delete Ad</Button>
                          </div>
                          {showCallOnlyAlt && (
                            <div className="mt-4">
                              <div className="font-semibold mb-2" style={{ color: '#404042' }}>Alternate Fields</div>
                              {/* Aquí puedes agregar los campos alternativos igual que en Responsive si lo deseas */}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Botón + y menú de tipo de ad */}
                <div className="relative">
                  <Button size="icon" variant="default" className="!rounded !w-10 !h-10" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setShowAdTypeDropdown(v => !v)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                  {showAdTypeDropdown && (
                    <div className="absolute left-0 mt-2 bg-white border rounded shadow z-10 min-w-[180px]">
                      <div className="px-4 py-2 font-semibold text-[#404042] border-b">Ad Types</div>
                      <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8E1] hover:text-[#faad39ff]" style={{ color: '#404042' }} onClick={handleAddResponsiveAd}>Responsive Search Ad</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8E1] hover:text-[#faad39ff]" style={{ color: '#404042' }} onClick={handleAddCallOnlyAd}>Call-Only Ad</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "keywords" && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-[#404042] text-lg">Keywords</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#faad39ff' }}
                        title="Download CSV template"
                        onClick={handleDownloadKeywords}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#404042ff' }}
                        title="Update keywords from file"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-5 h-5" />
                        <input type="file" accept=".csv,.txt" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadKeywords} />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#f77272ff' }}
                        title="Delete selected keywords"
                        onClick={handleDeleteKeywords}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex font-semibold text-[#404042] mb-1 gap-2 items-center">
                    <div className="w-full">Keyword</div>
                    <div className="w-full">Match Type</div>
                    {/* Checkbox de seleccionar todos (opcional) */}
                  </div>
                  <hr className="mb-2" />
                  {keywords.length === 0 && (
                    <div className="bg-[#fff4ce] border border-[#ffe7a0] text-[#404042] px-4 py-3 rounded mb-2 text-center">
                      No keywords have been added yet
                    </div>
                  )}
                  {keywords.map((kw, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={kw.keyword.join(' ')}
                        onChange={e => setKeywords(ks => ks.map((k, i) => i === idx ? { ...k, keyword: e.target.value.split(' ') } : k))}
                      />
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={kw.matchType}
                        onChange={e => setKeywords(ks => ks.map((k, i) => i === idx ? { ...k, matchType: e.target.value } : k))}
                      >
                        <option value="Broad">Broad</option>
                        <option value="Phrase">Phrase</option>
                        <option value="Exact">Exact</option>
                      </select>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#f77272ff] ml-2"
                        checked={selectedKeywords.includes(idx)}
                        onChange={e => handleSelectKeyword(idx, e.target.checked)}
                      />
                    </div>
                  ))}
                  {/* Fila para agregar nueva keyword */}
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      placeholder="Add keyword..."
                      onKeyDown={e => { if (e.key === 'Enter') handleAddKeyword(); }}
                    />
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={newMatchType}
                      onChange={e => setNewMatchType(e.target.value)}
                    >
                      <option value="Broad">Broad</option>
                      <option value="Phrase">Phrase</option>
                      <option value="Exact">Exact</option>
                    </select>
                    <Button
                      type="button"
                      className="p-2 rounded w-full mt-1"
                      style={{ background: '#404042ff', color: '#fff' }}
                      onClick={handleAddKeyword}
                    >
                      <Plus className="w-5 h-5" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "adext" && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Call Ext</span>
                  </div>
                  <input className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Phone" />
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Site Links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2" placeholder="Text" />
                    <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2" placeholder="Link" />
                    <Button 
                      className="!px-2 !py-2 !h-auto" 
                      style={{ background: '#faad39ff', color: '#404042' }}
                      variant="secondary"
                    >
                      +
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Call Outs</span>
                  </div>
                  <input className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Text" />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end mt-8">
            <Button
              variant="destructive"
              type="button"
              className="bg-[#D84040] hover:bg-[#E17564]/90"
              onClick={() => router.push('/dashboard/campaigns')}
            >
              Cancel
            </Button>
            <Button variant="secondary" type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
} 