"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAdvertiserStore } from "../store";
import { STEPS } from "@/constants/steps";
import { CORPORATE_COLORS } from "@/constants/colors";
import { AdvertiserDetails } from "./components/AdvertiserDetails";
import { Features } from "./components/Features";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/layout/Stepper";
import { DynamicDisplayFeeds } from "./components/DynamicDisplayFeeds";
import { GoogleAdsIntegration } from "./components/GoogleAdsIntegration";
import { AdvertiserTabs } from "./components/AdvertiserTabs";
import DashboardLayout from '@/components/ui/DashboardLayout';
import { GoogleAdsStatusReports } from "./components/GoogleAdsStatusReports";
import { SearchTemplates } from "./components/SearchTemplates";
import { InventoryFeeds } from "./components/InventoryFeeds";
import { VideoAds } from "./components/VideoAds";
import { Advertiser } from "@/types/advertiser";

export default function AdvertiserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const advertiserId = params.id as string;

  // Zustand
  const getAdvertiserById = useAdvertiserStore(state => state.getAdvertiserById);
  const updateAdvertiser = useAdvertiserStore(state => state.updateAdvertiser);
  const adv = getAdvertiserById(advertiserId);

  // Estado local editable
  const [advertiser, setAdvertiser] = useState(adv);
  const [step, setStep] = useState(0);

  // Determinar tab activo
  const tab = searchParams.get("tab") || "settings";

  useEffect(() => {
    setAdvertiser(adv);
  }, [adv]);

  // Nuevo: sincronizar el step con el parámetro de la URL
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam && !isNaN(Number(stepParam))) {
      setStep(Number(stepParam));
    }
  }, [searchParams]);

  if (!advertiser) {
    return <div className="p-8 text-center text-xl">Advertiser not found</div>;
  }

  const handleSave = () => {
    updateAdvertiser(advertiser.id, advertiser);
    alert("Advertiser updated!");
    router.push("/dashboard/advertisers");
  };

  const handleAdvertiserChange = (updates: Partial<Advertiser>) => {
    if (advertiser) {
      setAdvertiser({ ...advertiser, ...updates });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold mb-2" style={{ color: CORPORATE_COLORS.dark }}>
          {advertiser.name}
        </h1>
        {/* CMS, ID y Token en la parte superior derecha */}
        <div className="absolute right-0 top-0 flex flex-col items-end gap-1 text-xs text-gray-500">
          <div>
            <span className="font-semibold text-[#2A6BE9]">CMS:</span> <span>{(advertiser as any)?.cms || "-"}</span>
          </div>
          <div>
            <span className="font-semibold">ID:</span> <span>{advertiser.id || "-"}</span> <span className="ml-2 font-semibold">Token:</span> <span>{(advertiser as any)?.token || "-"}</span>
          </div>
        </div>
        {/* Aquí se mostrarán CMS, ID y Token cuando se integren desde la base de datos */}
        <div className="border-b border-gray-200 mb-4" />
        {/* Tabs de navegación estilo Hoot Interactive */}
        <AdvertiserTabs currentStep={step} stepLabel={STEPS[step]?.label} />
        <div className="border-b border-gray-100 mb-8" />
        {tab === "settings" && (
          <>
            <Stepper
              steps={STEPS}
              currentStep={step}
              onStepClick={setStep}
            />
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              {step === 0 && (
                <AdvertiserDetails
                  advertiser={advertiser}
                  onChange={handleAdvertiserChange}
                />
              )}
              {step === 1 && (
                <Features
                  advertiser={advertiser}
                  onChange={handleAdvertiserChange}
                />
              )}
              {step === 2 && (
                <DynamicDisplayFeeds
                  advertiser={advertiser}
                  onChange={handleAdvertiserChange}
                />
              )}
              {step === 3 && (
                <GoogleAdsIntegration
                  advertiser={advertiser}
                  onChange={handleAdvertiserChange}
                />
              )}
            </div>
            <div className="flex justify-end mt-8">
              <Button onClick={handleSave}>
                Save changes
              </Button>
            </div>
          </>
        )}
        {tab === "google-ads-status" && <GoogleAdsStatusReports />}
        {tab === "search-templates" && <SearchTemplates advertiser={advertiser} />}
        {tab === "inventory-feeds" && <InventoryFeeds />}
        {tab === "video-ads" && <VideoAds />}
      </div>
    </DashboardLayout>
  );
} 