"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { AlertTriangle, Eye, RefreshCcw } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
// import clsx from "clsx";
import React from "react";
import { useNegativeKeywordStore } from "@/store/negativeKeywordStore";
// import { FilterBuilder } from "@/components/ui/FilterBuilder";
import { useAdvertiserStore } from '@/store/advertiserStore';
import { useCampaignTemplateStore } from '@/store/campaignTemplateStore';

// Definiciones faltantes
const googleAdsCustomers = [
  { id: 1, name: "550-054-4980" },
  { id: 2, name: "170-908-1293" },
];

const campaigns = [
  { id: 1, name: "FFG VDP Search - Used" },
  { id: 2, name: "FFG Dynamic VDP - All Other New (Ford)" },
];

// const tabList = [
//   { key: "campaign", label: "Campaign" },
//   { key: "adgroup", label: "Ad Group" },
//   { key: "keywords", label: "Keywords" },
//   { key: "ads", label: "Ads" },
// ];

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
  descriptions: string[];
  paths: string[];
}

interface CallOnlyAd {
  headlines: string[];
  descriptions: string[];
  phoneNumber: string;
}

interface Template {
  id: string;
  templateName: string;
  advertiser: string;
  googleCustomer: string;
  adGroupName: string;
  maxCpcBid: string;
  setMaxCpcOnCreate: boolean;
  finalUrl: string;
  responsiveAds: ResponsiveAd[];
  callOnlyAds: CallOnlyAd[];
  keywords: { keyword: string; matchType: string }[];
  campaignName: string;
  campaignStatus: 'Active' | 'Inactive';
  authorize: boolean;
}

// Componente cliente que usa useSearchParams
function EditAutoTemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const templates = useCampaignTemplateStore(state => state.templates);
  const updateTemplate = useCampaignTemplateStore(state => state.updateTemplate);
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estados principales
  const [templateName, setTemplateName] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [googleCustomer, setGoogleCustomer] = useState("");
  const [active, setActive] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [campaign, setCampaign] = useState("");
  const [negativeLists, setNegativeLists] = useState<string[]>([]);
  const [adGroupName, setAdGroupName] = useState("");
  const [maxCpcBid, setMaxCpcBid] = useState("0.01");
  const [setMaxCpcOnCreate, setSetMaxCpcOnCreate] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [keywords, setKeywords] = useState<{ keyword: string; matchType: string }[]>([]);
  const { lists: negativeKeywordLists } = useNegativeKeywordStore();
  const [showPlaceholderDropdown, setShowPlaceholderDropdown] = useState(false);
  const [placeholderDropdownPos, setPlaceholderDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const adGroupInputRef = useRef<HTMLInputElement | null>(null);
  const [responsiveAds, setResponsiveAds] = useState<ResponsiveAd[]>([]);
  const [callOnlyAds, setCallOnlyAds] = useState<CallOnlyAd[]>([]);

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
      }
    }
  }, [id, templates]);

  // Handler para guardar cambios
  const handleSave = () => {
    if (!id) return;
    const updatedTemplate: Template = {
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
    };
    updateTemplate(id, updatedTemplate);
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
        width: rect.width
      });
    }
  }

  function handleSelectPlaceholder(placeholder: string) {
    setAdGroupName(prev => prev + placeholder);
    setShowPlaceholderDropdown(false);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Auto Template</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
            <select
              id="advertiser"
              className="w-full border rounded h-10 px-2"
              value={advertiser}
              onChange={(e) => setAdvertiser(e.target.value)}
            >
              <option value="">Select Advertiser</option>
              {advertisers.map((adv) => (
                <option key={adv.id} value={adv.id}>
                  {adv.name}
                </option>
              ))}
            </select>
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
              {googleAdsCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="campaign">Campaign</Label>
            <select
              id="campaign"
              className="w-full border rounded h-10 px-2"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
            >
              <option value="">Select Campaign</option>
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="authorized"
              checked={authorized}
              onCheckedChange={setAuthorized}
            />
            <Label htmlFor="authorized">Authorized</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="adGroupName">Ad Group Name</Label>
            <div ref={adGroupInputRef}>
              <Input
                id="adGroupName"
                value={adGroupName}
                onChange={handleAdGroupNameChange}
                onKeyDown={handleAdGroupNameKeyDown}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxCpcBid">Max CPC Bid</Label>
            <Input
              id="maxCpcBid"
              type="number"
              step="0.01"
              value={maxCpcBid}
              onChange={(e) => setMaxCpcBid(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="setMaxCpcOnCreate"
              checked={setMaxCpcOnCreate}
              onCheckedChange={setSetMaxCpcOnCreate}
            />
            <Label htmlFor="setMaxCpcOnCreate">Set Max CPC on Create</Label>
          </div>

          <div>
            <Label htmlFor="finalUrl">Final URL</Label>
            <Input
              id="finalUrl"
              value={finalUrl}
              onChange={(e) => setFinalUrl(e.target.value)}
            />
          </div>

          <div>
            <Label>Negative Keyword Lists</Label>
            <MultiSelect
              options={negativeKeywordLists.map((list, idx) => ({ id: idx, name: list.name }))}
              value={negativeLists}
              onChange={setNegativeLists}
            />
          </div>
        </div>
      </div>

      {showPlaceholderDropdown && (
        <div
          className="absolute bg-white border rounded shadow-lg p-2 z-50"
          style={{
            top: placeholderDropdownPos.top,
            left: placeholderDropdownPos.left,
            width: placeholderDropdownPos.width
          }}
        >
          {adGroupPlaceholders.map((placeholder) => (
            <div
              key={placeholder}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectPlaceholder(placeholder)}
            >
              {placeholder}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente principal que envuelve el contenido en Suspense
export default function EditAutoTemplatePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-xl">Loading...</div>}>
        <EditAutoTemplateContent />
      </Suspense>
    </DashboardLayout>
  );
} 