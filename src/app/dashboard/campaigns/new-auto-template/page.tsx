"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import clsx from "clsx";
import React from "react";

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

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-5xl px-4 sm:px-8 py-8 mb-10">
          <h1 className="text-2xl font-bold mb-6 text-primary">New Auto-Template</h1>
          {/* SECCIÓN 1: Template Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Internal name" />
              </div>
              <div>
                <Label>Advertiser</Label>
                <select className="w-full border rounded h-10 px-2" value={advertiser} onChange={handleAdvertiserChange}>
                  <option value="">Select advertiser</option>
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Google Ads Customer</Label>
                <select className="w-full border rounded h-10 px-2" value={googleCustomer} onChange={e => setGoogleCustomer(e.target.value)}>
                  <option value="">Select account</option>
                  {googleAdsCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={e => setEmailNotifications(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
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
              <div className="flex gap-2 mt-2">
                <Button variant="outline" type="button"><Eye className="w-4 h-4 mr-2" />Preview</Button>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="authorized"
                    checked={authorized}
                    onChange={e => setAuthorized(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  <Label htmlFor="authorized">
                  I authorize Hoot support to revise Final URLs in ads within "Eligible Campaigns" in the event where clearly incorrect URLs are misspending the campaign budget</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* SECCIÓN 2: Campaign Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Selection</Label>
                <select className="w-full border rounded h-10 px-2" value={campaign} onChange={e => setCampaign(e.target.value)}>
                  <option value="">Select campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Negative Keywords Lists Selection</Label>
                <MultiSelect
                  options={negativeKeywordLists}
                  value={negativeLists}
                  onChange={setNegativeLists}
                  placeholder="Select negative keyword lists..."
                />
              </div>
            </CardContent>
          </Card>
          {/* TABS DE SECCIONES */}
          <div className="mb-6">
            <div className="flex gap-2 border-b mb-4">
              <button
                className={clsx(
                  "px-4 py-2 font-medium border-b-2 transition",
                  activeTab === "adgroup"
                    ? "border-[#FAAE3A] bg-[#FAAE3A] text-[#404042] rounded-t"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
                onClick={() => setActiveTab("adgroup")}
              >
                Ad Group Naming
              </button>
              <button
                className={clsx(
                  "px-4 py-2 font-medium border-b-2 transition",
                  activeTab === "ads"
                    ? "border-[#FAAE3A] bg-[#FAAE3A] text-[#404042] rounded-t"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
                onClick={() => setActiveTab("ads")}
              >
                Ads
              </button>
              <button
                className={clsx(
                  "px-4 py-2 font-medium border-b-2 transition",
                  activeTab === "keywords"
                    ? "border-[#FAAE3A] bg-[#FAAE3A] text-[#404042] rounded-t"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
                onClick={() => setActiveTab("keywords")}
              >
                Keywords
              </button>
              <button
                className={clsx(
                  "px-4 py-2 font-medium border-b-2 transition",
                  activeTab === "custom"
                    ? "border-[#FAAE3A] bg-[#FAAE3A] text-[#404042] rounded-t"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
                onClick={() => setActiveTab("custom")}
              >
                Ad Group Custom Parameters
              </button>
            </div>
            <div className="bg-card border rounded p-4 min-h-[80px]">
              {activeTab === "adgroup" && (
                <>
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
                </>
              )}
              {activeTab === "ads" && (
                <div className="mb-4">
                  <div className="space-y-4">
                    {/* Responsive Search Ads Panel */}
                    <div className="border rounded bg-[#F5F6FA]">
                      <button
                        className="w-full text-left px-4 py-2 font-semibold text-[#404042] border-b border-gray-200 flex items-center justify-between focus:outline-none"
                        onClick={() => setAdsPanels(p => ({ ...p, responsive: !p.responsive }))}
                        type="button"
                      >
                        Responsive Search Ads
                        <span className={`transition-transform ${adsPanels.responsive ? '' : 'rotate-180'}`}>▼</span>
                      </button>
                      {adsPanels.responsive && (
                        <div className="p-4">
                          <div className="bg-[#FFF8E1] text-[#404042] rounded px-4 py-3 text-center border border-[#FAAE3A]">
                            There are no Responsive Search Ads added, if you like, you can add one by clicking the plus sign.
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Call-Only Ads Panel */}
                    <div className="border rounded bg-[#F5F6FA]">
                      <button
                        className="w-full text-left px-4 py-2 font-semibold text-[#404042] border-b border-gray-200 flex items-center justify-between focus:outline-none"
                        onClick={() => setAdsPanels(p => ({ ...p, callonly: !p.callonly }))}
                        type="button"
                      >
                        Call-Only Ads
                        <span className={`transition-transform ${adsPanels.callonly ? '' : 'rotate-180'}`}>▼</span>
                      </button>
                      {adsPanels.callonly && (
                        <div className="p-4">
                          <div className="bg-[#FFF8E1] text-[#404042] rounded px-4 py-3 text-center border border-[#FAAE3A]">
                            There are no Call-Only Ads added, if you like, you can add one by clicking the plus sign.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative mt-4 inline-block">
                    <button
                      className="bg-[#FAAE3A] hover:bg-[#F17625] active:bg-[#F17625] text-[#404042] font-bold rounded w-10 h-10 flex items-center justify-center transition-colors text-xl"
                      type="button"
                      onClick={() => setShowAdTypeMenu(v => !v)}
                    >
                      +
                    </button>
                    {showAdTypeMenu && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                        <div className="px-4 py-2 font-semibold text-gray-500 border-b">Ad Types</div>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-[#FAAE3A] hover:text-[#404042] transition-colors"
                          onClick={() => { setShowAdTypeMenu(false); /* lógica para agregar Responsive Search Ad */ }}
                        >
                          Responsive Search Ad
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-[#FAAE3A] hover:text-[#404042] transition-colors"
                          onClick={() => { setShowAdTypeMenu(false); /* lógica para agregar Call-Only Ad */ }}
                        >
                          Call-Only Ad
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "keywords" && (
                <div className="bg-card border rounded p-6 min-h-[200px]">
                  <div className="flex justify-end gap-2 mb-4">
                    <Tooltip text="Download CSV template">
                      <button
                        className="bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded px-3 py-2 flex items-center justify-center"
                        onClick={() => {/* lógica de descarga */}}
                        type="button"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16V4m0 12l-4-4m4 4l4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#fff"/></svg>
                      </button>
                    </Tooltip>
                    <Tooltip text="Update keywords from file">
                      <button
                        className="bg-[#3498DB] hover:bg-[#2980B9] text-white rounded px-3 py-2 flex items-center justify-center"
                        onClick={() => {/* lógica de upload */}}
                        type="button"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8v8m0-8l-4 4m4-4l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#fff"/></svg>
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete selected keywords">
                      <button
                        className="bg-[#FF6B6B] hover:bg-[#E74C3C] text-white rounded px-3 py-2 flex items-center justify-center"
                        onClick={() => setShowDeleteModal(true)}
                        type="button"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="12" rx="2" stroke="#fff" strokeWidth="2"/><path d="M10 11v4m4-4v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#fff" strokeWidth="2"/></svg>
                      </button>
                    </Tooltip>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm mb-2">
                      <thead>
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold text-[#404042]">Keyword</th>
                          <th className="text-left px-4 py-2 font-semibold text-[#404042]">Match Type</th>
                          <th className="px-2"><input type="checkbox" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Aquí renderizar keywords, si no hay mostrar mensaje */}
                        {keywords.length === 0 && (
                          <tr>
                            <td colSpan={3}>
                              <div className="bg-[#FFF8E1] text-[#404042] rounded px-4 py-3 text-center border border-[#FAAE3A]">No keywords have been added yet</div>
                            </td>
                          </tr>
                        )}
                        {keywords.map((kw, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <input className="w-full border rounded px-2 py-1" value={kw.keyword} onChange={e => handleKeywordChange(idx, 'keyword', e.target.value)} placeholder="Add keyword..." />
                            </td>
                            <td className="px-4 py-2">
                              <select className="border rounded px-2 py-1 w-40 min-w-[100px]" value={kw.matchType} onChange={e => handleKeywordChange(idx, 'matchType', e.target.value)}>
                                <option value="Broad">Broad</option>
                                <option value="Phrase">Phrase</option>
                                <option value="Exact">Exact</option>
                              </select>
                            </td>
                            <td className="px-2 text-center">
                              <input type="checkbox" checked={selectedKeywords.includes(idx)} onChange={e => handleSelectKeyword(idx, e.target.checked)} />
                              {/* Botón + solo en la última fila */}
                              {idx === keywords.length - 1 && (
                                <button
                                  className="bg-[#FAAE3A] hover:bg-[#F17625] active:bg-[#F17625] text-[#404042] rounded w-8 h-8 flex items-center justify-center text-lg border border-[#FAAE3A] ml-2"
                                  onClick={() => setKeywords([...keywords, { keyword: '', matchType: 'Broad' }])}
                                  type="button"
                                >
                                  +
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === "custom" && (
                <div>[Custom Params config aquí]</div>
              )}
            </div>
          </div>
          {/* POPUP DE PLACEHOLDERS */}
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
          {/* MODAL DE CONFIRMACIÓN */}
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
          {/* BOTONES FINALES */}
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