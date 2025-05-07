export interface Advertiser {
  name: string;
  totalRecords: number;
  lastUpdate: string;
  history: string;
  customFeeds: number;
  videoTemplates: number;
  videoAdVersions: number;
  hasAds: boolean;
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
}
export interface AdvertiserFormData {
  // ...otros campos ya existentes
  GTMAccountId?: string;
  GTMContainerId?: string;
  FacebookPixelId?: string;
  GoogleAdsConversionId?: string;
  BingRemarketingId?: string;
  RequestScriptInstall?: boolean;
}
export interface AdvertiserFormData {
  // ...otras propiedades
  GoogleAdsCustomerId?: string;
  GoogleAdsCustomerId2?: string;
  AdCustomizersEnabled?: boolean;
  AdCustomizersDeactivationDate?: string;
}
