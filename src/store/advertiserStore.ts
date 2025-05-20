import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Advertiser } from "@/types/advertiser";

interface AdvertiserStore {
  advertisers: Advertiser[];
  setAdvertisers: (advertisers: Advertiser[]) => void;
  addAdvertiser: (advertiser: Advertiser) => void;
  updateAdvertiser: (id: string, advertiser: Partial<Advertiser>) => void;
  deleteAdvertiser: (id: string) => void;
  getAdvertiserById: (id: string) => Advertiser | undefined;
  updateAdvertiserStatus: (id: string, status: boolean) => void;
}

export const useAdvertiserStore = create<AdvertiserStore>()(
  persist(
    (set, get) => ({
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
      getAdvertiserById: (id) => get().advertisers.find(a => a.id === id),
      updateAdvertiserStatus: (id, status) =>
        set((state) => ({
          advertisers: state.advertisers.map(a => a.id === id ? { ...a, status } : a)
        })),
    }),
    { name: "advertisers" }
  )
); 