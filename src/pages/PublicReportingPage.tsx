import React from 'react';
import { Link } from 'react-router-dom';
import kilosImage from '../assets/images/image-5.png'

export const PublicReportingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-slate-950">
            
            {/* BACKGROUND IMAGE WITH OVERLAY & BLUR */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md scale-105 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `url(${kilosImage})`,
                }}
            />

            {/* DARK TINT OVERLAY FOR CONTRAST */}
            <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />

            {/* CENTERED FROSTED-GLASS CARD */}
            <div className="relative z-10 max-w-xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col gap-6">
                
                {/* Header Title & Subtitle */}
                <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
                        KilosConnect Public Reporting
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        Help us maintain a safe and functional facility. Report equipment issues or safety hazards instantly.
                    </p>
                </div>

                {/* CARD 1: Report Asset Issue */}
                <div className="bg-slate-800/70 hover:bg-slate-800/90 transition-all rounded-2xl p-5 sm:p-6 border border-slate-700/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-md">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center">
                        {/* QR / Asset Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h2 className="text-lg font-semibold text-white">Report Asset Issue</h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Scan equipment QR code to report malfunctions, damage, or maintenance needs.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/scan-qr"
                                className="inline-block bg-[#124d45] hover:bg-[#165c53] text-emerald-100 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                Start Asset Report
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CARD 2: Report Facility Hazard */}
                <div className="bg-slate-800/70 hover:bg-slate-800/90 transition-all rounded-2xl p-5 sm:p-6 border border-slate-700/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-md">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center">
                        {/* Hazard Warning Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h2 className="text-lg font-semibold text-white">Report Facility Hazard</h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Report safety concerns, spills, structural issues, or any hazards that need immediate attention.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/report-hazard"
                                className="inline-block bg-[#124d45] hover:bg-[#165c53] text-emerald-100 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                Report Hazard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="pt-4 border-t border-slate-700/60">
                    <p className="text-slate-400 text-xs leading-relaxed text-center sm:text-left">
                        All reports are anonymous unless you choose to provide contact information. For emergencies, please contact staff immediately.
                    </p>
                </div>

            </div>
        </div>
    );
};