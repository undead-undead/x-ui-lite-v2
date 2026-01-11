import { useRef, useEffect } from 'react';
import { useLogsStore } from '../store/useLogsStore';
import { X, Terminal, RefreshCw, ChevronDown } from 'lucide-react';

export const LogsModal = () => {
    const { isOpen, close, logs, isLoading, fetchLogs } = useLogsStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-white/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={close}
            />

            <div className="relative w-full max-w-4xl h-[80vh] bg-white border border-gray-100 rounded-4xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">

                <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Logs</h2>
                            <p className="text-[12px] font-medium text-gray-400 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Real-time monitoring
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchLogs()}
                            disabled={isLoading}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={close}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 bg-gray-50/50 space-y-2 font-mono text-[13px] selection:bg-black selection:text-white"
                >
                    {logs.length === 0 && !isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                            <Terminal size={48} strokeWidth={1} className="opacity-20" />
                            <p className="font-medium">No logs found</p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="group flex gap-4 hover:bg-white/80 p-1.5 rounded-lg transition-colors">
                                <span className="text-gray-300 select-none w-10 text-right">{index + 1}</span>
                                <span className="text-gray-700 break-all leading-relaxed">{log}</span>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex items-center gap-3 text-gray-400 animate-pulse py-2">
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Refreshing data...</span>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-50 bg-white flex items-center justify-between text-[12px] text-gray-400 font-medium">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            UTF-8
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            {logs.length} Lines
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            }
                        }}
                        className="flex items-center gap-2 text-gray-900 hover:text-black transition-colors"
                    >
                        <span>Scroll to bottom</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
