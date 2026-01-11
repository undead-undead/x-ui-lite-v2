import { useDialogStore } from '../store/useDialogStore';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Dialog = () => {
    const { t } = useTranslation();
    const { isOpen, type, title, message, confirmText, cancelText, onConfirm, onCancel, close } = useDialogStore();

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1000 animate-in fade-in duration-150"
                onClick={type === 'alert' ? onConfirm || close : undefined}
            />

            <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto animate-in zoom-in-95 fade-in duration-150"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8 pb-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            {type === 'alert' ? (
                                <CheckCircle className="w-8 h-8 text-blue-500" strokeWidth={2} />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-orange-500" strokeWidth={2} />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h3>
                    </div>

                    <div className="px-8 pb-8">
                        <p className="text-[15px] text-gray-600 text-center leading-relaxed font-medium">
                            {message}
                        </p>
                    </div>

                    <div className="p-6 pt-0 flex gap-3">
                        {type === 'confirm' && onCancel && (
                            <button
                                onClick={onCancel}
                                className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-bold text-[14px] hover:bg-gray-200 active:scale-95 transition-all"
                            >
                                {cancelText === 'Cancel' ? t('inbound.modal.cancel') : cancelText}
                            </button>
                        )}
                        <button
                            onClick={onConfirm || close}
                            className={`h-12 bg-black text-white rounded-xl font-bold text-[14px] hover:bg-gray-800 active:scale-95 transition-all shadow-lg ${type === 'confirm' ? 'flex-1' : 'w-full'
                                }`}
                        >
                            {confirmText === 'OK' ? t('inbound.modal.confirm') : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
