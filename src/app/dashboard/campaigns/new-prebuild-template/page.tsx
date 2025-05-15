"use client";
import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Info, ChevronDown } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const advertisers = ["Advertiser 1", "Advertiser 2"];
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

export default function NewPrebuildTemplatePage() {
  const [form, setForm] = useState({
    templateName: "",
    advertiser: "",
    includeLocation: true,
    location: "",
    library: libraries[0],
    date: "",
    makeFilter: [] as string[],
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
    negativeKeywords: [] as string[],
    adGroupName: "",
    adGroupStatus: "Paused",
    finalUrl: "",
    maxCpcBid: "",
    setMaxCpcOnCreate: false,
  });
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

  const handleTabSwitch = (tab: string, value: boolean) => {
    setTabSwitches((prev) => ({ ...prev, [tab]: value }));
    if (!value && activeTab === tab) {
      const nextActive = Object.keys(tabSwitches).find((t) => t !== tab && tabSwitches[t]);
      if (nextActive) setActiveTab(nextActive);
    }
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
                  setForm(newVehiclesByYearTemplate);
                  setKeywords(newVehiclesByYearKeywords);
                }}>
                  New Vehicles by Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* lógica para usar 'Used Make Model' */}}>
                  Used Make Model
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* lógica para usar 'Used Year Make Model' */}}>
                  Used Year Make Model
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#404042' }}>Template Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-[#404042]">Template Name</label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.templateName} onChange={e => setForm(f => ({ ...f, templateName: e.target.value }))} />
                <label className="font-semibold text-[#404042]">Advertiser</label>
                <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.advertiser} onChange={e => setForm(f => ({ ...f, advertiser: e.target.value }))}>
                  <option value="">Select advertiser</option>
                  {advertisers.map(a => <option key={a}>{a}</option>)}
                </select>
                <label className="font-semibold text-[#404042]">Location</label>
                <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                <label className="font-semibold text-[#404042]">Library</label>
                <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.library} onChange={e => setForm(f => ({ ...f, library: e.target.value }))}>
                  {libraries.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-[#404042]">Use Only Products Added Since...</label>
                <input type="date" className="border border-gray-300 rounded px-3 py-2 w-full" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                <label className="font-semibold text-[#404042]">Make Filter</label>
                <DropdownMenu open={makeDropdownOpen} onOpenChange={setMakeDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="border border-gray-300 rounded px-3 py-2 w-full text-left bg-white flex flex-wrap gap-1 min-h-[40px] items-center relative">
                      {form.makeFilter.length === 0 ? (
                        <span className="text-gray-400">Nothing selected</span>
                      ) : (
                        form.makeFilter.map((make) => (
                          <span key={make} className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                            {make}
                            <button type="button" className="ml-1 text-[#F17625] hover:text-[#FAAE3A]" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, makeFilter: f.makeFilter.filter(m => m !== make) })); }}>×</button>
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
                          setForm(f => ({
                            ...f,
                            makeFilter: checked
                              ? [...f.makeFilter, make]
                              : f.makeFilter.filter(m => m !== make),
                          }));
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
                  <input className="border border-gray-300 rounded px-3 py-2 w-1/2" placeholder="Year Start" value={form.yearStart} onChange={e => setForm(f => ({ ...f, yearStart: e.target.value }))} />
                  <input className="border border-gray-300 rounded px-3 py-2 w-1/2" placeholder="End Year" value={form.yearEnd} onChange={e => setForm(f => ({ ...f, yearEnd: e.target.value }))} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={form.authorize} onChange={e => setForm(f => ({ ...f, authorize: e.target.checked }))} />
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
                  <Switch checked={tabSwitches[tab.key]} onCheckedChange={v => handleTabSwitch(tab.key, v)} />
                </div>
              ))}
            </div>
            {activeTab === "campaign" && tabSwitches.campaign && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Campaign Name</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.campaignName} onChange={e => setForm(f => ({ ...f, campaignName: e.target.value }))} />
                  <label className="font-semibold text-[#404042]">Campaign Status</label>
                  <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.campaignStatus} onChange={e => setForm(f => ({ ...f, campaignStatus: e.target.value }))}>
                    <option>Active</option>
                    <option>Paused</option>
                  </select>
                  <label className="font-semibold text-[#404042]">Budget</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
                  <label className="font-semibold text-[#404042]">Networks</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.networks} onChange={e => setForm(f => ({ ...f, networks: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Enhanced CPC</label>
                  <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.enhancedCpc} onChange={e => setForm(f => ({ ...f, enhancedCpc: e.target.value }))}>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                  <label className="font-semibold text-[#404042]">Mobile Bid Modifier</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.mobileBidModifier} onChange={e => setForm(f => ({ ...f, mobileBidModifier: e.target.value }))} />
                  <label className="font-semibold text-[#404042]">Ad Rotation</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.adRotation} onChange={e => setForm(f => ({ ...f, adRotation: e.target.value }))} />
                  <label className="font-semibold text-[#404042]">Negative Keywords Lists Selection</label>
                  <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.negativeKeywords[0] || ""} onChange={e => setForm(f => ({ ...f, negativeKeywords: [e.target.value] }))}>
                    {negativeKeywordLists.map(nk => <option key={nk}>{nk}</option>)}
                  </select>
                </div>
              </div>
            )}
            {activeTab === "adgroup" && tabSwitches.adgroup && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Ad Group Name</label>
                  <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.adGroupName} onChange={e => setForm(f => ({ ...f, adGroupName: e.target.value }))} />
                  <label className="font-semibold text-[#404042]">Ad Group Status</label>
                  <select className="border border-gray-300 rounded px-3 py-2 w-full" value={form.adGroupStatus} onChange={e => setForm(f => ({ ...f, adGroupStatus: e.target.value }))}>
                    <option>Paused</option>
                    <option>Active</option>
                  </select>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-semibold text-[#404042]">Final URL</label>
                  <div className="flex items-center gap-2">
                    <input className="border border-gray-300 rounded px-3 py-2 w-full" value={form.finalUrl} onChange={e => setForm(f => ({ ...f, finalUrl: e.target.value }))} />
                    <Info size={18} className="text-[#2A6BE9] cursor-pointer" onClick={() => setShowPlaceholder(true)} />
                  </div>
                </div>
                {showPlaceholder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                      <h2 className="text-lg font-bold text-[#2A6BE9] mb-2">Available Placeholders</h2>
                      <div className="mb-2">
                        <div className="font-semibold text-[#404042]">From Advertiser Settings</div>
                        <div className="text-sm text-[#404042]">[advertiser_website], [advertiser_dba], [advertiser_city], [advertiser_state]</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#404042]">From Libraries</div>
                        <div className="text-sm text-[#404042]">[Make], [Make_alt], [Model], [Model_alt], [Trim], [Trim_alt], [Year]</div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => setShowPlaceholder(false)}>Close</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "ads" && tabSwitches.ads && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#FFF3D1] text-[#404042] rounded p-4 text-center">There are no Responsive Search Ads added, if you like, you can add one by clicking the plus sign.</div>
                <div className="bg-[#FFF3D1] text-[#404042] rounded p-4 text-center">There are no Call-Only Ads added, if you like, you can add one by clicking the plus sign.</div>
                <Button className="mt-4 bg-[#FF9F00] text-white rounded self-center" variant="secondary">+ Add Ad</Button>
              </div>
            )}
            {activeTab === "keywords" && tabSwitches.keywords && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 max-w-2xl bg-[#FFFDF7] border border-[#FAAE3A]/40 rounded-xl p-6 shadow-sm">
                  <label className="font-semibold text-[#404042] mb-2">Keyword</label>
                  {keywords.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-2">
                      <div className="flex flex-wrap gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white min-w-[220px] shadow-sm">
                        {row.keyword.map((k: string, i: number) => (
                          <span key={i} className="bg-[#FAAE3A]/30 border border-[#FAAE3A] text-[#404042] rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                            {k}
                            <button type="button" className="ml-1 text-[#F17625] hover:text-[#FAAE3A] text-xs" onClick={() => {
                              setKeywords(keywords => keywords.map((kw, kwIdx) => kwIdx === idx ? { ...kw, keyword: kw.keyword.filter((_: any, ki: number) => ki !== i) } : kw));
                            }}>×</button>
                          </span>
                        ))}
                        <input
                          className="border-none outline-none flex-1 min-w-[40px] text-xs py-0.5 px-1"
                          placeholder="Add..."
                          value={row.newWord || ''}
                          onChange={e => setKeywords(keywords => keywords.map((kw, kwIdx) => kwIdx === idx ? { ...kw, newWord: e.target.value } : kw))}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && row.newWord?.trim()) {
                              setKeywords(keywords => keywords.map((kw, kwIdx) => kwIdx === idx ? { ...kw, keyword: [...kw.keyword, row.newWord.trim()], newWord: '' } : kw));
                            }
                          }}
                        />
                      </div>
                      <select
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white shadow-sm"
                        value={row.matchType}
                        onChange={e => setKeywords(keywords => keywords.map((kw, kwIdx) => kwIdx === idx ? { ...kw, matchType: e.target.value } : kw))}
                      >
                        <option>Broad</option>
                        <option>Phrase</option>
                        <option>Exact</option>
                      </select>
                      <button type="button" className="text-[#F17625] hover:text-[#FAAE3A] px-2 text-lg" onClick={() => setKeywords(keywords => keywords.filter((_, i) => i !== idx))} title="Delete keyword">🗑️</button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      className="border border-gray-200 rounded-lg px-2 py-1 flex-1 text-sm bg-white shadow-sm"
                      placeholder="Add new keyword (separate words with space)"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newKeyword.trim()) {
                          const words = newKeyword.trim().split(/\s+/);
                          setKeywords(keywords => [...keywords, { keyword: words, matchType: 'Broad' }]);
                          setNewKeyword("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-[#FAAE3A] hover:bg-[#F17625] text-[#404042] font-bold rounded-lg px-4 py-1 shadow-sm border border-[#FAAE3A] transition-colors"
                      onClick={() => {
                        if (newKeyword.trim()) {
                          const words = newKeyword.trim().split(/\s+/);
                          setKeywords(keywords => [...keywords, { keyword: words, matchType: 'Broad' }]);
                          setNewKeyword("");
                        }
                      }}
                    >+
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "adext" && tabSwitches.adext && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Call Ext</span>
                  </div>
                  <input className="border border-gray-300 rounded px-3 py-2" placeholder="Phone" />
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Site Links</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input className="border border-gray-300 rounded px-3 py-2 flex-1" placeholder="Text" />
                    <input className="border border-gray-300 rounded px-3 py-2 flex-1" placeholder="Link" />
                    <Button className="bg-[#FF9F00] text-white rounded" variant="secondary">+</Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Switch />
                    <span className="font-semibold text-[#404042]">Include Call Outs</span>
                  </div>
                  <input className="border border-gray-300 rounded px-3 py-2" placeholder="Text" />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-end mt-8">
            <Button
              variant="destructive"
              type="button"
              className="bg-[#D84040] hover:bg-[#E17564]/90"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button variant="secondary" type="button" onClick={() => alert('Template saved successfully!')}>Save</Button>
          </div>
        </main>
      </div>
    </div>
  );
} 