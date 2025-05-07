"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AdvertiserFormData } from "@/types/advertiser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
  advertiserData: AdvertiserFormData;
  setAdvertiserData: (val: AdvertiserFormData) => void;
  setAdvertisers: (val: any) => void;
};

export default function AddAdvertiserModal({
  isDialogOpen,
  setIsDialogOpen,
  advertiserData,
  setAdvertiserData,
  setAdvertisers,
}: Props) {
  const [localData, setLocalData] = useState<AdvertiserFormData>(advertiserData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    advertiserData.Date ? new Date(advertiserData.Date) : null
  );
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isDialogOpen) return;
    setLocalData(advertiserData);
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

  const detailsFields: { key: keyof AdvertiserFormData; label: string }[] = [
    { key: "Name", label: "Name" },
    { key: "DBA", label: "Advertiser DBA" },
    { key: "Website", label: "Website" },
    { key: "Country", label: "Country" },
    { key: "Address", label: "Address" },
    { key: "City", label: "City" },
    { key: "State", label: "State" },
    { key: "Zip", label: "Zip" },
    { key: "Phone", label: "Advertiser Phone" },
    { key: "GMB", label: "GMB Store Code" },
    { key: "GooglePlaceId", label: "Google Place ID" },
    { key: "Category", label: "Category" },
    { key: "Responsible", label: "Responsible User" },
  ];

  const featureFields = [
    { key: "FeatureDisplay", label: "Dynamic Display Feeds" },
    { key: "FeatureVideo", label: "Dynamic Video Ads" },
    { key: "FeatureSearch", label: "Google Ads Search Integration" },
  ] as const;

  const handleChange = (field: keyof AdvertiserFormData, value: any) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const newAdv = {
      name: localData.Name ?? "Unnamed",
      lastUpdate: new Date().toLocaleString(),
      totalRecords: 0,
      history: "0 days",
      customFeeds: localData.FeatureDisplay ? 1 : 0,
      videoTemplates: localData.FeatureVideo ? 1 : 0,
      videoAdVersions: localData.FeatureSearch ? 1 : 0,
      hasAds: !!localData.Status,
    };

    setAdvertisers((prev: any) => [...prev, newAdv]);
    setAdvertiserData({});
    setLocalData({});
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-[#404042] text-white rounded font-bold hover:bg-[#FAAE3A] active:bg-[#F17625] transition">
          + Advertiser
        </button>
      </DialogTrigger>

      <DialogContent className="w-screen md:max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#404042]">{stepLabels[step - 1]}</h2>
          <div className="flex items-center gap-6 flex-wrap">
            {stepLabels.map((lbl, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setStep(idx + 1)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                    step === idx + 1 ? "bg-[#404042] text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    step === idx + 1 ? "text-[#404042]" : "text-gray-600"
                  }`}
                >
                  {lbl}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 1 */}
        {step === 1 && (
          <div className="space-y-4">
            {detailsFields.map(({ key, label }) => (
              <div key={String(key)} className="flex items-center gap-6">
                <Label className="w-60 text-base font-medium" htmlFor={String(key)}>
                  {label}
                </Label>
                <Input
                  id={String(key)}
                  value={typeof localData[key] === "string" ? (localData[key] as string) : ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
            <div className="flex items-center gap-6">
              <Label className="w-60 text-base font-medium">Status & Scheduling</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="Status"
                  checked={Boolean(localData.Status)}
                  onCheckedChange={(v) => handleChange("Status", v)}
                />
                <DatePicker
                  selected={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    handleChange("Date", d?.toISOString() || "");
                  }}
                  customInput={
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="space-y-5 text-[#404042]">
            {featureFields.map(({ key, label }) => {
              const dateKey = `${key}Date` as keyof AdvertiserFormData;
              return (
                <div key={key} className="flex items-center justify-between gap-6">
                  <Label className="text-base font-medium" htmlFor={key}>
                    {label}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      id={key}
                      checked={Boolean(localData[key])}
                      onCheckedChange={(v) => handleChange(key, v)}
                    />
                    <DatePicker
                      selected={localData[dateKey] ? new Date(localData[dateKey] as string) : null}
                      onChange={(d) => handleChange(dateKey, d?.toISOString() || "")}
                      customInput={
                        <Button variant="outline" className="flex items-center gap-2">
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

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < stepLabels.length ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
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
