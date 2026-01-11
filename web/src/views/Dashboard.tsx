import { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/useGlobalStore';
import { useLogsStore } from '../store/useLogsStore';
import { useDialogStore } from '../store/useDialogStore';
import { VersionSelectModal } from '../components/VersionSelectModal';
import { DASHBOARD_POLLING_INTERVAL } from '../config/constants';

const StatusCircle = memo<{ percent: number; title: string; value: string }>(({ percent, title, value }) => (
    <div className="bg-white border border-gray-100 rounded-4xl p-8 flex flex-col items-center justify-center shadow-sm animate-in fade-in duration-700">
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-50" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * percent) / 100}
                    className="text-gray-900 transition-all duration-1000 ease-out"
                    strokeLinecap="round" />
            </svg>
            <span className="absolute text-xl font-bold text-gray-900 tracking-tighter tabular-nums">{percent}%</span>
        </div>
        <div className="text-center">
            <p className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-[14px] font-bold text-gray-500 tracking-tight">{value}</p>
        </div>
    </div>
));

StatusCircle.displayName = 'StatusCircle';

const StatusBar = memo<{ children: React.ReactNode }>(({ children }) => (
    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 group">
        {children}
    </div>
));

StatusBar.displayName = 'StatusBar';

export const Dashboard = () => {
    const { t } = useTranslation();
    const { sysStatus, fetchStatus, restartXray, switchVersion } = useGlobalStore();
    const { showAlert, showConfirm } = useDialogStore();
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, DASHBOARD_POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const handleRestart = () => {
        showConfirm(t('dashboard.restart_confirm_msg'), async () => {
            try {
                await restartXray();
                showAlert(t('dashboard.restart_success'), t('common.success') || 'Success');
                fetchStatus();
            } catch (err: any) {
                showAlert(err.message || t('dashboard.restart_failed'), t('common.error') || 'Error');
            }
        }, t('dashboard.restart_confirm_title'));
    };

    const handleVersionSelect = (version: string) => {
        setIsVersionModalOpen(false);
        if (version === sysStatus.xrayVersion) return;

        showConfirm(t('dashboard.switch_version_msg', { version }), async () => {
            try {
                await switchVersion(version);
                showAlert(t('dashboard.switch_version_success', { version }), t('common.success') || 'Success');
            } catch (err: any) {
                showAlert(err.message || t('dashboard.switch_version_failed'), t('common.error') || 'Error');
            }
        }, t('dashboard.switch_version_title'));
    };

    const handleToggleStatus = () => {
        if (sysStatus.xrayStatus === 'running') {
            showConfirm(t('dashboard.stop_confirm_msg'), async () => {
                try {
                    await useGlobalStore.getState().stopXray();
                    showAlert(t('dashboard.stop_success'), t('common.success') || 'Success');
                    fetchStatus();
                } catch (err: any) {
                    showAlert(err.message || t('dashboard.stop_failed'), t('common.error') || 'Error');
                }
            }, t('dashboard.stop_confirm_title'));
        } else {
            showConfirm(t('dashboard.start_confirm_msg'), async () => {
                try {
                    await useGlobalStore.getState().startXray();
                    showAlert(t('dashboard.start_success'), t('common.success') || 'Success');
                    fetchStatus();
                } catch (err: any) {
                    showAlert(err.message || t('dashboard.start_failed'), t('common.error') || 'Error');
                }
            }, t('dashboard.start_confirm_title'));
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 p-8 lg:p-14 overflow-y-auto font-sans text-gray-900">
            <VersionSelectModal
                isOpen={isVersionModalOpen}
                currentVersion={sysStatus.xrayVersion}
                onClose={() => setIsVersionModalOpen(false)}
                onSelect={handleVersionSelect}
            />
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatusCircle percent={Math.round(sysStatus.cpu)} title={t('dashboard.cpu')} value="" />
                    <StatusCircle percent={Math.round(sysStatus.mem.percent)} title={t('dashboard.memory')} value={`${sysStatus.mem.current} / ${sysStatus.mem.total}`} />
                    <StatusCircle percent={Math.round(sysStatus.swap.percent)} title={t('dashboard.swap')} value={`${sysStatus.swap.current} / ${sysStatus.swap.total}`} />
                    <StatusCircle percent={Math.round(sysStatus.disk.percent)} title={t('dashboard.disk')} value={`${sysStatus.disk.current} / ${sysStatus.disk.total}`} />
                </div >

                < div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4" >
                    < div className="space-y-4" >
                        <StatusBar>
                            <div className="flex items-center gap-4 text-sm font-bold">
                                <span className="text-gray-900">Xray:</span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[12px] font-mono font-medium tracking-tight">
                                    {sysStatus.xrayVersion}
                                </span>
                            </div>
                        </StatusBar>

                        <StatusBar>
                            <div className="flex items-center gap-4 text-sm font-bold">
                                <span className="text-gray-900">{t('dashboard.xray_status')}:</span>
                                <span className="px-2 py-1 rounded bg-gray-50 text-gray-400 text-[11px] font-medium flex items-center gap-1.5 border border-gray-100/50">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.6)] ${sysStatus.xrayStatus === 'running' ? 'bg-green-600' : 'bg-red-500'}`} />
                                    {sysStatus.xrayStatus}
                                </span>
                                <div className="flex gap-4 ml-4">
                                    <button
                                        onClick={() => setIsVersionModalOpen(true)}
                                        className="flex items-center justify-center px-5 py-1.5 bg-white text-black rounded-xl text-[13px] font-bold border border-black hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none"
                                        style={{ padding: '5px 24px 4px 24px' }}
                                    >
                                        <span>{t('dashboard.switch_version')}</span>
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`flex items-center justify-center px-5 py-1.5 bg-white ${sysStatus.xrayStatus === 'running' ? 'text-orange-500' : 'text-green-600'} rounded-xl text-[13px] font-bold border border-black hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none`}
                                        style={{ padding: '5px 24px 4px 24px' }}
                                    >
                                        <span>{sysStatus.xrayStatus === 'running' ? t('dashboard.stop') : t('dashboard.start')}</span>
                                    </button>
                                    <button
                                        onClick={handleRestart}
                                        className="flex items-center justify-center px-5 py-1.5 bg-white text-red-600 rounded-xl text-[13px] font-bold border border-black hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none"
                                        style={{ padding: '5px 24px 4px 24px' }}
                                    >
                                        <span>{t('dashboard.restart')}</span>
                                    </button>
                                </div>
                            </div>
                        </StatusBar>

                        <StatusBar>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <span className="text-gray-900">{t('dashboard.load')}:</span>
                                <span className="text-gray-400 font-mono font-medium">{sysStatus.load || "0 | 0 | 0"}</span>
                            </div>
                        </StatusBar>

                        <StatusBar>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-[14px] font-bold">
                                    <span className="text-gray-900">{t('dashboard.up_speed')}:</span>
                                    <span className="tabular-nums text-gray-400 font-medium">{sysStatus.netTraffic.up || "0 B / S"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[14px] font-bold">
                                    <span className="text-gray-900">{t('dashboard.down_speed')}:</span>
                                    <span className="tabular-nums text-gray-400 font-medium">{sysStatus.netTraffic.down || "0 B / S"}</span>
                                </div>
                            </div>
                        </StatusBar>
                    </div >

                    < div className="space-y-4" >
                        <StatusBar>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <span className="text-gray-900">{t('dashboard.uptime')}:</span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-gray-50 text-gray-400 text-[12px] tabular-nums font-medium border border-gray-100/50">{sysStatus.uptime.split(' ')[0]} {t('dashboard.days')}</span>
                            </div>
                        </StatusBar>

                        <StatusBar>
                            <div className="flex items-center gap-4 text-sm font-bold">
                                <span className="text-gray-900">{t('common.others')}:</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => useLogsStore.getState().open()}
                                        className="flex items-center justify-center px-5 py-1.5 bg-white text-black rounded-xl text-[13px] font-bold border border-black hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none"
                                        style={{ padding: '5px 24px 4px 24px' }}
                                    >
                                        <span>{t('dashboard.view_logs')}</span>
                                    </button>
                                </div>
                            </div>
                        </StatusBar>

                        <StatusBar>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <span className="text-gray-900">{t('dashboard.connections')}:</span>
                                <span className="text-gray-400 tabular-nums font-medium">
                                    {sysStatus.tcpCount} / {sysStatus.udpCount}
                                </span>
                            </div>
                        </StatusBar>
                    </div >
                </div >
            </div >
        </div >
    );
};