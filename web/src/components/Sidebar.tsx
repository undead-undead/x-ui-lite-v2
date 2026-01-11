import { Link } from '@tanstack/react-router';
import { memo, useMemo, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export const Sidebar = memo(() => {
    const { t } = useTranslation();

    const logout = useAuthStore((state) => state.logout);

    const menuItems = useMemo(() => [
        {
            path: '/',
            label: t('sidebar.dashboard'),
        },
        {
            path: '/inbounds',
            label: t('sidebar.inbounds'),
        },
        {
            path: '/settings',
            label: t('sidebar.settings'),
        },
    ], [t]);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    return (
        <div className="w-48 h-screen bg-white border-r border-gray-200 flex flex-col relative z-20 font-sans shadow-lg">
            <div className="h-8" />

            {/* Navigation */}
            <nav className="flex-1 px-3 flex flex-col gap-1.5">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path as any}
                        activeOptions={{ exact: item.path === '/' }}
                        className="w-full relative group transition-all duration-200"
                        activeProps={{
                            className: "bg-gray-100 text-black rounded-xl"
                        }}
                        inactiveProps={{
                            className: "text-gray-500 hover:bg-gray-50 hover:text-black rounded-xl"
                        }}
                    >
                        {({ isActive }) => (
                            <div className="flex items-center px-4 py-2.5 relative">
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-5 bg-black rounded-full" />
                                )}
                                <span className={`text-[15px] font-bold ${isActive ? 'ml-2' : ''} transition-all`}>
                                    {item.label}
                                </span>
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto flex flex-col gap-2">
                <a
                    href="https://buymeacoffee.com/undeadundead"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center bg-gray-100 text-gray-700 rounded-xl text-[14px] font-bold border border-gray-300 hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none no-underline"
                    style={{ padding: '8px 12px 7px 12px' }}
                >
                    <span>☕ {t('sidebar.sponsor')}</span>
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center bg-white text-black rounded-xl text-[14px] font-bold border border-black hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none"
                    style={{ padding: '8px 12px 7px 12px' }}
                >
                    <span>{t('sidebar.logout')}</span>
                </button>
            </div>
        </div>
    );
});

Sidebar.displayName = 'Sidebar';