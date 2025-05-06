export interface FeedAd {
    id: string;
    name: string;
    type: "Default" | "Extended";
    format: "Google Ads" | "Facebook" | "Bing";
    lastUpdate: string;
    status: boolean;
  }
  
  export interface AdvertiserGroup {
    advertiser: string;
    totalRecords: number;
    noPrice: number;
    noImage: number;
    ads: FeedAd[];
  }
  
  export const sampleAdvertisers: AdvertiserGroup[] = [
    {
      advertiser: "Alliance Auto Group LTD",
      totalRecords: 210,
      noPrice: 0,
      noImage: 4,
      ads: [
        {
          id: "f1",
          name: "Facebook Default Feed",
          type: "Default",
          format: "Facebook",
          lastUpdate: "2024-05-01",
          status: true,
        },
        {
          id: "f2",
          name: "Google Ads Default Feed",
          type: "Extended",
          format: "Google Ads",
          lastUpdate: "2024-05-02",
          status: false,
        },
      ],
    },
    {
      advertiser: "Am Ford",
      totalRecords: 115,
      noPrice: 1,
      noImage: 0,
      ads: [
        {
          id: "f3",
          name: "Google VLA",
          type: "Default",
          format: "Google Ads",
          lastUpdate: "2024-05-01",
          status: true,
        },
      ],
    },
  ];
  