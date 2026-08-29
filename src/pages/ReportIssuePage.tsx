import React, { useState } from 'react';

interface AssetReportProps {
  assetId: string;
  assetName: string;
  currentUser?: { name: string; email: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: ReportPayload) => void;
}

interface ReportPayload {
  assetId: string;
  category: string;
  description: string;
  reporterEmail?: string;
}

export const ReportIssueDrawer: React.FC<AssetReportProps> = ({
  assetId,
  assetName,
  currentUser,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState('Damaged');
  const [description, setDescription] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      assetId,
      category,
      description,
      reporterEmail: currentUser ? currentUser.email : guestEmail,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">Report Incident</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
            <span className="text-gray-500">Target Asset:</span>
            <p className="font-medium text-gray-800">{assetName} ({assetId})</p>
          </div>

          <form id="report-form" onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1">Issue Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="Damaged">Physical Damage</option>
                <option value="Malfunctioning">Software / Hardware Malfunction</option>
                <option value="Missing">Missing / Stolen</option>
                <option value="Maintenance">Routine Service Needed</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident or condition..."
                className="w-full border rounded-md p-2"
              />
            </div>

            {!currentUser && (
              <div>
                <label className="block font-medium mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}
          </form>
        </div>

        <div className="border-t pt-4 flex gap-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-1/2 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="report-form"
            className="w-1/2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Submit Incident
          </button>
        </div>
      </div>
    </div>
  );
};