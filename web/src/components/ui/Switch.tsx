import { memo } from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Switch = memo<SwitchProps>(({ checked, onChange }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
        }}
        className="w-[52px] h-[30px] rounded-full transition-all duration-300 relative flex items-center cursor-pointer border-2 active:scale-95 outline-none"
        style={{
            backgroundColor: checked ? '#000000' : '#e5e7eb',
            borderColor: checked ? 'rgba(59, 130, 246, 0.5)' : '#d1d5db'
        }}
    >
        <div
            className="w-[24px] h-[24px] rounded-full shadow-lg transition-all duration-300 absolute"
            style={{
                backgroundColor: '#ffffff',
                left: checked ? '23px' : '1px'
            }}
        />
    </button>
));

Switch.displayName = 'Switch';
