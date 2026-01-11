import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { MoreHorizontal } from 'lucide-react';

interface DropdownProps {
    children: React.ReactNode;
    onOpenChange?: (isOpen: boolean) => void;
}

export const Dropdown = ({ children, onOpenChange }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useClickOutside(() => {
        setIsOpen(false);
        onOpenChange?.(false);
    });

    return (
        <div className={`relative inline-block text-left ${isOpen ? 'z-50' : 'z-auto'}`} ref={ref}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const next = !isOpen;
                    setIsOpen(next);
                    onOpenChange?.(next);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
            >
                <MoreHorizontal size={20} strokeWidth={2.5} />
            </button>

            {isOpen && (
                <div className="absolute right-0 -mt-1 w-auto bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] p-0.5 z-50 animate-in zoom-in-95 fade-in duration-200 origin-top-right overflow-hidden">
                    <div className="flex flex-col" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps {
    onClick: () => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger';
}

export const DropdownItem = ({ onClick, children, icon, variant = 'default' }: DropdownItemProps) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`
                flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[12px] font-bold transition-all active:scale-[0.97] hover:scale-[1.02]
                ${variant === 'danger'
                    ? 'text-red-600 hover:bg-red-500/10'
                    : 'text-gray-700 hover:bg-black/5 hover:text-black'}
            `}
        >
            {icon && <span className="opacity-70 scale-75 block w-4 flex-shrink-0">{icon}</span>}
            <span className="whitespace-nowrap">{children}</span>
        </button>
    );
};
