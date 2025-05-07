import { CORPORATE_COLORS } from "@/constants/colors";
import { Advertiser } from "@/types/advertiser";

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
            <span className="absolute left-6 top-0 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Proporciona un feed de inventario actualizado diariamente para campañas de remarketing dinámico en Google y Facebook.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!advertiser.FeatureDisplay}
            onChange={e => onChange({ ...advertiser, FeatureDisplay: e.target.checked })}
            className="w-6 h-6 accent-[#FAAE3A]"
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
            <span className="absolute left-6 top-0 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Permite la creación de anuncios de video con contenido dinámico basado en inventario.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!advertiser.FeatureVideo}
            onChange={e => onChange({ ...advertiser, FeatureVideo: e.target.checked })}
            className="w-6 h-6 accent-[#FAAE3A]"
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
            <span className="absolute left-6 top-0 z-10 w-56 bg-[#FFF3D1] text-[#404042] text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Conecta con Google Ads y actualiza grupos de anuncios según el inventario diario.
            </span>
          </span>
        </span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!advertiser.FeatureSearch}
            onChange={e => onChange({ ...advertiser, FeatureSearch: e.target.checked })}
            className="w-6 h-6 accent-[#FAAE3A]"
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