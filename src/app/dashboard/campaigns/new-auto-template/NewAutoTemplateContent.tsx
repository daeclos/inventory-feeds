"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search, ChevronDown, Upload, Download, Trash, Plus, HelpCircle, RefreshCcw } from "lucide-react";
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
import { useAdvertiserStore } from '@/store/advertiserStore';
import { useCampaignTemplateStore } from '@/store/campaignTemplateStore';
import { v4 as uuidv4 } from 'uuid';

// Definiciones faltantes
const googleAdsCustomers = [
  { id: 1, name: "550-054-4980" },
  { id: 2, name: "170-908-1293" },
];

const campaigns = [
  { id: 1, name: "FFG VDP Search - Used" },
  { id: 2, name: "FFG Dynamic VDP - All Other New (Ford)" },
];

type MultiSelectOption = { id: string | number; name: string };

function MultiSelect({ options, value, onChange }: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <select
      multiple
      className="w-full border rounded h-10 px-2"
      value={value}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selected);
      }}
    >
      {options.map(option => (
        <option key={option.id} value={option.id.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

const tabList = [
  { key: "campaign_settings", label: "Campaign settings" },
  { key: "ad_group_naming", label: "Ad group naming" },
  { key: "ads", label: "Ads" },
  { key: "keywords", label: "Keywords" },
  { key: "ad_group_custom_parameters", label: "Ad group custom parameters" },
];

type NegativeKeywordsDropdownProps = {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

function NegativeKeywordsDropdown({ options, value, onChange, onSelectAll, onDeselectAll }: NegativeKeywordsDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v: string) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const display = value.length === 0 ? "Nothing selected" : value.join(", ");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border rounded h-10 px-2 text-left bg-gray-100"
        onClick={() => setOpen(o => !o)}
      >
        {display}
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-10">
          <div className="max-h-48 overflow-y-auto">
            {options.map(option => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${value.includes(option) ? 'bg-[#FFF8E1] text-[#FAAE3A]' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <input type="checkbox" checked={value.includes(option)} readOnly className="mr-2" />
                {option}
              </div>
            ))}
          </div>
          <div className="flex border-t px-2 py-2 gap-2 justify-between">
            <button type="button" className="text-sm text-[#FAAE3A] font-medium hover:underline" onClick={onSelectAll}>Select All</button>
            <button type="button" className="text-sm text-[#FAAE3A] font-medium hover:underline" onClick={onDeselectAll}>Deselect All</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdvertiserMultiSelect({ options, value, onChange }: { options: MultiSelectOption[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() =>
    options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  const display = value.length === 0
    ? "Select Advertiser"
    : options.filter(opt => value.includes(opt.id.toString())).map(opt => opt.name).join(", ");

  const handleOptionClick = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border rounded h-10 px-2 text-left bg-gray-100"
        onClick={() => setOpen(o => !o)}
      >
        {display}
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-10">
          <input
            className="w-full border-b px-2 py-1 outline-none"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400">No results</div>
            )}
            {filteredOptions.map(option => (
              <div
                key={option.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${value.includes(option.id.toString()) ? 'bg-[#FFF8E1] text-[#FAAE3A]' : ''}`}
                onClick={() => handleOptionClick(option.id.toString())}
              >
                <input type="checkbox" checked={value.includes(option.id.toString())} readOnly className="mr-2" />
                {option.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NegativeKeywordListsMultiSelect({ options, value, onChange }: { options: MultiSelectOption[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() =>
    options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  const display = value.length === 0
    ? "Nothing selected"
    : options.filter(opt => value.includes(opt.id.toString())).map(opt => opt.name).join(", ");

  const handleOptionClick = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map(opt => opt.id.toString()));
  };
  const handleDeselectAll = () => {
    onChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border rounded h-10 px-2 text-left bg-gray-100"
        onClick={() => setOpen(o => !o)}
      >
        {display}
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-10">
          <input
            className="w-full border-b px-2 py-1 outline-none"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400">No results</div>
            )}
            {filteredOptions.map(option => (
              <div
                key={option.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${value.includes(option.id.toString()) ? 'bg-[#FFF8E1] text-[#FAAE3A]' : ''}`}
                onClick={() => handleOptionClick(option.id.toString())}
              >
                <input type="checkbox" checked={value.includes(option.id.toString())} readOnly className="mr-2" />
                {option.name}
              </div>
            ))}
          </div>
          <div className="flex border-t px-2 py-2 gap-2 justify-between">
            <button type="button" className="text-sm text-[#FAAE3A] font-medium hover:underline" onClick={handleSelectAll}>Select All</button>
            <button type="button" className="text-sm text-[#FAAE3A] font-medium hover:underline" onClick={handleDeselectAll}>Deselect All</button>
          </div>
        </div>
      )}
    </div>
  );
}

const adGroupPlaceholders = [
  { group: 'From Advertiser Settings', values: [
    'advertiser_website', 'advertiser_dba', 'advertiser_city', 'advertiser_state'
  ]},
  { group: 'From Product Alias', values: [
    'Make_alt', 'Model_alt', 'Trim_alt'
  ]}
];

export function NewAutoTemplateContent() {
  const router = useRouter();
  const templates = useCampaignTemplateStore(state => state.templates);
  const addTemplate = useCampaignTemplateStore(state => state.addTemplate);
  const advertisers = useAdvertiserStore(state => state.advertisers);
  const [templateName, setTemplateName] = useState('');
  const [advertisersSelected, setAdvertisersSelected] = useState<string[]>([]);
  const [googleCustomer, setGoogleCustomer] = useState('');
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(false);
  const [active, setActive] = useState(false);
  const [useCustomSource, setUseCustomSource] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState(tabList[0].key);
  const [campaignSelected, setCampaignSelected] = useState('');
  const [negativeKeywordListsSelected, setNegativeKeywordListsSelected] = useState<string[]>([]);
  const { lists: negativeKeywordLists } = useNegativeKeywordStore();
  const [adGroupName, setAdGroupName] = useState<string[]>([]);
  const [adGroupInput, setAdGroupInput] = useState('');
  const [showPlaceholderDropdown, setShowPlaceholderDropdown] = useState(false);
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(false);
  const [maxCpcBid, setMaxCpcBid] = useState('');
  const [setMaxCpcOnCreate, setSetMaxCpcOnCreate] = useState(false);
  const [finalUrl, setFinalUrl] = useState('');
  const [adsPanel, setAdsPanel] = useState<'responsive' | 'callonly' | null>(null);
  const [showAddAdMenu, setShowAddAdMenu] = useState(false);
  const [responsiveAds, setResponsiveAds] = useState<any[]>([]);
  const [callOnlyAds, setCallOnlyAds] = useState<any[]>([]);
  const [showResponsiveAlt, setShowResponsiveAlt] = useState(false);
  const [showCallOnlyAlt, setShowCallOnlyAlt] = useState(false);
  // Estado para Keywords avanzado
  const [keywords, setKeywords] = useState<{ keyword: string; matchType: 'Broad' | 'Phrase' | 'Exact'; selected: boolean }[]>([]);
  const [newKeyword, setNewKeyword] = useState<{ keyword: string; matchType: 'Broad' | 'Phrase' | 'Exact' }>({ keyword: '', matchType: 'Broad' });
  const [selectAllKeywords, setSelectAllKeywords] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // 1. Estado para parámetros custom
  const [customParams, setCustomParams] = useState<{ name: string; value: string; selected: boolean }[]>([]);
  const [newParam, setNewParam] = useState({ name: '', value: '' });
  const [selectAllParams, setSelectAllParams] = useState(false);
  const [showParamHelp, setShowParamHelp] = useState(false);

  const matchTypeOptions = [
    { value: 'Broad', label: 'Broad' },
    { value: 'Phrase', label: 'Phrase' },
    { value: 'Exact', label: 'Exact' },
  ];

  // Lógica para el mensaje de advertencia
  const showWarning = advertisersSelected.length === 0;

  // Lógica para mostrar dropdown de placeholders
  const handleAdGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAdGroupInput(value);
    if (value.endsWith('[')) {
      setShowPlaceholderDropdown(true);
    } else {
      setShowPlaceholderDropdown(false);
    }
  };
  const handleSelectPlaceholder = (placeholder: string) => {
    setAdGroupName([...adGroupName, `[${placeholder}]`]);
    setAdGroupInput('');
    setShowPlaceholderDropdown(false);
  };
  const handleRemoveTag = (idx: number) => {
    setAdGroupName(adGroupName.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const newTemplate = {
      id: uuidv4(),
      templateName,
      advertiser: advertisersSelected.join(','),
      googleCustomer,
      adGroupName: adGroupName.join(','),
      maxCpcBid,
      setMaxCpcOnCreate,
      finalUrl,
      responsiveAds: [],
      callOnlyAds: [],
      keywords: [],
      campaignName: '',
      campaignStatus: active ? 'Active' : 'Inactive',
      authorize: authorized,
      account: '',
      includeLocation: false,
      location: '',
      library: '',
      negativeKeywords: [],
      excludedKeywords: [],
      excludedUrls: [],
      excludedApps: [],
      excludedCategories: [],
      excludedTopics: [],
      excludedPlacements: [],
      excludedAudiences: [],
      excludedDemographics: [],
      excludedDevices: [],
      excludedLocations: [],
      excludedLanguages: [],
      excludedSchedules: [],
      excludedNetworks: [],
      excludedContent: [],
      date: '',
      makeFilter: [],
      yearStart: '',
      yearEnd: '',
      modelFilter: '',
      trimFilter: '',
      bodyStyleFilter: '',
      transmissionFilter: '',
      fuelTypeFilter: '',
      driveTypeFilter: '',
      colorFilter: '',
      priceRangeFilter: '',
      mileageRangeFilter: '',
      budget: '',
      networks: '',
      enhancedCpc: '',
      mobileBidModifier: '',
      desktopBidModifier: '',
      tabletBidModifier: '',
      startDate: '',
      endDate: '',
      targetingType: '',
      targetingValue: '',
      adRotation: '',
      adGroupStatus: '',
      maxCPC: '',
      filter: '',
      adGroupType: '',
      adGroupBidStrategy: '',
      hasAlert: false,
      createdAt: new Date().toISOString()
    };
    addTemplate(newTemplate);
    router.push('/dashboard/campaigns');
  };

  const handleSaveAndApply = () => {
    handleSave();
    // Aquí iría la lógica adicional para aplicar el template
  };

  // Funciones para Responsive Ads
  const addResponsiveAd = useCallback(() => {
    setResponsiveAds(ads => [...ads, {
      headlines: ["", "", ""],
      headlinesAlt: ["", "", ""],
      descriptions: ["", ""],
      descriptionsAlt: ["", ""],
      paths: ["", ""]
    }]);
    setAdsPanel('responsive');
    setShowAddAdMenu(false);
  }, []);
  const removeResponsiveAd = useCallback((idx: number) => {
    setResponsiveAds(ads => ads.filter((_, i) => i !== idx));
    setAdsPanel(null);
  }, []);
  // Funciones para Call-Only Ads
  const addCallOnlyAd = useCallback(() => {
    setCallOnlyAds(ads => [...ads, {
      businessName: "",
      phoneNumber: "",
      countryCode: "USA - US",
      headlines: ["", ""],
      headlinesAlt: ["", ""],
      descriptions: ["", ""],
      descriptionsAlt: ["", ""],
      paths: ["", ""],
      verificationUrl: "",
      callTracking: false,
      showFinalUrl: false,
      conversionAction: ""
    }]);
    setAdsPanel('callonly');
    setShowAddAdMenu(false);
  }, []);
  const removeCallOnlyAd = useCallback((idx: number) => {
    setCallOnlyAds(ads => ads.filter((_, i) => i !== idx));
    setAdsPanel(null);
  }, []);

  // Handlers para Keywords
  const handleAddKeyword = () => {
    if (!newKeyword.keyword.trim()) return; // Validación básica, puedes mejorarla luego
    setKeywords(ks => [...ks, { ...newKeyword, selected: false }]);
    setNewKeyword({ keyword: '', matchType: 'Broad' });
  };
  const handleDeleteKeywords = () => {
    setShowDeleteModal(true);
  };
  const confirmDeleteKeywords = () => {
    setKeywords([]);
    setShowDeleteModal(false);
    setSelectAllKeywords(false);
  };
  const handleSelectAllKeywords = (checked: boolean) => {
    setSelectAllKeywords(checked);
    setKeywords(ks => ks.map(k => ({ ...k, selected: checked })));
  };
  const handleSelectKeyword = (idx: number, checked: boolean) => {
    setKeywords(ks => ks.map((k, i) => i === idx ? { ...k, selected: checked } : k));
  };
  // Handlers para archivos (stub)
  const handleDownloadTemplate = () => {
    // Lógica para descargar CSV template
  };
  const handleUploadKeywords = () => {
    // Lógica para subir archivo y actualizar keywords
  };

  // 2. Handlers para parámetros custom
  const handleAddParam = () => {
    if (!newParam.name.trim() || !newParam.value.trim()) return;
    setCustomParams(params => [...params, { ...newParam, selected: false }]);
    setNewParam({ name: '', value: '' });
  };
  const handleDeleteParams = () => {
    setCustomParams(params => params.filter(p => !p.selected));
    setSelectAllParams(false);
  };
  const handleSelectAllParams = (checked: boolean) => {
    setSelectAllParams(checked);
    setCustomParams(params => params.map(p => ({ ...p, selected: checked })));
  };
  const handleSelectParam = (idx: number, checked: boolean) => {
    setCustomParams(params => params.map((p, i) => i === idx ? { ...p, selected: checked } : p));
  };

  // Renderiza los formularios de ads
  function renderResponsiveAdForm(ad: any, idx: number) {
    return (
      <div className="p-4 border rounded-xl bg-white mb-4" key={idx}>
        <div className="font-semibold mb-2" style={{ color: '#404042' }}>Responsive Search Ads</div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Headlines</div>
          {ad.headlines.map((h: string, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-2 w-full">
              <Label className="w-32 min-w-[120px]">Headline {i+1}</Label>
              <div className="flex-1 w-full flex items-center gap-2">
                <Input
                  value={h}
                  maxLength={30}
                  onChange={e => {
                    const newAds = [...responsiveAds];
                    newAds[idx].headlines[i] = e.target.value;
                    setResponsiveAds(newAds);
                  }}
                  className="w-full !min-w-0"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{h.length} / 30 chars</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mb-2">
            <Button size="icon" variant="default" onClick={() => {
              const newAds = [...responsiveAds];
              newAds[idx].headlines.push("");
              newAds[idx].headlinesAlt.push("");
              setResponsiveAds(newAds);
            }}>+</Button>
            <Button size="icon" variant="destructive" onClick={() => {
              if (ad.headlines.length > 1) {
                const newAds = [...responsiveAds];
                newAds[idx].headlines.pop();
                newAds[idx].headlinesAlt.pop();
                setResponsiveAds(newAds);
              }
            }}>-</Button>
          </div>
          {showResponsiveAlt && ad.headlinesAlt.map((h: string, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-2 w-full">
              <Label className="w-32 min-w-[120px]">Headline {i+1} Alternate</Label>
              <div className="flex-1 w-full flex items-center gap-2">
                <Input
                  value={h}
                  maxLength={30}
                  onChange={e => {
                    const newAds = [...responsiveAds];
                    newAds[idx].headlinesAlt[i] = e.target.value;
                    setResponsiveAds(newAds);
                  }}
                  className="w-full bg-[#FFF8E1] border border-[#faad39ff]"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{h.length} / 30 chars</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Descriptions</div>
          {ad.descriptions.map((d: string, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-2 w-full">
              <Label className="w-32 min-w-[120px]">Description {i+1}</Label>
              <div className="flex-1 w-full flex items-center gap-2">
                <Input
                  value={d}
                  maxLength={90}
                  onChange={e => {
                    const newAds = [...responsiveAds];
                    newAds[idx].descriptions[i] = e.target.value;
                    setResponsiveAds(newAds);
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{d.length} / 90 chars</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mb-2">
            <Button size="icon" variant="default" onClick={() => {
              const newAds = [...responsiveAds];
              newAds[idx].descriptions.push("");
              newAds[idx].descriptionsAlt.push("");
              setResponsiveAds(newAds);
            }}>+</Button>
            <Button size="icon" variant="destructive" onClick={() => {
              if (ad.descriptions.length > 1) {
                const newAds = [...responsiveAds];
                newAds[idx].descriptions.pop();
                newAds[idx].descriptionsAlt.pop();
                setResponsiveAds(newAds);
              }
            }}>-</Button>
          </div>
          {showResponsiveAlt && ad.descriptionsAlt.map((d: string, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-2 w-full">
              <Label className="w-32 min-w-[120px]">Description {i+1} Alternate</Label>
              <div className="flex-1 w-full flex items-center gap-2">
                <Input
                  value={d}
                  maxLength={90}
                  onChange={e => {
                    const newAds = [...responsiveAds];
                    newAds[idx].descriptionsAlt[i] = e.target.value;
                    setResponsiveAds(newAds);
                  }}
                  className="w-full bg-[#FFF8E1] border border-[#faad39ff]"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{d.length} / 90 chars</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Paths</div>
          {ad.paths.map((p: string, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-2 w-full">
              <Label className="w-32 min-w-[120px]">Path {i+1}</Label>
              <div className="flex-1 w-full flex items-center gap-2">
                <Input
                  value={p}
                  maxLength={15}
                  onChange={e => {
                    const newAds = [...responsiveAds];
                    newAds[idx].paths[i] = e.target.value;
                    setResponsiveAds(newAds);
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{p.length} / 15 chars</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <Button size="icon" variant="default" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setShowResponsiveAlt(v => !v)}>
            {showResponsiveAlt ? 'Hide alternate fields' : 'Show alternate fields'}
          </Button>
          <Button size="icon" variant="destructive" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => removeResponsiveAd(idx)}>Delete Ad</Button>
        </div>
      </div>
    );
  }
  function renderCallOnlyAdForm(ad: any, idx: number) {
    return (
      <div className="p-4 border rounded-xl bg-white mb-4" key={idx}>
        <div className="font-semibold mb-2" style={{ color: '#404042' }}>Call-Only Ads</div>
        <div className="mb-4">
          <Label className="w-32">Business name</Label>
          <div className="flex-1 w-full flex items-center gap-2">
            <Input
              value={ad.businessName}
              maxLength={25}
              onChange={e => {
                const newAds = [...callOnlyAds];
                newAds[idx].businessName = e.target.value;
                setCallOnlyAds(newAds);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="w-32">Phone Number</Label>
          <div className="flex-1 w-full flex items-center gap-2">
            <Input
              value={ad.phoneNumber}
              maxLength={1024}
              onChange={e => {
                const newAds = [...callOnlyAds];
                newAds[idx].phoneNumber = e.target.value;
                setCallOnlyAds(newAds);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="w-32">Country Code</Label>
          <div className="flex-1 w-full flex items-center gap-2">
            <Input
              value={ad.countryCode}
              onChange={e => {
                const newAds = [...callOnlyAds];
                newAds[idx].countryCode = e.target.value;
                setCallOnlyAds(newAds);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="w-32">Description 1</Label>
          <div className="flex-1 w-full flex items-center gap-2">
            <Input
              value={ad.descriptions[0]}
              maxLength={90}
              onChange={e => {
                const newAds = [...callOnlyAds];
                newAds[idx].descriptions[0] = e.target.value;
                setCallOnlyAds(newAds);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="w-32">Verification URL</Label>
          <div className="flex-1 w-full flex items-center gap-2">
            <Input
              value={ad.verificationUrl}
              maxLength={1024}
              onChange={e => {
                const newAds = [...callOnlyAds];
                newAds[idx].verificationUrl = e.target.value;
                setCallOnlyAds(newAds);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={ad.callTracking} onChange={e => {
              const newAds = [...callOnlyAds];
              newAds[idx].callTracking = e.target.checked;
              setCallOnlyAds(newAds);
            }} />
            <Label>Call Tracking</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={ad.showFinalUrl} onChange={e => {
              const newAds = [...callOnlyAds];
              newAds[idx].showFinalUrl = e.target.checked;
              setCallOnlyAds(newAds);
            }} />
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
          <Button size="icon" variant="destructive" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => removeCallOnlyAd(idx)}>Delete Ad</Button>
        </div>
        {showCallOnlyAlt && (
          <div className="mt-4">
            <div className="font-semibold mb-2" style={{ color: '#404042' }}>Alternate Fields</div>
            {/* Aquí puedes agregar los campos alternativos igual que en Responsive si lo deseas */}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-4xl w-[900px] px-4 sm:px-8 py-8 mb-10">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#404042' }}>New Auto-Template</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="advertiser">Advertiser</Label>
              <AdvertiserMultiSelect
                options={advertisers.filter(a => a.id !== undefined).map(a => ({ id: String(a.id), name: a.name }))}
                value={advertisersSelected}
                onChange={setAdvertisersSelected}
              />
            </div>
            <div>
              <Label htmlFor="googleCustomer">Google Ads Customer</Label>
              <select
                id="googleCustomer"
                className="w-full border rounded h-10 px-2"
                value={googleCustomer}
                onChange={(e) => setGoogleCustomer(e.target.value)}
              >
                <option value="">Select Customer</option>
                {/* Aquí puedes mapear los customers reales si los tienes */}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="enableEmailNotifications"
                type="checkbox"
                checked={enableEmailNotifications}
                onChange={e => setEnableEmailNotifications(e.target.checked)}
              />
              <Label htmlFor="enableEmailNotifications">Enable email notifications</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="useCustomSource"
                checked={useCustomSource}
                onCheckedChange={setUseCustomSource}
              />
              <Label htmlFor="useCustomSource">Use custom source for vehicles</Label>
            </div>
            {showWarning && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Web Inventory Filters are not available because the selected Advertiser is not yet configured or no Advertiser is selected.
              </div>
            )}
            <div className="flex items-center gap-4 mt-4">
              <Button type="button" variant="default">
                Preview
              </Button>
              <div className="flex items-center gap-2">
                <input
                  id="authorize"
                  type="checkbox"
                  checked={authorized}
                  onChange={e => setAuthorized(e.target.checked)}
                />
                <Label htmlFor="authorize" className="text-xs">
                  I authorize Hoot support to revise Final URLs in ads within "Eligible Campaigns" in the event where clearly incorrect URLs are misspending the campaign budget
                </Label>
              </div>
            </div>
          </div>
        </div>
        {/* FilterBuilder entre el form y el NavTab */}
        {advertisersSelected.length > 0 && (
          <div className="my-8">
            <FilterBuilder attributes={fbAttributes} />
          </div>
        )}
        {/* Reemplaza el contenedor de NavTab y contenido de tabs por un solo div: */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-0 mb-8">
          <div className="flex gap-0 border-b border-gray-200 rounded-t-xl overflow-x-auto">
            {tabList.map(tab => (
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
          <div className="p-6">
            {/* Aquí va el contenido de cada tab, sin bordes adicionales */}
            {activeTab === 'campaign_settings' && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-8">
                  <div>
                    <Label className="font-semibold mb-2 block" htmlFor="campaignSelect">Campaign Selection</Label>
                    <div className="flex gap-2">
                      <select
                        id="campaignSelect"
                        className="w-full border rounded h-12 px-4 text-base"
                        value={campaignSelected}
                        onChange={e => setCampaignSelected(e.target.value)}
                        disabled={!googleCustomer}
                      >
                        <option value="">Select a Google Ads customer before set the campaign.</option>
                        {campaigns.map(camp => (
                          <option key={camp.id} value={camp.id}>{camp.name}</option>
                        ))}
                      </select>
                      <button type="button" className="p-2 bg-[#e3eefd] rounded hover:bg-[#d0e0fa] h-12 flex items-center" title="Refresh">
                        <RefreshCcw className="w-5 h-5 text-[#3b82f6]" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold mb-2 block" htmlFor="negativeKeywordLists">Negative Keywords Lists Selection</Label>
                    <NegativeKeywordListsMultiSelect
                      options={negativeKeywordLists.map((list, idx) => ({ id: idx, name: list.name }))}
                      value={negativeKeywordListsSelected}
                      onChange={setNegativeKeywordListsSelected}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'ad_group_naming' && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="font-semibold" htmlFor="adGroupName">Ad Group Name</Label>
                      <button type="button" className="flex items-center gap-1 text-[#3b82f6] hover:underline text-sm" onClick={() => setShowPlaceholderModal(true)}>
                        Available Placeholders <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {adGroupName.map((tag, idx) => (
                        <span key={idx} className="bg-[#FAAE3A]/20 text-[#404042] rounded px-2 py-1 text-sm font-semibold flex items-center gap-1">
                          {tag}
                          <button type="button" className="ml-1 text-xs text-gray-500 hover:text-red-500" onClick={() => handleRemoveTag(idx)}>×</button>
                        </span>
                      ))}
                    </div>
                    <input
                      id="adGroupName"
                      className="w-full border rounded h-12 px-4 text-base"
                      value={adGroupInput}
                      onChange={handleAdGroupInputChange}
                      placeholder="Type and use [ to insert a placeholder"
                    />
                    {showPlaceholderDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-10">
                        {adGroupPlaceholders.map(group => (
                          <div key={group.group} className="px-3 py-2">
                            <div className="text-xs font-bold text-gray-500 mb-1">{group.group}</div>
                            {group.values.map(ph => (
                              <div
                                key={ph}
                                className="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                                onClick={() => handleSelectPlaceholder(ph)}
                              >
                                [{ph}]
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="font-semibold mb-2 block" htmlFor="maxCpcBid">Max CPC Bid</Label>
                    <Input
                      id="maxCpcBid"
                      className="w-full border rounded h-12 px-4 text-base bg-gray-100"
                      value={maxCpcBid}
                      onChange={e => setMaxCpcBid(e.target.value)}
                      placeholder="0,01"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="setMaxCpcOnCreate"
                      checked={setMaxCpcOnCreate}
                      onCheckedChange={setSetMaxCpcOnCreate}
                    />
                    <Label htmlFor="setMaxCpcOnCreate">Set Max CPC Bid only on creation</Label>
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="font-semibold" htmlFor="finalUrl">Final URL</Label>
                      <HelpCircle className="w-4 h-4 text-[#3b82f6] cursor-pointer" aria-label="Help" />
                    </div>
                    <Input
                      id="finalUrl"
                      className="w-full border rounded h-12 px-4 text-base"
                      value={finalUrl}
                      onChange={e => setFinalUrl(e.target.value)}
                    />
                  </div>
                </div>
                {/* Modal de placeholders */}
                {showPlaceholderModal && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-[#3b82f6]">Available Placeholders</span>
                        <button className="text-gray-500 hover:text-red-500 text-xl" onClick={() => setShowPlaceholderModal(false)}>×</button>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm font-semibold mb-1">From Advertiser Settings</div>
                        <div className="flex flex-col gap-1 mb-2">
                          {["advertiser_website", "advertiser_dba", "advertiser_city", "advertiser_state"].map(ph => (
                            <span key={ph} className="bg-gray-100 rounded px-2 py-1 text-sm">[{ph}]</span>
                          ))}
                        </div>
                        <div className="text-sm font-semibold mb-1">From Product Alias</div>
                        <div className="flex flex-col gap-1">
                          {["Make_alt", "Model_alt", "Trim_alt"].map(ph => (
                            <span key={ph} className="bg-gray-100 rounded px-2 py-1 text-sm">[{ph}]</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setShowPlaceholderModal(false)}>Close</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'ads' && (
              <div className="bg-white border rounded-xl p-6">
                {/* Panel Responsive Search Ads */}
                <div className="mb-4">
                  <div
                    className="border rounded bg-gray-100 px-4 py-3 font-semibold cursor-pointer"
                    style={{ color: '#404042', borderColor: '#faad39ff' }}
                    onClick={() => setAdsPanel(adsPanel === 'responsive' ? null : 'responsive')}
                  >
                    Responsive Search Ads
                  </div>
                  {adsPanel === 'responsive' && (
                    <div>
                      {responsiveAds.length === 0 && (
                        <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mt-2 mb-2">
                          There are no Responsive Search Ads added, if you like, you can add one by clicking the plus sign.
                        </div>
                      )}
                      {responsiveAds.map((ad, idx) => renderResponsiveAdForm(ad, idx))}
                    </div>
                  )}
                </div>
                {/* Panel Call-Only Ads */}
                <div className="mb-4">
                  <div
                    className="border rounded bg-gray-100 px-4 py-3 font-semibold cursor-pointer"
                    style={{ color: '#404042', borderColor: '#faad39ff' }}
                    onClick={() => setAdsPanel(adsPanel === 'callonly' ? null : 'callonly')}
                  >
                    Call-Only Ads
                  </div>
                  {adsPanel === 'callonly' && (
                    <div>
                      {callOnlyAds.length === 0 && (
                        <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mt-2 mb-2">
                          There are no Call-Only Ads added, if you like, you can add one by clicking the plus sign.
                        </div>
                      )}
                      {callOnlyAds.map((ad, idx) => renderCallOnlyAdForm(ad, idx))}
                    </div>
                  )}
                </div>
                {/* Botón + y menú de tipo de ad */}
                <div className="relative">
                  <Button size="icon" variant="default" className="!rounded !w-10 !h-10" style={{ backgroundColor: '#faad39ff', color: '#404042' }} onClick={() => setShowAddAdMenu(v => !v)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                  {showAddAdMenu && (
                    <div className="absolute left-0 mt-2 bg-white border rounded shadow z-10 min-w-[180px]">
                      <div className="px-4 py-2 font-semibold text-[#404042] border-b">Ad Types</div>
                      <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8E1] hover:text-[#faad39ff]" style={{ color: '#404042' }} onClick={addResponsiveAd}>Responsive Search Ad</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8E1] hover:text-[#faad39ff]" style={{ color: '#404042' }} onClick={addCallOnlyAd}>Call-Only Ad</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'keywords' && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-[#404042] text-lg">Keywords</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#faad39ff' }}
                        title="Download CSV template"
                        onClick={handleDownloadTemplate}
                      >
                        <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20"><path d="M10 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 6.293 9.293L8.5 11.586V3a1 1 0 0 1 1-1z"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#404042ff' }}
                        title="Update keywords from file"
                        onClick={handleUploadKeywords}
                      >
                        <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20"><path d="M10 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 6.293 9.293L8.5 11.586V3a1 1 0 0 1 1-1z"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded" style={{ background: '#f77272ff' }}
                        title="Delete selected keywords"
                        onClick={handleDeleteKeywords}
                      >
                        <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20"><rect x="5" y="6" width="10" height="10" rx="2"/><rect x="8" y="2" width="4" height="2" rx="1"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex font-semibold text-[#404042] mb-1 gap-2 items-center">
                    <div className="w-full">Keyword</div>
                    <div className="w-full">Match Type</div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#FF0B55] ml-2"
                      checked={selectAllKeywords}
                      onChange={e => handleSelectAllKeywords(e.target.checked)}
                    />
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
                        value={kw.keyword}
                        onChange={e => setKeywords(ks => ks.map((k, i) => i === idx ? { ...k, keyword: e.target.value } : k))}
                      />
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={kw.matchType}
                        onChange={e => setKeywords(ks => ks.map((k, i) => i === idx ? { ...k, matchType: e.target.value as 'Broad' | 'Phrase' | 'Exact' } : k))}
                      >
                        {matchTypeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.value}</option>
                        ))}
                      </select>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#FF0B55] ml-2"
                        checked={kw.selected}
                        onChange={e => handleSelectKeyword(idx, e.target.checked)}
                      />
                    </div>
                  ))}
                  {/* Fila para agregar nueva keyword */}
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={newKeyword.keyword}
                      onChange={e => setNewKeyword(k => ({ ...k, keyword: e.target.value }))}
                      placeholder=""
                    />
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={newKeyword.matchType}
                      onChange={e => setNewKeyword(k => ({ ...k, matchType: e.target.value as 'Broad' | 'Phrase' | 'Exact' }))}
                    >
                      {matchTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.value}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      className="p-2 rounded" style={{ background: '#404042ff', color: '#fff' }}
                      onClick={handleAddKeyword}
                    >
                      <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20"><rect x="9" y="4" width="2" height="12"/><rect x="4" y="9" width="12" height="2"/></svg>
                    </Button>
                  </div>
                </div>
                {/* Modal de confirmación para eliminar */}
                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
                      <div className="text-6xl text-[#ffe066] mb-2">!</div>
                      <div className="text-xl font-bold mb-2 text-[#404042]">Are you sure?</div>
                      <div className="mb-4 text-[#404042]">You are going to delete all existing keywords</div>
                      <div className="flex gap-4">
                        <button className="px-4 py-2 rounded font-semibold" style={{ background: '#FF0B55', color: '#fff' }} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="px-4 py-2 rounded font-semibold" style={{ background: '#404042ff', color: '#fff' }} onClick={confirmDeleteKeywords}>Yes, delete it!</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'ad_group_custom_parameters' && (
              <div className="bg-white border rounded-xl p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold text-[#404042]">URL Custom Parameters</Label>
                    <div className="flex gap-2">
                      <Button size="icon" variant="destructive" style={{ backgroundColor: '#faad39ff', color: '#fff' }} onClick={handleDeleteParams} title="Delete selected parameters">
                        <Trash className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="default" style={{ backgroundColor: '#404042ff', color: '#fff' }} onClick={() => setShowParamHelp(true)} title="Help">
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </div>
                    <input
                      type="checkbox"
                      className="ml-4 w-5 h-5 accent-[#faad39ff]"
                      checked={selectAllParams}
                      onChange={e => handleSelectAllParams(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex font-semibold text-[#404042] mb-1">
                      <div className="w-full">Name</div>
                      <div className="w-full">Value</div>
                      <div className="w-full text-center">Select</div>
                    </div>
                    {customParams.length === 0 && (
                      <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mb-2 text-center">
                        No URL Appends have been added yet
                      </div>
                    )}
                    {customParams.map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-1">
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={param.name}
                          onChange={e => setCustomParams(params => params.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))}
                        />
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={param.value}
                          onChange={e => setCustomParams(params => params.map((p, i) => i === idx ? { ...p, value: e.target.value } : p))}
                        />
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#faad39ff]"
                          checked={param.selected}
                          onChange={e => handleSelectParam(idx, e.target.checked)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={newParam.name}
                      onChange={e => setNewParam(p => ({ ...p, name: e.target.value }))}
                      placeholder="Name"
                    />
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={newParam.value}
                      onChange={e => setNewParam(p => ({ ...p, value: e.target.value }))}
                      placeholder="Value"
                    />
                    <Button size="icon" variant="default" style={{ backgroundColor: '#404042ff', color: '#fff' }} onClick={handleAddParam}>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                {/* Modal de ayuda */}
                {showParamHelp && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
                      <div className="text-xl font-bold mb-2 text-[#404042]">Help</div>
                      <div className="mb-4 text-[#404042]">Add custom URL parameters for your ad group. Each parameter must have a name and a value. Select parameters and click the trash icon to delete them.</div>
                      <Button style={{ backgroundColor: '#404042ff', color: '#fff' }} onClick={() => setShowParamHelp(false)}>Close</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Botones de acción al final */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            className="px-5 py-2 rounded font-semibold text-white"
            style={{ background: '#f77272ff' }}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-5 py-2 rounded font-semibold text-white"
              style={{ background: '#404042ff' }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded font-semibold text-white"
              style={{ background: '#faad39ff' }}
              onClick={handleSaveAndApply}
            >
              Save and Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 