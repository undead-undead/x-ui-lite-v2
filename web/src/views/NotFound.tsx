import { Link, useNavigate } from '@tanstack/react-router';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden font-sans">
            <div className="max-w-2xl w-full text-center relative z-10 animate-in fade-in zoom-in duration-1000">
                <div className="mb-8">
                    <h1 className="text-[180px] font-black text-gray-200 leading-none tracking-tighter select-none">
                        404
                    </h1>
                    <div className="h-1 w-32 bg-gray-300 mx-auto rounded-full" />
                </div>

                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-md mx-auto">
                        Sorry, the page you are looking for does not exist or has been moved.
                        Please check the URL or return to the dashboard.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="h-12 px-8 bg-gray-900 text-white rounded-xl font-bold text-[14px] tracking-tight flex items-center gap-2.5 hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                    >
                        <Home size={18} strokeWidth={2.5} />
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={() => navigate({ to: -1 as any })}
                        className="h-12 px-8 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-[14px] tracking-tight flex items-center gap-2.5 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        Back
                    </button>
                </div>

                <div className="mt-16 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Error Code: 404 Not Found
                    </span>
                </div>
            </div>
        </div>
    );
};
