import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="w-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white md:text-3xl">Selamat Datang</h2>
                    <p className="mt-2 text-sm text-gray-400 md:text-base">
                        Masuk untuk mengakses sistem
                    </p>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300 md:text-base">
                            Email
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail size={18} className="text-gray-500" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                className="block w-full rounded-lg border border-[#1F2937] bg-[#111827] py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] md:text-base"
                                placeholder="nama@email.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-300 md:text-base">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full rounded-lg border border-[#1F2937] bg-[#111827] py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] md:text-base"
                                placeholder="Masukkan kata sandi"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', (e.target.checked || false) as false)
                                }
                                className="h-4 w-4 rounded border-[#1F2937] bg-[#111827] text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-gray-400 md:text-base">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <a
                                href={route('password.request')}
                                className="text-sm text-[#60A5FA] transition-colors hover:text-[#3B82F6] md:text-base"
                            >
                                Lupa password?
                            </a>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                    >
                        {processing && <Loader2 size={18} className="animate-spin" />}
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
