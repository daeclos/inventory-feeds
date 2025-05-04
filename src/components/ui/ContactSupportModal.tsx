"use client";

import { useState } from 'react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');

  const issueOptions: Record<string, { label: string; fields: string[] }[]> = {
    general: [
      {
        label: 'Technical support',
        fields: ['Advertiser name', 'Product', 'Summary*', 'Description']
      },
      { label: 'Verify website support', fields: ['Summary*', 'Description'] },
      { label: 'Other', fields: ['Summary*', 'Description*'] },
      { label: 'Website CMS/provider change', fields: ['Summary*', 'Description'] },
    ],
    video: [
      { label: 'Vast Tag Spec Change', fields: ['Description*'] },
      { label: 'Manual Push Render and Upload', fields: ['Advertiser Name*', 'Description'] },
      { label: 'Incorrect  Data Is Shown', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'VAST Tag Issue', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Other', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
    ],
    "google ads search": [
      { label: 'Search: Mid-Day Ad Review', fields: ['Advertiser Name*', 'Summary*', 'Description'] },
      { label: 'Ad Customizers Data Discrepancy', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Ad Groups Not Updating Correctly', fields: ['Advertiser Name*', 'Summary*', 'Description'] },
      { label: 'Other', fields: ['Advertiser Name', 'Summary*', 'Description*'] },
    ],
    "inventory feeds": [
      { label: 'Feed Special Request', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Location Filter Request', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Pixel/Script Review', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Iventory Data Discrepancy', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Iventory Missing From Feed', fields: ['Advertiser Name*', 'Summary*', 'Description*'] },
      { label: 'Other', fields: ['Advertiser Name', 'Summary*', 'Description*'] },
    ],
  };

  if (!isOpen) return null;

  const issueList = issueOptions[selectedCategory] || [];
  const selectedData = issueList.find(i => i.label === selectedIssue);

  return (
    <div className="absolute top-20 left-0 w-full flex justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-gray-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>

        <label className="block mb-2 font-medium">Contact us about*</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedIssue('');
          }}
        >
          <option value="">Select a category</option>
          {Object.keys(issueOptions).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {selectedCategory && (
          <>
            <label className="block mb-2 font-medium">What can we help you?*</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
            >
              <option value="">Select an issue</option>
              {issueList.map((issue) => (
                <option key={issue.label} value={issue.label}>{issue.label}</option>
              ))}
            </select>
          </>
        )}

        {selectedData && (
          <div className="space-y-4">
            {selectedData.fields.map((field, idx) => (
              <div key={idx}>
                <label className="block mb-1 font-medium">{field}</label>
                {field.toLowerCase().includes('description') ? (
                  <textarea className="w-full border border-gray-300 rounded-md p-2 h-24" />
                ) : (
                  <input className="w-full border border-gray-300 rounded-md p-2" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-2xl bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded-2xl bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            onClick={() => alert("Message sent!")}
          >
            Send Message To Support
          </button>
        </div>
      </div>
    </div>
  );
}


