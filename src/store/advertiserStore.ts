import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Advertiser } from "@/types/advertiser";

interface AdvertiserState {
  advertisers: Advertiser[];
  addAdvertiser: (advertiser: Advertiser) => void;
  updateAdvertiser: (id: string, advertiser: Partial<Advertiser>) => void;
  deleteAdvertiser: (id: string) => void;
  setAdvertisers: (advertisers: Advertiser[]) => void;
  getAdvertiserById: (id: string) => Advertiser | undefined;
  updateAdvertiserStatus: (id: string, status: boolean) => void;
}

export const useAdvertiserStore = create<AdvertiserState>()(
  persist(
    (set, get) => ({
      advertisers: [],
      addAdvertiser: (advertiser) => {
        // TODO: Implementar la llamada a Supabase cuando esté disponible
        // const { data, error } = await supabase
        //   .from('advertisers')
        //   .insert([advertiser])
        //   .select()
        //   .single();
        
        // if (error) throw error;
        
        // Por ahora, usamos el store local
        set((state) => ({
          advertisers: [...state.advertisers, { ...advertiser, id: crypto.randomUUID() }]
        }));
      },
      updateAdvertiser: (id, advertiser) => {
        // TODO: Implementar la llamada a Supabase cuando esté disponible
        // const { data, error } = await supabase
        //   .from('advertisers')
        //   .update(advertiser)
        //   .eq('id', id)
        //   .select()
        //   .single();
        
        // if (error) throw error;
        
        // Por ahora, usamos el store local
        set((state) => ({
          advertisers: state.advertisers.map((adv) =>
            adv.id === id ? { ...adv, ...advertiser } : adv
          )
        }));
      },
      deleteAdvertiser: (id) => {
        // TODO: Implementar la llamada a Supabase cuando esté disponible
        // const { error } = await supabase
        //   .from('advertisers')
        //   .delete()
        //   .eq('id', id);
        
        // if (error) throw error;
        
        // Por ahora, usamos el store local
        set((state) => ({
          advertisers: state.advertisers.filter((adv) => adv.id !== id)
        }));
      },
      setAdvertisers: (advertisers) => {
        // TODO: Implementar la llamada a Supabase cuando esté disponible
        // const { data, error } = await supabase
        //   .from('advertisers')
        //   .select('*');
        
        // if (error) throw error;
        
        // Por ahora, usamos el store local
        set({ advertisers });
      },
      getAdvertiserById: (id) => get().advertisers.find(a => a.id === id),
      updateAdvertiserStatus: (id, status) =>
        set((state) => ({
          advertisers: state.advertisers.map(a => a.id === id ? { ...a, status } : a)
        })),
    }),
    { name: "advertisers" }
  )
); 