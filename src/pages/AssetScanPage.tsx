import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncidentReports } from '../hooks/useIncident';
import type { NewIncidentReport } from '../types/incident';
import kilosImage from '../assets/images/image-5.png';

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

    if (isLoadingAsset) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-400">
                Loading asset details...
            </div>
        );
    }

    if (assetError || !asset) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-red-400">
                {assetError || 'Something went wrong.'}
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-slate-950">
            
            {/* BACKGROUND IMAGE WITH OVERLAY & BLUR */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md scale-105 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `url(${kilosImage})`,
                }}
            />

            {/* DARK TINT OVERLAY */}
            <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />

            {/* CENTERED FROSTED-GLASS CARD */}
            <div className="relative z-10 max-w-xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col gap-6">
                
                {/* SUCCESS NOTIFICATION */}
                {successMessage && (
                    <div className="bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 p-3 rounded-xl text-sm flex justify-between items-center">
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 font-bold">✕</button>
                    </div>
                )}

                {/* HOOK ERROR DISPLAY */}
                {hookError && (
                    <div className="bg-red-950/80 border border-red-700/50 text-red-300 p-3 rounded-xl text-sm">
                        {hookError}
                    </div>
                )}

                {/* HEADER TITLE */}
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
                        {asset.name}
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm font-mono">
                        Asset ID: {asset.assetId}
                    </p>
                </div>

                {/* ASSET DETAILS GRID */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
                        <p className="text-slate-400 text-xs">Category</p>
                        <p className="font-medium text-slate-200 mt-0.5">{asset.category}</p>
                    </div>
                    <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
                        <p className="text-slate-400 text-xs">Condition</p>
                        <p className="font-medium text-slate-200 mt-0.5">{asset.condition}</p>
                    </div>
                    <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60 col-span-2">
                        <p className="text-slate-400 text-xs">Area Location</p>
                        <p className="font-medium text-slate-200 mt-0.5">{asset.area}</p>
                    </div>
                </div>

                {/* BASELINE IMAGE */}
                {asset.baselineImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-700/60">
                        <img 
                            src={asset.baselineImageUrl} 
                            alt={asset.name} 
                            className="w-full object-cover max-h-56" 
                        />
                    </div>
                )}

                {/* TRIGGER ACTION BUTTON */}
                <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="w-full bg-[#124d45] hover:bg-[#165c53] text-emerald-100 text-sm font-medium py-3 rounded-xl transition-colors shadow-sm"
                >
                    Report an Issue with this Asset
                </button>

                {/* FOOTER NOTE */}
                <div className="pt-2 border-t border-slate-700/60">
                    <p className="text-slate-400 text-xs leading-relaxed text-center sm:text-left">
                        All reports are anonymous unless you choose to provide contact information. For emergencies, please contact staff immediately.
                    </p>
                </div>
            </div>

            {/* MODAL / DRAWER OVERLAY */}
            {isReportOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-700/60 p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
                            <h2 className="text-lg font-semibold text-slate-100">Report Asset Issue</h2>
                            <button
                                onClick={() => setIsReportOpen(false)}
                                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReport} className="flex flex-col gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Asset</label>
                                <input
                                    type="text"
                                    disabled
                                    value={`${asset.name} (${asset.assetId})`}
                                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-slate-300 font-medium cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Issue Type</label>
                                <select
                                    value={issueCategory}
                                    onChange={(e) => setIssueCategory(e.target.value)}
                                    className="w-full border border-slate-700/60 rounded-xl p-3 text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Physical Damage">Physical Damage</option>
                                    <option value="Malfunctioning">Malfunctioning / Broken</option>
                                    <option value="Missing">Missing / Stolen</option>
                                    <option value="Maintenance">Maintenance Required</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Severity</label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value as any)}
                                    className="w-full border border-slate-700/60 rounded-xl p-3 text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the condition or issue in detail..."
                                    className="w-full border border-slate-700/60 rounded-xl p-3 text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    value={reportedName}
                                    onChange={(e) => setReportedName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full border border-slate-700/60 rounded-xl p-3 text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReportOpen(false)}
                                    className="w-1/2 py-3 border border-slate-700/60 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-1/2 py-3 bg-[#124d45] hover:bg-[#165c53] disabled:opacity-50 text-emerald-100 rounded-xl font-medium transition-colors"
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