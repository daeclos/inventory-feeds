import React, { useState, useEffect } from "react";
import { Edit2, Copy, Search, FileText, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export interface FeedAdvertiser {
  id: string;
  name: string;
  totalRecords: number;
  noPrice: number;
  noImage: number;
  customFeeds: number;
  hasAds?: boolean;
  status?: boolean;
  addresses?: { address: string }[];
}

interface AdvertiserFeedsAccordionProps {
  advertisers: FeedAdvertiser[];
  simple?: boolean;
}

export const AdvertiserFeedsAccordion: React.FC<AdvertiserFeedsAccordionProps> = ({ advertisers, simple = false }) => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [feedsByAdvertiser, setFeedsByAdvertiser] = useState<Record<string, any[]>>({});
  const [openFeedDetails, setOpenFeedDetails] = useState<Record<string, Set<string>>>({});
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customFeeds') || '{}');
    setFeedsByAdvertiser(stored);
  }, []);

  const handleRowClick = (advId: string) => {
    setOpenRow(openRow === advId ? null : advId);
  };

  const handleFeedNameClick = (advId: string, feedId: string) => {
    setOpenFeedDetails(prev => {
      const set = new Set(prev[advId] || []);
      if (set.has(feedId)) set.delete(feedId);
      else set.add(feedId);
      return { ...prev, [advId]: set };
    });
  };

  // Handlers básicos para acciones
  const handleDuplicate = (feed: any) => alert(`Duplicate feed: ${feed.name}`);
  const handleView = (feed: any) => alert(`View feed: ${feed.name}`);
  const handleCopy = (feed: any) => alert(`Copy feed: ${feed.name}`);
  const handleDownload = (feed: any) => alert(`Download feed: ${feed.name}`);
  // Eliminar y editar pueden ser opcionales aquí

  return (
    <>
      {simple ? (
        // Solo mostrar la lista de feeds del primer advertiser
        (() => {
          const adv = advertisers[0];
          const feeds = feedsByAdvertiser[adv.id] || [];
          return (
            <div className="w-full">
              {feeds.length ? (
                <ul className="pl-0">
                  {feeds.map(feed => (
                    <li key={feed.id} className="flex items-center justify-between border-b last:border-b-0 px-6 py-2 cursor-pointer hover:bg-[#FFF3D1]/40 transition">
                      <span className="font-semibold text-[#404042]">{feed.name}</span>
                      <span className="flex gap-2">
                        <Edit2 size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Edit" onClick={e => { e.stopPropagation(); router.push(`/dashboard/feeds/edit/${feed.id}`); }} />
                        <Copy size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Duplicate" onClick={e => { e.stopPropagation(); handleDuplicate(feed); }} />
                        <Search size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="View" onClick={e => { e.stopPropagation(); handleView(feed); }} />
                        <FileText size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Copy" onClick={e => { e.stopPropagation(); handleCopy(feed); }} />
                        <Download size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Download" onClick={e => { e.stopPropagation(); handleDownload(feed); }} />
                        <Trash2 size={18} className="cursor-pointer text-[#F17625] hover:text-[#FAAE3A] transition-colors" aria-label="Delete" onClick={e => { e.stopPropagation(); /* handleDelete(feed, adv.id); */ }} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 block px-6 py-4">No feeds for this advertiser.</span>
              )}
            </div>
          );
        })()
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center">Status</th>
              <th>Advertiser Name</th>
              <th className="text-right">Total Feed Records</th>
              <th className="text-right">No Price</th>
              <th className="text-right">No Image</th>
              <th className="text-right">Custom Feeds</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.map((adv) => (
              <React.Fragment key={adv.id}>
                <tr
                  className={`cursor-pointer hover:bg-gray-100 ${openRow === adv.id ? 'bg-yellow-50' : ''}`}
                  onClick={() => handleRowClick(adv.id)}
                >
                  <td className="px-4 py-2 text-center">
                    {adv.hasAds || adv.status ? (
                      <span className="px-3 py-1 rounded font-semibold text-sm bg-green-100 text-green-600">Active</span>
                    ) : (
                      <span className="px-3 py-1 rounded font-semibold text-sm bg-red-100 text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="flex items-center gap-2">{adv.name}</td>
                  <td className="text-right">{adv.totalRecords}</td>
                  <td className="text-right">{adv.noPrice}</td>
                  <td className="text-right">{adv.noImage}</td>
                  <td className="text-right">{(feedsByAdvertiser[adv.id]?.length || 0)} <span className="ml-1">▼</span></td>
                </tr>
                {openRow === adv.id && (
                  <tr>
                    <td colSpan={6} className="bg-yellow-50 p-0">
                      {feedsByAdvertiser[adv.id]?.length ? (
                        <ul className="pl-0">
                          {feedsByAdvertiser[adv.id].map(feed => (
                            <React.Fragment key={feed.id}>
                              <li
                                className="flex items-center justify-between border-b last:border-b-0 px-6 py-2 cursor-pointer hover:bg-[#FFF3D1]/40 transition"
                                onClick={e => { e.stopPropagation(); handleFeedNameClick(adv.id, feed.id); }}
                              >
                                <span className="font-semibold text-[#404042]">{feed.name}</span>
                                <span className="flex gap-2">
                                  <Edit2 size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Edit" onClick={e => { e.stopPropagation(); router.push(`/dashboard/feeds/edit/${feed.id}`); }} />
                                  <Copy size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Duplicate" onClick={e => { e.stopPropagation(); handleDuplicate(feed); }} />
                                  <Search size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="View" onClick={e => { e.stopPropagation(); handleView(feed); }} />
                                  <FileText size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Copy" onClick={e => { e.stopPropagation(); handleCopy(feed); }} />
                                  <Download size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Download" onClick={e => { e.stopPropagation(); handleDownload(feed); }} />
                                  <Trash2 size={18} className="cursor-pointer text-[#F17625] hover:text-[#FAAE3A] transition-colors" aria-label="Delete" onClick={e => { e.stopPropagation(); /* handleDelete(feed, adv.id); */ }} />
                                </span>
                              </li>
                              {openFeedDetails[adv.id]?.has(feed.id) && (
                                <li className="bg-[#f7f7f9] border-b last:border-b-0 px-10 py-4 text-sm text-[#404042]">
                                  <div className="grid grid-cols-1 md:grid-cols-6 gap-y-1 gap-x-4 items-center">
                                    <div className="md:col-span-1"><span className="text-[#404042]">Feed Type</span></div>
                                    <div className="md:col-span-5 font-bold">{feed.type}</div>
                                    <div className="md:col-span-1"><span className="text-[#404042]">Feed Format</span></div>
                                    <div className="md:col-span-5 font-bold">{feed.format}</div>
                                    <div className="md:col-span-1"><span className="text-[#404042]">Address</span></div>
                                    <div className="md:col-span-5 font-bold">{feed.address || (Array.isArray(adv.addresses) && adv.addresses[0]?.address) || '-'}</div>
                                    {feed.filters && feed.filters.length > 0 && (
                                      <>
                                        <div className="md:col-span-1"><span className="text-[#404042]">Filters</span></div>
                                        <div className="md:col-span-5">
                                          <ul className="list-disc pl-4">
                                            {feed.filters.map((f: any, i: number) => (
                                              <li key={i} className="mb-1">
                                                <span className="text-blue-700 font-semibold">{f.field}</span> {f.operator} <span className="text-[#F17625]">{Array.isArray(f.value) ? f.value.map((v: string) => `"${v}"`).join(', ') : `"${f.value}"`}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </>
                                    )}
                                    <div className="md:col-span-1"><span className="text-[#404042]">Url</span></div>
                                    <div className="md:col-span-5 flex flex-col gap-1">
                                      {feed.url ? (
                                        <a href={feed.url} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{feed.url}</a>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                      {feed.urlAppends && Array.isArray(feed.urlAppends) && feed.urlAppends.length > 0 && feed.urlAppends.map((u: { name: string; value: string }, idx: number) => (
                                        u.value && (u.value.startsWith('http://') || u.value.startsWith('https://')) ? (
                                          <a key={idx} href={u.value} className="text-blue-600 underline break-all ml-2" target="_blank" rel="noopener noreferrer">{u.value}</a>
                                        ) : null
                                      ))}
                                    </div>
                                  </div>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No feeds for this advertiser.</span>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}; 