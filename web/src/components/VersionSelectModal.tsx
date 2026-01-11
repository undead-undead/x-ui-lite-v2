import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Loader2 } from 'lucide-react';
import { sysApi } from '../api/system';
import { toast } from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    currentVersion: string;
    onClose: () => void;
    onSelect: (version: string) => void;
}

export const VersionSelectModal = ({ isOpen, currentVersion, onClose, onSelect }: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchVersions();
        }
    }, [isOpen]);

    const fetchVersions = async () => {
        setLoading(true);
        try {
            const res = await sysApi.getXrayReleases();
            if (res.success) {
                setVersions(res.obj);
            } else {
                toast.error(t('dashboard.fetch_versions_failed'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('common.network_error'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">{t('dashboard.select_xray_version')}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {loading ? (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            versions.map((version) => (
                                <button
                                    key={version}
                                    onClick={() => onSelect(version)}
                                    className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all ${currentVersion === version
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span>{version}</span>
                                    {currentVersion === version && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
