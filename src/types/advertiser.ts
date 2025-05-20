export interface Address {
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email?: string;
}

export interface Advertiser {
  id: string;
  name: string;
  totalRecords: number;
  lastUpdate: string;
  history: string;
  customFeeds: number;
  videoTemplates: number;
  videoAdVersions: number;
  hasAds: boolean;
  dba?: string;
  status?: boolean;
  website?: string;
  addresses?: Address[];
  phone?: string;
  gmb?: string;
  placeId?: string;
  responsible?: string;
  deactivationDate?: string;
  FeatureDisplay?: boolean;
  FeatureDisplayDate?: string;
  FeatureVideo?: boolean;
  FeatureVideoDate?: string;
  FeatureSearch?: boolean;
  FeatureSearchDate?: string;
  // Paso 3 Dynamic Display Feeds
  GTMAccountId?: string;
  GTMContainerId?: string;
  ManualGTMPrivileges?: boolean;
  FacebookPixelId?: string;
  GoogleAdsConversionId?: string;
  BingRemarketingId?: string;
  RequestScriptInstall?: boolean;
  RequestScriptInstallDate?: string;
  GoogleAdsCustomerId?: string;
  GoogleAdsCustomerId2?: string;
  AdCustomizersEnabled?: boolean;
  AdCustomizersDeactivationDate?: string;
  hasWebInventory: boolean;
}

export interface AdvertiserFormData {
  Name?: string;
  DBA?: string;
  Website?: string;
  Country?: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  Phone?: string;
  GMB?: string;
  GooglePlaceId?: string;
  Category?: string;
  Responsible?: string;
  Status?: boolean;
  Date?: string;
  FeatureDisplay?: boolean;
  FeatureDisplayDate?: string;
  FeatureVideo?: boolean;
  FeatureVideoDate?: string;
  FeatureSearch?: boolean;
  FeatureSearchDate?: string;
  // Google Ads Integration fields
  GoogleAdsCustomerId?: string;
  GoogleAdsCustomerId2?: string;
  // GTM and Tag fields
  GTMAccountId?: string;
  GTMContainerId?: string;
  ManualGTMPrivileges?: boolean;
  FacebookPixelId?: string;
  GoogleAdsConversionId?: string;
  BingRemarketingId?: string;
  RequestScriptInstall?: boolean;
  // Ad Customizers fields
  AdCustomizersEnabled?: boolean;
  AdCustomizersDeactivationDate?: string;
  // Special Requests fields
  CustomFeedRequest?: boolean;
  CustomFeedRequirements?: string;
  VideoAdRequest?: boolean;
  VideoAdRequirements?: string;
  AdditionalNotes?: string;
  PriorityLevel?: 'low' | 'normal' | 'high' | 'urgent';
}
