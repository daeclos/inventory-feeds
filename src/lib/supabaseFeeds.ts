import { createClient } from "@supabase/supabase-js";
import { AdvertiserGroup, FeedAd } from "../app/dashboard/feeds/data/feeds";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchAdvertisersWithFeeds(): Promise<AdvertiserGroup[]> {
  const { data, error } = await supabase
    .from("advertisers")
    .select("id, name, totalRecords, noPrice, noImage, feeds(*)")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch advertisers:", error);
    return [];
  }

  return data.map((record) => ({
    advertiser: record.name,
    totalRecords: record.totalRecords,
    noPrice: record.noPrice,
    noImage: record.noImage,
    ads: (record.feeds || []).map((f: any): FeedAd => ({
      id: f.id,
      name: f.name,
      type: f.type,
      format: f.format,
      lastUpdate: f.lastUpdate,
      status: f.status,
    })),
  }));
}

export async function deleteFeedById(feedId: string): Promise<boolean> {
  const { error } = await supabase.from("feeds").delete().eq("id", feedId);
  if (error) {
    console.error("Failed to delete feed:", error);
    return false;
  }
  return true;
}

export async function addFeedToAdvertiser(advertiserId: string, feed: Partial<FeedAd>): Promise<boolean> {
  const { error } = await supabase.from("feeds").insert({
    ...feed,
    advertiser_id: advertiserId,
  });

  if (error) {
    console.error("Failed to insert feed:", error);
    return false;
  }
  return true;
}
