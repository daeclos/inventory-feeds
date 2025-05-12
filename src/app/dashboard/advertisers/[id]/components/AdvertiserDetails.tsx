import { Input } from "@/components/ui/input";
import { Advertiser } from "@/types/advertiser";
import { Switch } from "@/components/ui/switch";
import { CORPORATE_COLORS } from "@/constants/colors";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

interface AdvertiserDetailsProps {
  advertiser: Advertiser;
  onChange: (advertiser: Advertiser) => void;
}

export function AdvertiserDetails({ advertiser, onChange }: AdvertiserDetailsProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const emptyAddress = {
    country: "USA",
    address: "",
    city: "",
    state: "",
    zip: "",
  };
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [addressError, setAddressError] = useState<string>("");

  const handleAddressSave = () => {
    // Validación de campos obligatorios
    if (!addressForm.country || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.zip) {
      setAddressError("All fields are required.");
      return;
    }
    setAddressError("");
    if (editIndex !== null) {
      // Editar dirección existente
      const updatedAddresses = (advertiser.addresses || []).map((addr, idx) =>
        idx === editIndex ? { ...addressForm } : addr
      );
      onChange({
        ...advertiser,
        addresses: updatedAddresses,
      });
    } else {
      // Agregar nueva dirección
      onChange({
        ...advertiser,
        addresses: [...(advertiser.addresses || []), { ...addressForm }],
      });
    }
    setShowAddressModal(false);
    setAddressForm(emptyAddress);
    setEditIndex(null);
  };

  const openAddressModal = () => {
    setAddressForm(emptyAddress);
    setEditIndex(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (idx: number) => {
    const addr = advertiser.addresses?.[idx];
    if (!addr) return;
    setAddressForm({
      country: addr.country || "USA",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
    });
    setEditIndex(idx);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (idx: number) => {
    const updatedAddresses = (advertiser.addresses || []).filter((_, i) => i !== idx);
    onChange({
      ...advertiser,
      addresses: updatedAddresses,
    });
  };

  return (
    <form className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-8 items-center">
        {/* Name */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Name</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.name}
            onChange={e => onChange({ ...advertiser, name: e.target.value })}
            placeholder="Advertiser Name"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* DBA */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Advertiser DBA</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.dba || ""}
            onChange={e => onChange({ ...advertiser, dba: e.target.value })}
            placeholder="DBA"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* Status */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Status</label>
        <div className="md:col-span-9 flex items-center gap-4">
          <Switch
            checked={!!advertiser.status}
            onCheckedChange={checked => onChange({ ...advertiser, status: checked, hasAds: checked })}
            style={{ background: advertiser.status ? CORPORATE_COLORS.yellow : '#e5e7eb', borderColor: advertiser.status ? CORPORATE_COLORS.orange : '#d1d5db' }}
          />
          <span className="text-sm font-medium text-[#404042]">Active</span>
        </div>
        {/* Website */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Website</label>
        <div className="md:col-span-9 flex gap-2 items-center">
          <Input
            value={advertiser.website || ""}
            onChange={e => onChange({ ...advertiser, website: e.target.value })}
            placeholder="Website"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* Addresses */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Addresses</label>
        <div className="md:col-span-9 flex flex-col gap-1">
          {/* Lista de direcciones agregadas */}
          {Array.isArray(advertiser.addresses) && advertiser.addresses.length > 0 && (
            <div className="mb-2 flex flex-col gap-2">
              {advertiser.addresses.map((addr, idx) => (
                <div key={idx} className="rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-[#404042] flex flex-wrap gap-x-6 gap-y-1 items-center justify-between">
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <span><span className="font-semibold">Country:</span> {addr.country}</span>
                    <span><span className="font-semibold">Address:</span> {addr.address}</span>
                    <span><span className="font-semibold">City:</span> {addr.city}</span>
                    <span><span className="font-semibold">State:</span> {addr.state}</span>
                    <span><span className="font-semibold">ZIP:</span> {addr.zip}</span>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button type="button" title="Edit" onClick={() => handleEditAddress(idx)} className="p-1 rounded hover:bg-[#FAAE3A]/20">
                      <Pencil size={16} className="text-[#404042]" />
                    </button>
                    <button type="button" title="Delete" onClick={() => handleDeleteAddress(idx)} className="p-1 rounded hover:bg-red-100">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={openAddressModal} className="text-xs text-[#2A6BE9] hover:underline w-fit">[Create New]</button>
        </div>
        {/* Phone */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Advertiser Phone</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.phone || ""}
            onChange={e => onChange({ ...advertiser, phone: e.target.value })}
            placeholder="Phone"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* GMB Store Code */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">GMB Store Code</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.gmb || ""}
            onChange={e => onChange({ ...advertiser, gmb: e.target.value })}
            placeholder="GMB Store Code"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* Google Place ID */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Google Place ID</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.placeId || ""}
            onChange={e => onChange({ ...advertiser, placeId: e.target.value })}
            placeholder="Google Place ID"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
        {/* Responsible Users */}
        <label className="md:col-span-3 text-right font-semibold text-[15px] text-[#404042] pr-2">Responsible Users</label>
        <div className="md:col-span-9">
          <Input
            value={advertiser.responsible || ""}
            onChange={e => onChange({ ...advertiser, responsible: e.target.value })}
            placeholder="Responsible User"
            className="focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
          />
        </div>
      </div>

      {/* Modal para crear/editar dirección */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-md">
          <DialogTitle>Save Address</DialogTitle>
          <h2 className="text-2xl font-bold text-[#2A6BE9] text-center mb-4">Save Address</h2>
          {addressError && <div className="text-red-600 text-center mb-2 font-semibold">{addressError}</div>}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Country</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-2"
                value={addressForm.country}
                onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))}
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Address</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                value={addressForm.address}
                onChange={e => setAddressForm(f => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                value={addressForm.city}
                onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">State</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-2"
                value={addressForm.state}
                onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))}
              >
                <option value="">Select State</option>
                <option value="TX">Texas</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
                {/* Agrega más estados según sea necesario */}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">ZIP</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                value={addressForm.zip}
                onChange={e => setAddressForm(f => ({ ...f, zip: e.target.value }))}
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="px-5 py-2 rounded bg-[#FAAE3A] text-white font-semibold hover:bg-[#F17625] transition"
                onClick={handleAddressSave}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
} 