"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const tabList = [
  { key: "campaign", label: "Campaign" },
  { key: "adgroup", label: "Ad Group" },
  { key: "keywords", label: "Keywords" },
  { key: "ads", label: "Ads" },
];

type MultiSelectOption = { id: string | number; name: string };

function MultiSelect({ options, value, onChange, placeholder = "Select option" }: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
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

const adGroupPlaceholders = [
  "advertiser_website",
  "advertiser_dba",
  "advertiser_city",
  "advertiser_state",
  "Make_alt",
  "Model_alt",
  "Trim_alt",
];

export default function EditAutoTemplatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const templates = useCampaignTemplateStore(state => state.templates);
  const updateTemplate = useCampaignTemplateStore(state => state.updateTemplate);
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estados principales (igual que en NewAutoTemplatePage)
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
  // Ad Group Naming
  const [adGroupName, setAdGroupName] = useState("");
  const [maxCpcBid, setMaxCpcBid] = useState("0.01");
  const [setMaxCpcOnCreate, setSetMaxCpcOnCreate] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [showFinalUrlDropdown, setShowFinalUrlDropdown] = useState(false);
  const [finalUrlDropdownPos, setFinalUrlDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const finalUrlInputRef = useRef<HTMLInputElement | null>(null);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  // Tabs
  const [activeTab, setActiveTab] = useState("campaign");
  const [adsTab, setAdsTab] = useState("responsive");
  const [showAdTypeMenu, setShowAdTypeMenu] = useState(false);
  const [adsPanels, setAdsPanels] = useState({ responsive: true, callonly: true });
  // Keywords
  const [keywords, setKeywords] = useState<{ keyword: string; matchType: string }[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newMatchType, setNewMatchType] = useState("Broad");
  // Custom params
  const [customParams, setCustomParams] = useState<{ name: string; value: string }[]>([]);
  const [selectedParams, setSelectedParams] = useState<number[]>([]);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [showCustomError, setShowCustomError] = useState(false);
  // Filter groups
  const [filterGroups, setFilterGroups] = useState([
    { id: 1, filters: [] as { id: number; field: string; operator: string; value: string }[], showAttrDropdown: false }
  ]);
  const [nextGroupId, setNextGroupId] = useState(2);
  const [nextFilterId, setNextFilterId] = useState(1);
  const [attributeSearch, setAttributeSearch] = useState("");
  // Negative keywords dinámico
  const { lists: negativeKeywordLists } = useNegativeKeywordStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPlaceholderDropdown, setShowPlaceholderDropdown] = useState(false);
  const [placeholderDropdownPos, setPlaceholderDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const adGroupInputRef = useRef<HTMLInputElement | null>(null);
  // Responsive Search Ads
  const [responsiveAds, setResponsiveAds] = useState<any[]>([]);
  const [showResponsiveAlt, setShowResponsiveAlt] = useState(false);
  const [showAdTypeDropdown, setShowAdTypeDropdown] = useState(false);
  const adTypeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [adTypeDropdownPos, setAdTypeDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const [callOnlyAds, setCallOnlyAds] = useState<any[]>([]);
  const [showCallOnlyAlt, setShowCallOnlyAlt] = useState(false);
  const [notificationSchedule, setNotificationSchedule] = useState<'changes' | 'errors' | 'always'>('changes');

  // Precarga los datos del template a editar
  useEffect(() => {
    if (id) {
      const template = templates.find(t => t.id === id);
      if (template) {
        setTemplateName(template.templateName || '');
        setAdvertiser(template.advertiser || '');
        setGoogleCustomer(template.googleCustomer || '');
        setAdGroupName(template.adGroupName || '');
        setMaxCpcBid(template.maxCpcBid || '');
        setSetMaxCpcOnCreate(!!template.setMaxCpcOnCreate);
        setFinalUrl(template.finalUrl || '');
        setResponsiveAds(template.responsiveAds || []);
        setCallOnlyAds(template.callOnlyAds || []);
        setKeywords(template.keywords || []);
        setActive(template.campaignStatus === 'Active');
        setAuthorized(!!template.authorize);
        setCampaign(template.campaignName || '');
        // ...otros campos según sea necesario
      }
    }
  }, [id, templates]);

  // Handler para guardar cambios
  const handleSave = () => {
    if (!id) return;
    updateTemplate(id, {
      id,
      templateName,
      advertiser,
      googleCustomer,
      adGroupName,
      maxCpcBid,
      setMaxCpcOnCreate,
      finalUrl,
      responsiveAds,
      callOnlyAds,
      keywords,
      campaignName: campaign,
      campaignStatus: active ? 'Active' : 'Inactive',
      authorize: authorized,
      // ...otros campos requeridos por la interfaz
    });
    router.push('/dashboard/campaigns');
  };

  function handleAdGroupNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdGroupName(e.target.value);
  }

  function handleAdGroupNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === '{') {
      setShowPlaceholderDropdown(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setPlaceholderDropdownPos({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }

  function handleSelectPlaceholder(placeholder: string) {
    setAdGroupName(prev => prev + placeholder);
    setShowPlaceholderDropdown(false);
  }

  // Renderiza tabs y campos igual que NewAutoTemplatePage
  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-5xl px-4 sm:px-8 py-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: '#404042' }}>Edit Auto-Template</h1>
          </div>
          <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#404042' }}>Template Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <Label>Template Name</Label>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Internal name" />
                <Label>Advertiser</Label>
                <select className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" value={advertiser} onChange={e => setAdvertiser(e.target.value)}>
                  <option value="">Select advertiser</option>
                  {advertisers.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
                <Label>Google Ads Customer</Label>
                <select className="w-full border rounded h-10 px-2 mb-4" value={googleCustomer} onChange={e => setGoogleCustomer(e.target.value)}>
                  <option value="">Select account</option>
                  {googleAdsCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {/* Notification schedule */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center mt-2 mb-4 bg-[#FFF8E1] rounded-lg p-4 border border-[#faad39ff]/40">
                  <div className="md:col-span-2 text-right font-semibold text-[#404042]">Notification schedule</div>
                  <div className="md:col-span-4">
                    <div className="font-medium text-[#404042] mb-2">How often do you want to receive alerts for this template?</div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="notificationSchedule" value="changes" checked={notificationSchedule === 'changes'} onChange={() => setNotificationSchedule('changes')} />
                        Only on changes
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="notificationSchedule" value="errors" checked={notificationSchedule === 'errors'} onChange={() => setNotificationSchedule('errors')} />
                        Only on errors
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="notificationSchedule" value="always" checked={notificationSchedule === 'always'} onChange={() => setNotificationSchedule('always')} />
                        Always receive emails
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
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
                  <div className="md:col-span-4">
                    <input
                      value={adGroupName}
                      onChange={handleAdGroupNameChange}
                      onKeyDown={handleAdGroupNameKeyDown}
                      ref={adGroupInputRef}
                      className="bg-[#FFF8E1] border border-[#faad39ff] rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#faad39ff] focus:outline-none text-[#404042]"
                      placeholder="Ad Group Name"
                    />
                    {showPlaceholderDropdown && (
                      <div
                        style={{
                          position: "absolute",
                          top: placeholderDropdownPos.top,
                          left: placeholderDropdownPos.left,
                          width: placeholderDropdownPos.width,
                          zIndex: 1000,
                          background: "white",
                          border: "1px solid #faad39ff",
                          borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          padding: 4,
                        }}
                      >
                        {adGroupPlaceholders.map(ph => (
                          <div
                            key={ph}
                            className="px-4 py-2 cursor-pointer hover:bg-[#FFF3D1] text-[#404042]"
                            onMouseDown={e => { e.preventDefault(); handleSelectPlaceholder(ph); }}
                          >
                            {ph}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Aquí puedes agregar más tabs según sea necesario */}
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" type="button" onClick={() => router.push('/dashboard/campaigns')}>Cancel</Button>
            <Button variant="secondary" type="button" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 