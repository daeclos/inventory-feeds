import { create } from "zustand";
import { Advertiser } from "@/types/advertiser";

interface AdvertiserStore {
  advertisers: Advertiser[];
  setAdvertisers: (advertisers: Advertiser[]) => void;
  addAdvertiser: (advertiser: Advertiser) => void;
  updateAdvertiser: (id: string, advertiser: Partial<Advertiser>) => void;
  deleteAdvertiser: (id: string) => void;
}

export const useAdvertiserStore = create<AdvertiserStore>((set) => ({
  advertisers: [],
  setAdvertisers: (advertisers) => set({ advertisers }),
  addAdvertiser: (advertiser) =>
    set((state) => ({ advertisers: [...state.advertisers, advertiser] })),
  updateAdvertiser: (id, advertiser) =>
    set((state) => ({
      advertisers: state.advertisers.map((a) =>
        a.id === id ? { ...a, ...advertiser } : a
      ),
    })),
  deleteAdvertiser: (id) =>
    set((state) => ({
      advertisers: state.advertisers.filter((a) => a.id !== id),
    })),
})); 