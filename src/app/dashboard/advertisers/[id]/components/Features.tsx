import { Advertiser } from "@/types/advertiser";
import { Switch } from "@/components/ui/switch";

interface FeaturesProps {
  advertiser: Advertiser;
  onChange: (advertiser: Advertiser) => void;
}

export function Features({ advertiser, onChange }: FeaturesProps) {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Dynamic Display Feeds */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg flex items-center gap-2">
          Dynamic Display Feeds
          <span className="relative group">
            <span className="ml-1 text-[#FAAE3A] cursor-pointer">ⓘ</span>
            <span className="absolute left-0 top-full mt-2 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Provides a daily updated inventory feed for Google and Facebook dynamic remarketing campaigns.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!advertiser.FeatureDisplay}
            onCheckedChange={checked => onChange({ ...advertiser, FeatureDisplay: checked })}
          />
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 ml-2"
            value={advertiser.FeatureDisplayDate || ""}
            onChange={e => onChange({ ...advertiser, FeatureDisplayDate: e.target.value })}
            disabled={!advertiser.FeatureDisplay}
          />
        </div>
      </div>

      {/* Dynamic Video Ads */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg flex items-center gap-2">
          Dynamic Video Ads
          <span className="relative group">
            <span className="ml-1 text-[#FAAE3A] cursor-pointer">ⓘ</span>
            <span className="absolute left-0 top-full mt-2 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Enables video ad creation with dynamic content based on inventory.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!advertiser.FeatureVideo}
            onCheckedChange={checked => onChange({ ...advertiser, FeatureVideo: checked })}
          />
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 ml-2"
            value={advertiser.FeatureVideoDate || ""}
            onChange={e => onChange({ ...advertiser, FeatureVideoDate: e.target.value })}
            disabled={!advertiser.FeatureVideo}
          />
        </div>
      </div>

      {/* Google Ads Search Integration */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg flex items-center gap-2">
          Google Ads Search Integration
          <span className="relative group">
            <span className="ml-1 text-[#FAAE3A] cursor-pointer">ⓘ</span>
            <span className="absolute left-0 top-full mt-2 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Connects to Google Ads and updates ad groups based on daily inventory.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!advertiser.FeatureSearch}
            onCheckedChange={checked => onChange({ ...advertiser, FeatureSearch: checked })}
          />
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 ml-2"
            value={advertiser.FeatureSearchDate || ""}
            onChange={e => onChange({ ...advertiser, FeatureSearchDate: e.target.value })}
            disabled={!advertiser.FeatureSearch}
          />
        </div>
      </div>
    </div>
  );
} 