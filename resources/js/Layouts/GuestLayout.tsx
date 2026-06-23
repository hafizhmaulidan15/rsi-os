import { Toaster } from '@/Components/ui/sonner';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Toaster />
            <div className="flex min-h-screen">
                {/* Left side - Branding */}
                <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] lg:flex lg:flex-col lg:items-center lg:justify-center">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#2563EB]" />
                        <div className="absolute -bottom-10 -right-10 h-96 w-96 rounded-full bg-[#3B82F6]" />
                        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-[#60A5FA]" />
                    </div>

                    <div className="relative z-10 px-12 text-center">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2563EB] shadow-lg shadow-[#2563EB]/30">
                                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
                                    <path d="M21 8.5c-.5-.5-4.5-2.5-9-2.5S3.5 8 3 8.5c-.5.5-1 1-1 2s.5 3 1 4c.4.7 1.5 1.5 3 2 1.5.5 3.5.5 6 .5s4.5 0 6-.5c1.5-.5 2.6-1.3 3-2 .5-1 .5-2.5 1-4s-.5-2-1-3zM12 13c-2.5 0-4.5-.7-5-1-.5-.3-.5-.7-.5-1s0-.7.5-1c.5-.3 2.5-1 5-1s4.5.7 5 1c.5.3.5.7.5 1s0 .7-.5 1c-.5.3-2.5 1-5 1z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl font-bold tracking-tight text-white">RSI OS</h1>
                                <p className="text-xs text-gray-400">Rumah Susu Indonesia</p>
                            </div>
                        </div>

                        <h2 className="mb-3 text-3xl font-bold text-white">
                            ERP untuk Susu Lokal Berkualitas
                        </h2>
                        <p className="text-base leading-relaxed text-gray-400">
                            Dari Kandang ke Konsumen, Satu Platform.<br />
                            Manajemen produksi, QC, inventory & traceability.
                        </p>

                        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-3">
                                <p className="text-lg font-bold text-[#60A5FA]">15+</p>
                                <p className="text-xs text-gray-500">Supplier</p>
                            </div>
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-3">
                                <p className="text-lg font-bold text-[#60A5FA]">200L+</p>
                                <p className="text-xs text-gray-500">Produksi/Hari</p>
                            </div>
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-3">
                                <p className="text-lg font-bold text-[#60A5FA]">100%</p>
                                <p className="text-xs text-gray-500">Traceability</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex w-full items-center justify-center bg-[#0F172A] px-6 lg:w-1/2">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="mb-8 flex flex-col items-center lg:hidden">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] shadow-lg shadow-[#2563EB]/30">
                                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                                    <path d="M21 8.5c-.5-.5-4.5-2.5-9-2.5S3.5 8 3 8.5c-.5.5-1 1-1 2s.5 3 1 4c.4.7 1.5 1.5 3 2 1.5.5 3.5.5 6 .5s4.5 0 6-.5c1.5-.5 2.6-1.3 3-2 .5-1 .5-2.5 1-4s-.5-2-1-3zM12 13c-2.5 0-4.5-.7-5-1-.5-.3-.5-.7-.5-1s0-.7.5-1c.5-.3 2.5-1 5-1s4.5.7 5 1c.5.3.5.7.5 1s0 .7-.5 1c-.5.3-2.5 1-5 1z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">RSI OS</h1>
                            <p className="text-sm text-gray-500">Rumah Susu Indonesia</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
