import { Input } from "@/components/ui/input";
import { Advertiser } from "@/types/advertiser";

interface AdvertiserDetailsProps {
  advertiser: Advertiser;
  onChange: (advertiser: Advertiser) => void;
}

export function AdvertiserDetails({ advertiser, onChange }: AdvertiserDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Name"
        value={advertiser.name}
        onChange={e => onChange({ ...advertiser, name: e.target.value })}
        placeholder="Advertiser Name"
      />
      <Input
        label="Advertiser DBA"
        value={advertiser.dba || ""}
        onChange={e => onChange({ ...advertiser, dba: e.target.value })}
        placeholder="DBA"
      />
      <div className="col-span-1 md:col-span-2 flex items-end gap-8">
        <div className="flex flex-col items-start">
          <label className="block mb-1 font-semibold">Status</label>
          <input
            type="checkbox"
            checked={!!advertiser.status}
            onChange={e => onChange({ ...advertiser, status: e.target.checked })}
            className="w-6 h-6 accent-[#FAAE3A] mr-2"
          />
          <span className="ml-2">{advertiser.status ? "Active" : "Inactive"}</span>
        </div>
      </div>
      <Input
        label="Website"
        value={advertiser.website || ""}
        onChange={e => onChange({ ...advertiser, website: e.target.value })}
        placeholder="Website"
      />
      <Input
        label="Addresses"
        value={advertiser.addresses?.[0]?.address || ""}
        onChange={e => onChange({
          ...advertiser,
          addresses: [{
            address: e.target.value,
            country: advertiser.addresses?.[0]?.country || '',
            city: advertiser.addresses?.[0]?.city || '',
            state: advertiser.addresses?.[0]?.state || '',
            zip: advertiser.addresses?.[0]?.zip || '',
            email: advertiser.addresses?.[0]?.email || ''
          }]
        })}
        placeholder="Address"
      />
      <Input
        label="Advertiser Phone"
        value={advertiser.phone || ""}
        onChange={e => onChange({ ...advertiser, phone: e.target.value })}
        placeholder="Phone"
      />
      <Input
        label="GMB Store Code"
        value={advertiser.gmb || ""}
        onChange={e => onChange({ ...advertiser, gmb: e.target.value })}
        placeholder="GMB Store Code"
      />
      <Input
        label="Google Place ID"
        value={advertiser.placeId || ""}
        onChange={e => onChange({ ...advertiser, placeId: e.target.value })}
        placeholder="Google Place ID"
      />
      <div className="md:col-span-2">
        <Input
          label="Responsible User"
          value={advertiser.responsible || ""}
          onChange={e => onChange({ ...advertiser, responsible: e.target.value })}
          placeholder="Responsible User"
        />
      </div>
    </div>
  );
} 