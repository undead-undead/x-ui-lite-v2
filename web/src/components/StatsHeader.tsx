import { formatTraffic } from '../utils/format';
import { useTranslation } from 'react-i18next';

export const StatsHeader = ({ totalUp, totalDown, count }: { totalUp: number, totalDown: number, count: number }) => {
    const { t } = useTranslation();
    const totalUsage = totalUp + totalDown;

    return (
        <div className="bg-white border border-gray-200 p-8 rounded-4xl mb-6 flex gap-12 text-xs shadow-lg">
            <div className="group transition-all">
                <p className="font-bold text-gray-500 mb-1.5 group-hover:text-gray-700 transition-colors tracking-tight uppercase text-[11px]">{t('dashboard.up')} / {t('dashboard.down')} {t('inbound.total_traffic')}</p>
                <p className="font-mono font-bold text-gray-900 text-sm tabular-nums">
                    {formatTraffic(totalUp)} <span className="text-gray-400 font-normal mx-2">|</span> {formatTraffic(totalDown)}
                </p>
            </div>

            <div className="w-px h-10 bg-gray-200" />

            <div className="group transition-all">
                <p className="font-bold text-gray-500 mb-1.5 group-hover:text-gray-700 transition-colors tracking-tight uppercase text-[11px]">{t('inbound.total_traffic')}</p>
                <p className="font-mono font-bold text-gray-900 text-sm tabular-nums">{formatTraffic(totalUsage)}</p>
            </div>

            <div className="w-px h-10 bg-gray-200" />

            <div className="group transition-all">
                <p className="font-bold text-gray-500 mb-1.5 group-hover:text-gray-700 transition-colors tracking-tight uppercase text-[11px]">{t('inbound.total_count')}</p>
                <p className="font-mono font-bold text-gray-900 text-sm tabular-nums">{count}</p>
            </div>
        </div>
    );
};