import * as React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Advertiser } from "@/types/advertiser";

interface Props {
  advertiser: Partial<Advertiser>;
  onChange: (adv: Partial<Advertiser>) => void;
}

export function GoogleAdsIntegration({ advertiser, onChange }: Props) {
  const adCustomizersEnabled = !!advertiser.AdCustomizersEnabled;
  const deactivationDate = advertiser.AdCustomizersDeactivationDate ? new Date(advertiser.AdCustomizersDeactivationDate) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-8">
      {/* Google Ads IDs */}
      <div>
        <h3 className="text-lg font-bold text-[#404042] mb-4">Google Ads Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Google Ads Customer ID</label>
            <Input
              value={advertiser.GoogleAdsCustomerId || ""}
              onChange={e => onChange({ ...advertiser, GoogleAdsCustomerId: e.target.value })}
              placeholder="Google Ads Customer ID"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Google Ads Customer ID #2</label>
            <Input
              value={advertiser.GoogleAdsCustomerId2 || ""}
              onChange={e => onChange({ ...advertiser, GoogleAdsCustomerId2: e.target.value })}
              placeholder="Google Ads Customer ID #2"
            />
          </div>
        </div>
      </div>

      {/* Campaigns & Auth */}
      <div>
        <h3 className="text-lg font-bold text-[#404042] mb-2">Campaigns</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Campaigns</span>
            <span className="text-green-600 font-bold">●</span>
            <span className="text-sm">1 Eligible campaigns - </span>
            <a href="#" className="text-blue-600 underline text-sm">Show Campaigns</a>
          </div>
          <Button variant="secondary" className="text-blue-700 border-blue-300" type="button">
            Re-Authenticate
          </Button>
        </div>
      </div>

      {/* Ad Customizers & Download */}
      <div>
        <h3 className="text-lg font-bold text-[#404042] mb-2">Ad Customizers & Scheduling</h3>
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <div className="flex items-center gap-3">
            <Switch
              checked={adCustomizersEnabled}
              onCheckedChange={checked => onChange({ ...advertiser, AdCustomizersEnabled: checked })}
            />
            <span className="font-semibold">Ad Customizers</span>
            <span className={`ml-2 text-xs px-2 py-1 rounded-full border font-medium ${adCustomizersEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{adCustomizersEnabled ? 'Active' : 'Inactive'}</span>
            {adCustomizersEnabled && (
              <div className="flex items-center gap-2 ml-6">
                <span className="text-sm font-medium">Deactivation date</span>
                <DatePicker
                  selected={deactivationDate}
                  onChange={date => onChange({ ...advertiser, AdCustomizersDeactivationDate: date ? date.toISOString().slice(0, 10) : "" })}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="dd/mm/aaaa"
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-36"
                  disabled={!adCustomizersEnabled}
                  showPopperArrow={false}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <Button variant="outline" className="flex items-center gap-2 text-blue-700 border-blue-300 px-5 py-2 text-base font-semibold shadow-sm" type="button">
              <Download className="w-5 h-5" />
              Download Responsive Search Ads
            </Button>
            <span className="text-xs text-gray-500">Export your current Responsive Search Ads as CSV</span>
          </div>
        </div>
      </div>
    </div>
  );
} 