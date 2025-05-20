import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CampaignTemplate {
  id: string;
  templateName: string;
  advertiser: string;
  account: string;
  googleCustomer: string;
  includeLocation: boolean;
  location: string;
  library: string;
  date: string;
  makeFilter: string[];
  yearStart: string;
  yearEnd: string;
  authorize: boolean;
  campaignName: string;
  campaignStatus: string;
  budget: string;
  networks: string;
  enhancedCpc: string;
  mobileBidModifier: string;
  adRotation: string;
  negativeKeywords: string[];
  adGroupName: string;
  adGroupStatus: string;
  finalUrl: string;
  maxCpcBid: string;
  maxCPC: string;
  filter: string;
  hasAlert: boolean;
  setMaxCpcOnCreate: boolean;
  responsiveAds: any[];
  callOnlyAds: any[];
  keywords: any[];
  createdAt: string;
}

interface CampaignTemplateStore {
  templates: CampaignTemplate[];
  addTemplate: (template: CampaignTemplate) => void;
  updateTemplate: (id: string, template: Partial<CampaignTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => CampaignTemplate | undefined;
}

export const useCampaignTemplateStore = create<CampaignTemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, template) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...template } : t
          ),
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
      getTemplateById: (id) => get().templates.find((t) => t.id === id),
    }),
    { name: "campaign-templates" }
  )
); 