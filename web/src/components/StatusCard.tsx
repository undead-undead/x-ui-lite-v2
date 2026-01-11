import React from 'react';

interface StatusCircleProps {
    percent: number;
    title: string;
    value: string;
}

export const StatusCircle: React.FC<StatusCircleProps> = ({ percent, title, value }) => {
    const size = 100;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="bg-white border border-gray-200 rounded-4xl p-8 flex flex-col items-center justify-between min-h-[220px] transition-all duration-500 hover:shadow-lg group">
            <div className="relative">
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#6b7280"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[17px] font-bold text-gray-900 tabular-nums">{Math.round(percent)}%</span>
                </div>
            </div>

            <div className="text-center mt-4">
                <p className="text-[13px] font-bold text-gray-500 tracking-tight uppercase mb-1">{title}</p>
                <p className="text-[15px] font-bold text-gray-700 tracking-tight">{value}</p>
            </div>
        </div>
    );
};

interface InfoCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-4xl p-8 flex flex-col justify-between min-h-[200px] transition-all duration-500 hover:shadow-lg group">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center transition-all group-hover:scale-110 duration-500 shadow-sm">
                    {React.cloneElement(icon as React.ReactElement<any>, { size: 22, strokeWidth: 2.5, className: "text-gray-600" })}
                </div>
                {subtitle && (
                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2">
                        {subtitle}
                    </span>
                )}
            </div>

            <div className="mt-6">
                <p className="text-[13px] font-bold text-gray-500 tracking-tight uppercase mb-1.5">{title}</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    );
};