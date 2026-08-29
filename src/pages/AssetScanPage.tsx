import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncidentReports } from '../hooks/useIncident';
import type { NewIncidentReport } from '../types/incident';

interface ScannedAsset {
    _id?: string;
    assetId: string;
    name: string;
    category: string;
    condition: string;
    area: string;
    baselineImageUrl: string | null;
}

export const AssetScanPage: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const [asset, setAsset] = useState<ScannedAsset | null>(null);
    const [assetError, setAssetError] = useState<string | null>(null);
    const [isLoadingAsset, setIsLoadingAsset] = useState(true);

    const { handleCreate, error: hookError } = useIncidentReports(); 

    // UI & Form State
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [issueCategory, setIssueCategory] = useState('Physical Damage');
    const [severity, setSeverity] = useState<'Critical' | 'Urgent' | 'High' | 'Medium' | 'Low'>('Low');
    const [description, setDescription] = useState('');
    const [reportedName, setReportedName] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const res = await fetch(`/api/assets/scan/${assetId}`);
                if (!res.ok) throw new Error('Asset not found');
                const data = await res.json();
                setAsset(data);
            } catch (err) {
                setAssetError('This asset could not be found.');
            } finally {
                setIsLoadingAsset(false);
            }
        };
        fetchAsset();
    }, [assetId]);

   const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!asset) return;

        setIsSubmitting(true);
        setSuccessMessage(null);

        const newReportData: NewIncidentReport = {
            title: `${issueCategory} - ${asset.name}`,
            description: description || null,
            area: asset.area,
            severity: severity,
            affectedAssets: [asset._id || asset.assetId],
            reporterType: 'Public',
            reportedName: reportedName || 'Anonymous',
            dateAndTime: new Date().toISOString(), 
        };

        try {
            await handleCreate(newReportData);

            setSuccessMessage('Incident report submitted successfully.');
            setIsReportOpen(false);
            setDescription('');
            setReportedName('');
            
            // Optimistically update condition display
            setAsset({ ...asset, condition: 'Reported Issue' });
        } catch (err: any) {
            console.error('Failed to submit report:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingAsset) return <div className="p-6 text-center text-gray-400">Loading asset details...</div>;

    if (assetError || !asset) {
        return (
            <div className="p-6 text-center text-red-500">
                {assetError || 'Something went wrong.'}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 flex flex-col gap-4 relative min-h-screen">
            {/* SUCCESS NOTIFICATION */}
            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-sm flex justify-between items-center">
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 font-bold">✕</button>
                </div>
            )}

            {/* HOOK ERROR DISPLAY */}
            {hookError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-sm">
                    {hookError}
                </div>
            )}

            {/* ASSET PREVIEW */}
            <h1 className="text-xl font-bold text-gray-800">{asset.name}</h1>
            <p className="text-gray-500 text-sm">{asset.assetId}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Category</p>
                    <p className="font-medium text-gray-700">{asset.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Condition</p>
                    <p className="font-medium text-gray-700">{asset.condition}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                    <p className="text-gray-400 text-xs">Area</p>
                    <p className="font-medium text-gray-700">{asset.area}</p>
                </div>
            </div>

            {asset.baselineImageUrl && (
                <img src={asset.baselineImageUrl} alt={asset.name} className="rounded-xl w-full object-cover max-h-56" />
            )}

            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="mt-4 bg-red-500 hover:bg-red-600 transition-colors text-white text-center py-3 rounded-xl font-semibold w-full shadow-sm"
            >
                Report an issue
            </button>

            {/* MODAL / DRAWER OVERLAY */}
            {isReportOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-bold text-gray-800">Report Incident</h2>
                            <button
                                onClick={() => setIsReportOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReport} className="flex flex-col gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Asset</label>
                                <input
                                    type="text"
                                    disabled
                                    value={`${asset.name} (${asset.assetId})`}
                                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-600 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Issue Type</label>
                                <select
                                    value={issueCategory}
                                    onChange={(e) => setIssueCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="Physical Damage">Physical Damage</option>
                                    <option value="Malfunctioning">Malfunctioning / Broken</option>
                                    <option value="Missing">Missing / Stolen</option>
                                    <option value="Maintenance">Maintenance Required</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Severity</label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value as any)}
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the condition or issue in detail..."
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    value={reportedName}
                                    onChange={(e) => setReportedName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReportOpen(false)}
                                    className="w-1/2 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-1/2 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl font-semibold transition-colors"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};