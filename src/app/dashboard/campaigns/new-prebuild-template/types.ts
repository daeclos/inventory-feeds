export interface TemplateFormState {
  templateName: string;
  advertiser: string;
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
  setMaxCpcOnCreate: boolean;
}

export interface ResponsiveAd {
  headlines: string[];
  headlinesAlt: string[];
  descriptions: string[];
  descriptionsAlt: string[];
  paths: string[];
  pathsAlt: string[];
}

export interface CallOnlyAd {
  businessName: string;
  phoneNumber: string;
  countryCode: string;
  headlines: string[];
  headlinesAlt: string[];
  descriptions: string[];
  descriptionsAlt: string[];
  paths: string[];
  pathsAlt: string[];
  verificationUrl: string;
  callTracking: boolean;
  showFinalUrl: boolean;
  conversionAction: string;
} 