import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { TemplateFormState } from "./types";
import { useAdvertiserStore } from '@/store/advertiserStore';

interface TemplateInformationProps {
  form: TemplateFormState;
  onFormChange: (field: keyof TemplateFormState, value: any) => void;
  onMakeFilterChange: (value: string[]) => void;
  libraries: string[];
  makes: string[];
  advertisers: { id: string; name: string; status: boolean }[];
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
  makeDropdownOpen: boolean;
  setMakeDropdownOpen: (open: boolean) => void;
}

export function TemplateInformation({
  form,
  onFormChange,
  onMakeFilterChange,
  libraries,
  makes,
  advertisers,
  showTooltip,
  setShowTooltip,
  makeDropdownOpen,
  setMakeDropdownOpen,
}: TemplateInformationProps) {
  return (
    <div className="bg-white border border-[#FAAE3A]/30 rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#404042' }}>Template Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex flex-col gap-4">
          <label className="font-semibold text-[#404042]">Template Name</label>
          <input 
            className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" 
            value={form.templateName} 
            onChange={e => onFormChange('templateName', e.target.value)} 
          />
          <label className="font-semibold text-[#404042]">Advertiser</label>
          <select 
            className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" 
            value={form.advertiser} 
            onChange={e => onFormChange('advertiser', e.target.value)}
          >
            <option value="">Select advertiser</option>
            {advertisers.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
          <label className="font-semibold text-[#404042]">Location</label>
          <input 
            className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" 
            value={form.location} 
            onChange={e => onFormChange('location', e.target.value)} 
          />
          <label className="font-semibold text-[#404042]">Library</label>
          <select 
            className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" 
            value={form.library} 
            onChange={e => onFormChange('library', e.target.value)}
          >
            {libraries.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-4">
          <label className="font-semibold text-[#404042]">Use Only Products Added Since...</label>
          <input 
            type="date" 
            className="w-full min-w-0 border border-gray-300 rounded px-3 py-2" 
            value={form.date} 
            onChange={e => onFormChange('date', e.target.value)} 
          />
          <label className="font-semibold text-[#404042]">Make Filter</label>
          <DropdownMenu open={makeDropdownOpen} onOpenChange={setMakeDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                type="button" 
                className="w-full min-w-0 border border-gray-300 rounded px-3 py-2 text-left bg-white flex flex-wrap gap-1 min-h-[40px] items-center relative"
              >
                {form.makeFilter.length === 0 ? (
                  <span className="text-gray-400">Nothing selected</span>
                ) : (
                  form.makeFilter.map((make: string) => (
                    <span 
                      key={make} 
                      className="bg-[#FAAE3A]/20 border border-[#FAAE3A] text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1"
                    >
                      {make}
                      <button 
                        type="button" 
                        className="ml-1 text-[#F17625] hover:text-[#FAAE3A]" 
                        onClick={e => { 
                          e.stopPropagation(); 
                          onMakeFilterChange(form.makeFilter.filter((m: string) => m !== make)); 
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
                <ChevronDown 
                  className={`ml-auto transition-transform ${makeDropdownOpen ? 'rotate-180' : ''}`} 
                  size={18} 
                  style={{ color: '#404042' }} 
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto w-64 bg-white border border-[#FAAE3A]">
              {makes.map((make: string) => (
                <DropdownMenuCheckboxItem
                  key={make}
                  checked={form.makeFilter.includes(make)}
                  onCheckedChange={(checked) => {
                    onMakeFilterChange(
                      checked 
                        ? [...form.makeFilter, make]
                        : form.makeFilter.filter((m: string) => m !== make)
                    );
                  }}
                  className="data-[state=checked]:bg-[#FAAE3A] data-[state=checked]:text-[#404042] hover:bg-[#FFF3D1] text-[#404042]"
                >
                  {make}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <label className="font-semibold text-[#404042]">Year Range</label>
          <div className="flex gap-2">
            <input 
              className="w-1/2 min-w-0 border border-gray-300 rounded px-3 py-2" 
              placeholder="Year Start" 
              value={form.yearStart} 
              onChange={e => onFormChange('yearStart', e.target.value)} 
            />
            <input 
              className="w-1/2 min-w-0 border border-gray-300 rounded px-3 py-2" 
              placeholder="End Year" 
              value={form.yearEnd} 
              onChange={e => onFormChange('yearEnd', e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              checked={form.authorize} 
              onChange={e => onFormChange('authorize', e.target.checked)} 
            />
            <span className="text-[#404042] text-sm">
              I authorize Hoot support to revise Final URLs in ads within "Eligible Campaigns" in the event where clearly incorrect URLs are misspending the campaign budget
              <span className="inline-block align-middle ml-1 relative">
                <Info 
                  size={16} 
                  className="text-[#2A6BE9] cursor-pointer" 
                  onMouseEnter={() => setShowTooltip(true)} 
                  onMouseLeave={() => setShowTooltip(false)} 
                />
                {showTooltip && (
                  <span className="absolute left-6 top-0 bg-[#404042] text-white text-xs rounded px-3 py-2 z-50 w-96 shadow-lg">
                    Example: An incorrect URL like advertiserdomain.com/vehicles/?makkkke=Honda is clearly a mistake intended to be: advertiserdomain.com/vehicles/?make=Honda. In this clear situation, Hoot support will update the URLs on behalf of the user.
                  </span>
                )}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.advertiser ? (advertisers.find(a => a.name === form.advertiser)?.status ?? false) : false}
              onCheckedChange={checked => {
                if (!form.advertiser) return;
                const adv = advertisers.find(a => a.name === form.advertiser);
                if (adv && adv.id) {
                  useAdvertiserStore.getState().updateAdvertiserStatus(adv.id, checked);
                }
              }}
            />
            <Label>Active</Label>
          </div>
        </div>
      </div>
    </div>
  );
} 