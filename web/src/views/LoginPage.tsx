import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!username.trim() || !password.trim()) {
            setError(t('login.error_empty'));
            setIsLoading(false);
            return;
        }

        try {
            const success = await login(username, password);
            if (!success) {
                setError(t('login.error_failed'));
                setIsLoading(false);
            }
        } catch (err) {
            setError(t('login.error_failed'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
            {/* Minimal Decorative Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Login Main Container */}
            <div className={`w-full max-w-[400px] z-10 px-6 animate-in fade-in zoom-in duration-300 ${error ? 'animate-shake' : ''}`}>
                <div className="flex flex-col items-center">

                    {/* Brand Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-6xl font-black tracking-tighter text-black">
                            {t('login.title')}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="w-full space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                        setUsername(value);
                                    }}
                                    className="w-full h-12 px-5 bg-white border border-black rounded-xl outline-none focus:ring-0 transition-all text-black placeholder:text-gray-300 font-bold text-[14px] shadow-[0_1px_0_0_#94a3b8]"
                                    placeholder={t('login.username')}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 px-5 bg-white border border-black rounded-xl outline-none focus:ring-0 transition-all text-black placeholder:text-gray-300 font-bold text-[14px] shadow-[0_1px_0_0_#94a3b8]"
                                    placeholder={t('login.password')}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-center py-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-red-500 text-[12px] font-bold tracking-tight">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center bg-white text-black border border-black rounded-xl font-bold text-[13px] hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_#94a3b8] active:translate-y-px active:shadow-none transition-all shadow-[0_1px_0_0_#94a3b8] whitespace-nowrap leading-none"
                                style={{ padding: '8px 48px 7px 48px' }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <span>{t('login.submit')}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
