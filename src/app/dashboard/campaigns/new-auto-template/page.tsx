"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import clsx from "clsx";

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

  // Validación robusta para alerta
  const handleAdvertiserChange = (e: any) => {
    const selectedId = e.target.value;
    setAdvertiser(selectedId);
    // Buscar advertiser seleccionado
    const adv = advertisers.find(a => String(a.id) === String(selectedId));
    // Mostrar alerta si no hay advertiser o si no tiene inventario web activo
    setShowAlert(!selectedId || (adv ? !adv.hasWebInventory : false));
  };

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-3xl px-4 sm:px-8 py-8">
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
                  <Label htmlFor="authorized">I authorize Hoot to adjust final URLs if needed</Label>
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
                <select multiple className="w-full border rounded h-20 px-2" value={negativeLists} onChange={e => setNegativeLists(Array.from(e.target.selectedOptions, option => option.value))}>
                  {negativeKeywordLists.map(nk => <option key={nk.id} value={nk.id}>{nk.name}</option>)}
                </select>
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
                    ? "border-accent bg-accent text-accent-foreground rounded-t"
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
                    ? "border-accent bg-accent text-accent-foreground rounded-t"
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
                    ? "border-accent bg-accent text-accent-foreground rounded-t"
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
                    ? "border-accent bg-accent text-accent-foreground rounded-t"
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
                    <span className="font-semibold">Ad Group Naming</span>
                    <button type="button" onClick={() => setShowPlaceholders(true)} className="text-primary hover:text-primary-foreground flex items-center gap-1">
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
                <div>[Ads config aquí]</div>
              )}
              {activeTab === "keywords" && (
                <div>[Keywords config aquí]</div>
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