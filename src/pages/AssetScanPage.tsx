// pages/AssetScanPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ScannedAsset {
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
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const res = await fetch(`/api/assets/scan/${assetId}`);
                if (!res.ok) throw new Error('Asset not found');
                const data = await res.json();
                setAsset(data);
            } catch (err) {
                setError('This asset could not be found.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAsset();
    }, [assetId]);

    if (isLoading) return <div className="p-6 text-center text-gray-400">Loading...</div>;

    if (error || !asset) {
        return (
            <div className="p-6 text-center text-red-500">
                {error || 'Something went wrong.'}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
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
                <img src={asset.baselineImageUrl} alt={asset.name} className="rounded-xl w-full" />
            )}

            <Link
                to={`/incident-report/new?assetId=${asset.assetId}`}
                className="mt-4 bg-red-500 text-white text-center py-3 rounded-xl font-semibold"
            >
                Report an issue
            </Link>
        </div>
    );
};