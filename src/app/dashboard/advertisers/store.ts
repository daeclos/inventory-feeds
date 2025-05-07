import { create } from 'zustand';
import { Advertiser } from '@/types/advertiser';

interface AdvertiserStore {
  advertisers: Advertiser[];
  addAdvertiser: (adv: Advertiser) => void;
  updateAdvertiser: (id: string, data: Partial<Advertiser>) => void;
  getAdvertiserById: (id: string) => Advertiser | undefined;
}

export const useAdvertiserStore = create<AdvertiserStore>((set, get) => ({
  advertisers: [],
  addAdvertiser: (adv) => set(state => ({ advertisers: [...state.advertisers, adv] })),
  updateAdvertiser: (id, data) => set(state => ({
    advertisers: state.advertisers.map(a => a.id === id ? { ...a, ...data } : a)
  })),
  getAdvertiserById: (id) => get().advertisers.find(a => a.id === id),
})); 