// Versión mejorada visualmente de AddAdvertiserModal con sugerencias aplicadas
"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AdvertiserFormData } from "@/types/advertiser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { useAdvertiserStore } from '@/store/advertiserStore';
import { DynamicDisplayFeeds } from "../[id]/components/DynamicDisplayFeeds";

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
  advertiserData: AdvertiserFormData;
  setAdvertiserData: (val: AdvertiserFormData) => void;
}

export default function AddAdvertiserModal({
  isDialogOpen,
  setIsDialogOpen,
  advertiserData,
  setAdvertiserData,
}: Props) {
  const [localData, setLocalData] = useState<AdvertiserFormData>(advertiserData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    advertiserData.Date ? new Date(advertiserData.Date) : null
  );
  const [step, setStep] = useState(1);
  const addAdvertiser = useAdvertiserStore(state => state.addAdvertiser);

  useEffect(() => {
    if (!isDialogOpen) return;
    setLocalData({
      ...advertiserData,
      Status: typeof advertiserData.Status === 'boolean' ? advertiserData.Status : true,
      FeatureDisplay: typeof advertiserData.FeatureDisplay === 'boolean' ? advertiserData.FeatureDisplay : false,
      FeatureVideo: typeof advertiserData.FeatureVideo === 'boolean' ? advertiserData.FeatureVideo : false,
      FeatureSearch: typeof advertiserData.FeatureSearch === 'boolean' ? advertiserData.FeatureSearch : false,
    });
    setSelectedDate(advertiserData.Date ? new Date(advertiserData.Date) : null);
    setStep(1);
  }, [isDialogOpen, advertiserData]);

  const stepLabels = [
    "Advertiser Details",
    "Features",
    "Dynamic Display Feeds",
    "Google Ads Integration",
    "Special Requests",
  ];

  const detailsFields: { key: keyof AdvertiserFormData; label: string; required?: boolean; type?: 'select'; options?: string[] }[] = [
    { key: "Name", label: "Name", required: true },
    { key: "DBA", label: "Advertiser DBA" },
    { key: "Website", label: "Website", required: true },
    { key: "Country", label: "Country", type: 'select', options: ['USA'] },
    { key: "Address", label: "Address", required: true },
    { key: "City", label: "City", required: true },
    { key: "State", label: "State", type: 'select', options: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ]},
    { key: "Zip", label: "Zip", required: true },
    { key: "Phone", label: "Advertiser Phone" },
    { key: "GMB", label: "GMB Store Code" },
    { key: "GooglePlaceId", label: "Google Place ID" },
    { key: "Category", label: "Category", type: 'select', options: [
      'Automotive', 'Real Estate', 'AAMG', 'Other'
    ]},
    { key: "Responsible", label: "Responsible User" },
  ];

  const featureFields = [
    { key: "FeatureDisplay", label: "Dynamic Display Feeds" },
    { key: "FeatureVideo", label: "Dynamic Video Ads" },
    { key: "FeatureSearch", label: "Google Ads Search Integration" },
  ] as const;

  const tooltips: Record<string, string> = {
    FeatureDisplay:
      "Provides a daily updated inventory feed for Google and Facebook dynamic remarketing campaigns.",
    FeatureVideo:
      "Enables video ad creation with dynamic content based on inventory.",
    FeatureSearch:
      "Connects to Google Ads and updates ad groups based on daily inventory.",
  };

  const handleChange = (field: keyof AdvertiserFormData, value: string | boolean | Date | null) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const newAdvertiser = {
        name: localData.Name ?? "Unnamed",
        lastUpdate: new Date().toISOString(),
        totalRecords: 0,
        history: "0 days",
        customFeeds: !!localData.FeatureDisplay ? 1 : 0,
        videoTemplates: !!localData.FeatureVideo ? 1 : 0,
        videoAdVersions: !!localData.FeatureSearch ? 1 : 0,
        hasAds: !!localData.Status,
        dba: localData.DBA || '',
        status: !!localData.Status,
        website: localData.Website || '',
        addresses: localData.Address
          ? [{
              country: 'USA',
              address: localData.Address || '',
              city: localData.City || '',
              state: localData.State || '',
              zip: localData.Zip || '',
            }]
          : [],
        phone: localData.Phone || '',
        gmb: localData.GMB || '',
        placeId: localData.GooglePlaceId || '',
        responsible: localData.Responsible || '',
        deactivationDate: undefined,
        createdAt: new Date().toISOString(),
        FeatureDisplay: !!localData.FeatureDisplay,
        FeatureDisplayDate: localData.FeatureDisplayDate || '',
        FeatureVideo: !!localData.FeatureVideo,
        FeatureVideoDate: localData.FeatureVideoDate || '',
        FeatureSearch: !!localData.FeatureSearch,
        FeatureSearchDate: localData.FeatureSearchDate || '',
        // Dynamic Display Feeds fields
        GTMAccountId: localData.GTMAccountId || '',
        GTMContainerId: localData.GTMContainerId || '',
        ManualGTMPrivileges: !!localData.ManualGTMPrivileges,
        FacebookPixelId: localData.FacebookPixelId || '',
        GoogleAdsConversionId: localData.GoogleAdsConversionId || '',
        BingRemarketingId: localData.BingRemarketingId || '',
        RequestScriptInstall: !!localData.RequestScriptInstall,
        // Google Ads Integration fields
        GoogleAdsCustomerId: localData.GoogleAdsCustomerId || '',
        GoogleAdsCustomerId2: localData.GoogleAdsCustomerId2 || '',
        AdCustomizersEnabled: !!localData.GoogleAdCustomizersEnabled || !!localData.FacebookAdCustomizersEnabled,
        AdCustomizersDeactivationDate: localData.GoogleAdCustomizersDeactivationDate || localData.FacebookAdCustomizersDeactivationDate || '',
        GoogleAdCustomizersEnabled: !!localData.GoogleAdCustomizersEnabled,
        GoogleAdCustomizersDeactivationDate: localData.GoogleAdCustomizersDeactivationDate || '',
        FacebookAdCustomizersEnabled: !!localData.FacebookAdCustomizersEnabled,
        FacebookAdCustomizersDeactivationDate: localData.FacebookAdCustomizersDeactivationDate || '',
        // Special Requests fields
        AdditionalNotes: localData.AdditionalNotes || '',
        hasWebInventory: false,
      };

      // TODO: Implementar la llamada a Supabase cuando esté disponible
      // const { data, error } = await supabase
      //   .from('advertisers')
      //   .insert([newAdvertiser])
      //   .select()
      //   .single();

      // if (error) throw error;

      // Por ahora, usamos el store local
      addAdvertiser(newAdvertiser);
      
      setAdvertiserData({});
      setLocalData({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving advertiser:', error);
      // TODO: Implementar manejo de errores apropiado
      alert('Error saving advertiser. Please try again.');
    }
  };

  const handleNextStep = () => {
    // Validar campos requeridos en el paso 1
    if (step === 1) {
      const requiredFields = detailsFields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !localData[field.key]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
    }

    let nextStep = step + 1;
    
    // Skip step 3 if FeatureDisplay is not enabled
    if (nextStep === 3 && !localData.FeatureDisplay) {
      nextStep++;
    }
    
    // Skip step 4 if FeatureSearch is not enabled
    if (nextStep === 4 && !localData.FeatureSearch) {
      nextStep++;
    }
    
    setStep(nextStep);
  };

  const handlePrevStep = () => {
    let prevStep = step - 1;
    
    // Skip step 4 if FeatureSearch is not enabled
    if (prevStep === 4 && !localData.FeatureSearch) {
      prevStep--;
    }
    
    // Skip step 3 if FeatureDisplay is not enabled
    if (prevStep === 3 && !localData.FeatureDisplay) {
      prevStep--;
    }
    
    setStep(prevStep);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-[#404042] text-white rounded font-bold hover:bg-[#FAAE3A] active:bg-[#F17625] transition">
          + Advertiser
        </button>
      </DialogTrigger>

      <DialogContent className="w-screen md:max-w-7xl">
        <DialogTitle>Add Advertiser</DialogTitle>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.map((label, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => setStep(idx + 1)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    transition-colors duration-200
                    ${step === idx + 1
                      ? 'bg-[#FAAE3A] text-white shadow-lg'
                      : idx + 1 < step
                        ? 'bg-[#404042] text-white'
                        : 'bg-gray-200 text-gray-500'}
                  `}
                  aria-current={step === idx + 1 ? "step" : undefined}
                >
                  {idx + 1}
                </button>
                <span className={`mt-2 text-xs font-medium ${step === idx + 1 ? 'text-[#FAAE3A]' : 'text-gray-400'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-[#FAAE3A] rounded-full transition-all"
              style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailsFields.map(({ key, label, required, type, options }) => (
                <div key={String(key)}>
                  <Label className="text-sm text-gray-700 font-semibold" htmlFor={String(key)}>
                    {label} {required && <span className="text-red-500">*</span>}
                  </Label>
                  {type === 'select' ? (
                    <select
                      id={String(key)}
                      value={localData[key] as string || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FAAE3A]"
                      required={required}
                    >
                      <option value="">Select {label}</option>
                      {options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={String(key)}
                      value={typeof localData[key] === "string" ? (localData[key] as string) : ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1"
                      required={required}
                    />
                  )}
                </div>
              ))}
            </div>
            <hr className="border-gray-300" />
            <div>
              <Label className="text-sm text-gray-700 font-semibold">Status & Scheduling</Label>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3">
                  <Switch
                    id="Status"
                    checked={Boolean(localData.Status)}
                    onCheckedChange={(v: boolean) => handleChange("Status", v)}
                  />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(d) => {
                      setSelectedDate(d);
                      handleChange("Date", d?.toISOString() || "");
                    }}
                    customInput={
                      <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-[#404042]">
                        <CalendarIcon className="h-4 w-4" />
                        {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-6 text-[#404042]">
            {featureFields.map(({ key, label }) => {
              const dateKey = `${key}Date` as keyof AdvertiserFormData;
              return (
                <div
                  key={key}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-4"
                >
                  <Label
                    className="text-center font-semibold w-full md:w-1/3"
                    title={tooltips[key]}
                  >
                    {label}
                  </Label>
                  <div className="flex items-center gap-3 justify-center w-full md:w-2/3">
                    <Switch
                      id={key}
                      checked={Boolean(localData[key])}
                      onCheckedChange={(v: boolean) => {
                        handleChange(key, v);
                        if (!v) handleChange(dateKey, "");
                      }}
                    />
                    <DatePicker
                      disabled={!localData[key]}
                      selected={localData[dateKey] ? new Date(localData[dateKey] as string) : null}
                      onChange={(d) => handleChange(dateKey, d?.toISOString() || "")}
                      customInput={
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 text-[#404042]"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {localData[dateKey]
                            ? new Date(localData[dateKey] as string).toLocaleDateString()
                            : "Select Date"}
                        </Button>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && localData.FeatureDisplay && (
          <DynamicDisplayFeeds advertiser={localData} onChange={setLocalData} />
        )}

        {step === 4 && localData.FeatureSearch && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-[#404042] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="GoogleAdsCustomerId" className="block font-semibold">Google Ads Customer ID</Label>
                <Input
                  id="GoogleAdsCustomerId"
                  value={localData.GoogleAdsCustomerId || ""}
                  onChange={(e) => handleChange("GoogleAdsCustomerId", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="GoogleAdsCustomerId2" className="block font-semibold">Google Ads Customer ID #2</Label>
                <Input
                  id="GoogleAdsCustomerId2"
                  value={localData.GoogleAdsCustomerId2 || ""}
                  onChange={(e) => handleChange("GoogleAdsCustomerId2", e.target.value)}
                />
              </div>
            </div>

            {/* Ad Customizer Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#404042]">Ad Customizer Configuration</h3>
              
              {/* Google Ads Ad Customizer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="GoogleAdCustomizersEnabled"
                      checked={Boolean(localData.GoogleAdCustomizersEnabled)}
                      onCheckedChange={(v: boolean) => {
                        handleChange("GoogleAdCustomizersEnabled", v);
                        if (!v) handleChange("GoogleAdCustomizersDeactivationDate", "");
                      }}
                    />
                    <Label htmlFor="GoogleAdCustomizersEnabled" className="font-semibold">Google Ads Ad Customizer</Label>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-[#404042]"
                    onClick={() => {
                      alert("Download Google Ads starter file not implemented yet.");
                    }}
                  >
                    <span>Responsive Search Ads</span>
                  </Button>
                  <div className="relative group">
                    <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer text-xs">i</div>
                    <div className="absolute left-0 mt-2 w-72 bg-blue-100 text-sm text-blue-900 p-4 rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      Google Ad Customizers allow search ads to be updated on a regular basis with the count and minimum price attributes within an expanded text ad.
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Label htmlFor="GoogleAdCustomizersDeactivationDate" className="block font-semibold">Deactivation Date</Label>
                  <DatePicker
                    disabled={!localData.GoogleAdCustomizersEnabled}
                    selected={
                      localData.GoogleAdCustomizersDeactivationDate
                        ? new Date(localData.GoogleAdCustomizersDeactivationDate as string)
                        : null
                    }
                    onChange={(d) => handleChange("GoogleAdCustomizersDeactivationDate", d?.toISOString() || "")}
                    customInput={
                      <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-[#404042]">
                        <CalendarIcon className="h-4 w-4" />
                        {localData.GoogleAdCustomizersDeactivationDate
                          ? new Date(localData.GoogleAdCustomizersDeactivationDate).toLocaleDateString()
                          : "Select Date"}
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Facebook Ads Ad Customizer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="FacebookAdCustomizersEnabled"
                      checked={Boolean(localData.FacebookAdCustomizersEnabled)}
                      onCheckedChange={(v: boolean) => {
                        handleChange("FacebookAdCustomizersEnabled", v);
                        if (!v) handleChange("FacebookAdCustomizersDeactivationDate", "");
                      }}
                    />
                    <Label htmlFor="FacebookAdCustomizersEnabled" className="font-semibold">Facebook Ads Ad Customizer</Label>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-[#404042]"
                    onClick={() => {
                      alert("Download Facebook Ads starter file not implemented yet.");
                    }}
                  >
                    <span>Dynamic Ads</span>
                  </Button>
                  <div className="relative group">
                    <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer text-xs">i</div>
                    <div className="absolute left-0 mt-2 w-72 bg-blue-100 text-sm text-blue-900 p-4 rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      Facebook Dynamic Ads allow you to automatically promote your inventory to people who have expressed interest in your products.
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Label htmlFor="FacebookAdCustomizersDeactivationDate" className="block font-semibold">Deactivation Date</Label>
                  <DatePicker
                    disabled={!localData.FacebookAdCustomizersEnabled}
                    selected={
                      localData.FacebookAdCustomizersDeactivationDate
                        ? new Date(localData.FacebookAdCustomizersDeactivationDate as string)
                        : null
                    }
                    onChange={(d) => handleChange("FacebookAdCustomizersDeactivationDate", d?.toISOString() || "")}
                    customInput={
                      <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-[#404042]">
                        <CalendarIcon className="h-4 w-4" />
                        {localData.FacebookAdCustomizersDeactivationDate
                          ? new Date(localData.FacebookAdCustomizersDeactivationDate).toLocaleDateString()
                          : "Select Date"}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-[#404042] space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#404042] mb-4">Special Requests & Notes</h3>
              <div className="space-y-6">
                {/* Additional Notes */}
                <div className="space-y-4">
                  <Label className="block font-semibold">Additional Notes</Label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FAAE3A]"
                    placeholder="Add any additional notes or special requirements..."
                    value={localData.AdditionalNotes || ""}
                    onChange={(e) => handleChange("AdditionalNotes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          )}
          {step < stepLabels.length ? (
            <Button
              onClick={handleNextStep}
              className="bg-[#404042] text-white font-bold hover:bg-[#FAAE3A] active:bg-[#F17625]"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              className="bg-[#404042] text-white font-bold hover:bg-[#FAAE3A] active:bg-[#F17625]"
            >
              Save Advertiser
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
