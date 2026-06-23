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

                    <div className="relative z-10 px-8 md:px-16 text-center">
                        <div className="mb-8 flex items-center justify-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#2563EB] shadow-lg shadow-[#2563EB]/30 md:h-20 md:w-20">
                                <i className="fa-solid fa-cow text-3xl text-white md:text-4xl"></i>
                            </div>
                            <div className="text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">RSI OS</h1>
                                <p className="text-sm text-gray-400 md:text-base">Rumah Susu Indonesia</p>
                            </div>
                        </div>

                        <p className="text-base leading-relaxed text-gray-400 md:text-lg md:leading-8">
                            Sistem operasional, manajemen, dan monitoring<br />
                            produksi susu pasteurisasi Rumah Susu Indonesia —<br />
                            terintegrasi dari hulu ke hilir.
                        </p>
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-4 md:p-5 text-center">
                                <i className="fa-solid fa-store text-lg text-[#60A5FA] md:text-xl"></i>
                                <p className="mt-2 text-sm font-semibold text-white md:text-base">100% Produk Lokal</p>
                                <p className="mt-1 text-xs text-gray-500 md:text-sm">Pemberdayaan peternak sapi perah lokal</p>
                            </div>
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-4 md:p-5 text-center">
                                <i className="fa-solid fa-snowflake text-lg text-[#60A5FA] md:text-xl"></i>
                                <p className="mt-2 text-sm font-semibold text-white md:text-base">Cold Chain System</p>
                                <p className="mt-1 text-xs text-gray-500 md:text-sm">Kesegaran terjaga dari kandang ke konsumen</p>
                            </div>
                            <div className="rounded-lg border border-[#1F2937] bg-[#111827]/50 p-4 md:p-5 text-center">
                                <i className="fa-solid fa-certificate text-lg text-[#60A5FA] md:text-xl"></i>
                                <p className="mt-2 text-sm font-semibold text-white md:text-base">BPOM Certified</p>
                                <p className="mt-1 text-xs text-gray-500 md:text-sm">Terdaftar resmi & aman dikonsumsi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex w-full items-center justify-center bg-[#0F172A] px-6 lg:w-1/2">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="mb-8 flex flex-col items-center lg:hidden">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#2563EB] shadow-lg shadow-[#2563EB]/30">
                                <i className="fa-solid fa-cow text-2xl text-white"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-white">RSI OS</h1>
                            <p className="text-sm text-gray-500">Rumah Susu Indonesia</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
