import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBackupModalStore } from '../store/useBackupModalStore';
import { useSettingStore } from '../store/useSettingStore';
import { X, Database, Download, Upload, AlertCircle } from 'lucide-react';

export const BackupModal = () => {
    const { t } = useTranslation();
    const { isOpen, close } = useBackupModalStore();
    const { exportDb, importDb } = useSettingStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={close}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-4xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] p-10 animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100 shadow-sm">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t('settings.backup.modal_title')}</h2>
                        </div>
                    </div>
                    <button
                        onClick={close}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 mb-8">
                    <div className="flex gap-4">
                        <AlertCircle className="text-gray-400 shrink-0" size={20} />
                        <div className="space-y-3">
                            <p className="text-[13px] font-bold text-gray-700 leading-relaxed">
                                {t('settings.backup.support_only')} <span className="text-gray-900">.db</span> {t('settings.backup.db_ext')}
                            </p>
                            <p className="text-[12px] font-medium text-gray-400 leading-relaxed">
                                {t('settings.backup.export_desc')}<br />
                                {t('settings.backup.import_desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => {
                            exportDb();
                            close();
                        }}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-white border border-gray-100 rounded-3xl hover:border-black active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                    >
                        <div className="w-12 h-12 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-2xl flex items-center justify-center text-gray-900 transition-all duration-300">
                            <Upload size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-[15px] font-bold text-gray-900">{t('settings.backup.export_btn')}</p>
                        </div>
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-white border border-gray-100 rounded-3xl hover:border-black active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                    >
                        <div className="w-12 h-12 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-2xl flex items-center justify-center text-gray-900 transition-all duration-300">
                            <Download size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-[15px] font-bold text-gray-900">{t('settings.backup.import_btn')}</p>
                        </div>
                        <input
                            type="file"
                            accept=".db"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    importDb(file);
                                    close();
                                    e.target.value = '';
                                }
                            }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};
