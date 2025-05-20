import * as React from "react";
import { Input } from "@/components/ui/input";
import type { Advertiser } from "@/types/advertiser";

interface Props {
  advertiser: Partial<Advertiser>;
  onChange: (adv: Partial<Advertiser>) => void;
}

export function DynamicDisplayFeeds({ advertiser, onChange }: Props) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-blue-50/30">
      <h3 className="text-lg font-bold text-#f27724ff-700 mb-1">Request installation of dynamic remarketing tags:</h3>
      <p className="text-sm text-#f27724ff-500 mb-6">
        OPTIONAL: If you would like Support to handle the installation of dynamic remarketing tags, please provide the additional information below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block font-semibold mb-1">GTM Account ID</label>
          <Input
            value={advertiser.GTMAccountId || ""}
            onChange={e => onChange({ ...advertiser, GTMAccountId: e.target.value })}
            placeholder="GTM Account ID"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">GTM Container ID</label>
          <Input
            value={advertiser.GTMContainerId || ""}
            onChange={e => onChange({ ...advertiser, GTMContainerId: e.target.value })}
            placeholder="GTM Container ID"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2 mb-4 mt-2">
          <label className="block font-semibold mb-1 mr-2">GTM Privileges</label>
          <span className="text-sm text-gray-700 font-semibold mr-2">No GTM Access!</span>
          <a href="#" className="text-blue-600 underline">Authenticate Now.</a>
        </div>
        <div>
          <label className="block font-semibold mb-1">Facebook Pixel ID</label>
          <Input
            value={advertiser.FacebookPixelId || ""}
            onChange={e => onChange({ ...advertiser, FacebookPixelId: e.target.value })}
            placeholder="Facebook Pixel ID"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Google Ads Conversion ID</label>
          <Input
            value={advertiser.GoogleAdsConversionId || ""}
            onChange={e => onChange({ ...advertiser, GoogleAdsConversionId: e.target.value })}
            placeholder="Google Ads Conversion ID"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bing Remarketing ID</label>
          <Input
            value={advertiser.BingRemarketingId || ""}
            onChange={e => onChange({ ...advertiser, BingRemarketingId: e.target.value })}
            placeholder="Bing Remarketing ID"
          />
        </div>
      </div>
    </div>
  );
} 