import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { X, Share2, ClipboardCheck } from 'lucide-react';
import { useQRCodeStore } from '../store/useQRCodeStore';
import { generateShareLink, copyToClipboard } from '../utils/linkUtils';

export const QRCodeModal: React.FC = () => {
    const { t } = useTranslation();
    const { isOpen, inbound, close } = useQRCodeStore();
    const [copied, setCopied] = useState(false);

    const nodeLink = useMemo(() => {
        if (!inbound) return '';
        return generateShareLink(inbound, window.location.hostname);
    }, [inbound]);

    if (!isOpen || !inbound) return null;

    const handleCopyLink = async () => {
        if (!nodeLink) return;
        const success = await copyToClipboard(nodeLink);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/5 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={close}
            />

            <div className="relative w-[340px] bg-[#FDFDFD] border border-gray-100 rounded-[44px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-400">
                <div className="flex items-center justify-between p-8 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-[20px] flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                            <Share2 size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t('qrcode.title')}</h2>
                    </div>
                    <button
                        onClick={close}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-100 text-gray-400 transition-all active:scale-90"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col items-center">
                    <div className="p-6 bg-white border border-gray-50 rounded-[40px] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] mb-8 transform transition-transform hover:scale-[1.01]">
                        <QRCodeSVG
                            value={nodeLink}
                            size={200}
                            level="H"
                            includeMargin={false}
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div className="relative">
                            <button
                                onClick={handleCopyLink}
                                className={`
                                    w-full py-4 rounded-full text-[14px] font-bold transition-all duration-300
                                    flex items-center justify-center gap-2 border-2
                                    ${copied
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-gray-900 hover:border-gray-900 ring-4 ring-transparent hover:ring-gray-50'
                                    }
                                `}
                            >
                                {copied ? <ClipboardCheck size={18} /> : <div className="w-4 h-4" />}
                                <span>{copied ? t('qrcode.copy_success') : t('qrcode.copy_btn')}</span>
                            </button>
                            {!copied && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gray-100 rounded-full -z-10 blur-[2px]"></div>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="py-4 px-2 rounded-[28px] bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all flex flex-col items-center justify-center gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('qrcode.protocol')}</span>
                                <span className="text-[14px] font-bold text-gray-900 uppercase">{inbound.protocol}</span>
                            </div>
                            <div className="py-4 px-2 rounded-[28px] bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all flex flex-col items-center justify-center gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('qrcode.port')}</span>
                                <span className="text-[14px] font-bold text-gray-900">{inbound.port}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-8 text-center px-8">
                    <p className="text-[12px] font-bold text-gray-300 leading-relaxed uppercase tracking-tighter whitespace-pre-line">
                        {t('qrcode.tip')}
                    </p>
                </div>
            </div>
        </div>
    );
};
