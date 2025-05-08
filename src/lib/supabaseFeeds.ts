import { AdvertiserGroup, FeedAd } from "../app/dashboard/feeds/data/feeds";

// Datos de ejemplo locales
const mockFeeds: AdvertiserGroup[] = [
  {
    advertiser: "1",
    totalRecords: 150,
    noPrice: 5,
    noImage: 3,
    ads: [
      {
        id: "1",
        name: "Default Feed",
        type: "Default",
        format: "Google Ads",
        lastUpdate: "2024-03-20",
        status: true
      },
      {
        id: "2",
        name: "Extended Feed",
        type: "Extended",
        format: "Facebook",
        lastUpdate: "2024-03-19",
        status: true
      }
    ]
  }
];

export async function fetchAdvertisersWithFeeds(): Promise<AdvertiserGroup[]> {
  // Simular un pequeño retraso para imitar una llamada a API
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockFeeds;
}

export async function deleteFeedById(feedId: string): Promise<boolean> {
  // Simular un pequeño retraso para imitar una llamada a API
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`Feed ${feedId} deleted (mock)`);
  return true;
}

export async function addFeedToAdvertiser(advertiserId: string, feed: Partial<FeedAd>): Promise<boolean> {
  // Simular un pequeño retraso para imitar una llamada a API
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`Feed added to advertiser ${advertiserId} (mock)`, feed);
  return true;
}
