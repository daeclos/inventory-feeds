"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdvertiserStore } from "../store";
import { STEPS } from "@/constants/steps";
import { CORPORATE_COLORS } from "@/constants/colors";
import { AdvertiserDetails } from "./components/AdvertiserDetails";
import { Features } from "./components/Features";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/layout/Stepper";

export default function AdvertiserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const advertiserId = params.id as string;

  // Zustand
  const getAdvertiserById = useAdvertiserStore(state => state.getAdvertiserById);
  const updateAdvertiser = useAdvertiserStore(state => state.updateAdvertiser);
  const adv = getAdvertiserById(advertiserId);

  // Estado local editable
  const [advertiser, setAdvertiser] = useState(adv);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setAdvertiser(adv);
  }, [adv]);

  if (!advertiser) {
    return <div className="p-8 text-center text-xl">Advertiser not found</div>;
  }

  const handleSave = () => {
    updateAdvertiser(advertiser.id, advertiser);
    alert("Advertiser updated!");
    router.push("/dashboard/advertisers");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold" style={{ color: CORPORATE_COLORS.dark }}>
        {advertiser.name}
      </h1>
      <Stepper
        steps={STEPS}
        currentStep={step}
        onStepClick={setStep}
      />
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        {step === 0 && (
          <AdvertiserDetails
            advertiser={advertiser}
            onChange={setAdvertiser}
          />
        )}
        {step === 1 && (
          <Features
            advertiser={advertiser}
            onChange={setAdvertiser}
          />
        )}
        {/* Add other steps here */}
      </div>
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
} 