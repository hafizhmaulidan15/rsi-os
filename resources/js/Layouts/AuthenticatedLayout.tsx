import { Toaster } from '@/Components/ui/sonner';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Milk,
    FlaskConical,
    Factory,
    Package,
    BarChart3,
    Settings,
    ChevronDown,
    Menu,
    X,
    LogOut,
    User,
    Building2,
    Clock,
} from 'lucide-react';
import { cn } from '@/Utils/cn';

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    active?: boolean;
    children?: { label: string; href: string }[];
}

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const menuPaths: Record<string, string[]> = {
        'Milk Intake': ['/milk-intake'],
        QC: ['/qc'],
        Production: ['/production'],
        Inventory: ['/inventory'],
        Analytics: ['/analytics'],
    };

    const getInitialExpanded = (): string[] =>
        Object.entries(menuPaths)
            .filter(([, paths]) => paths.some((p) => url.startsWith(p)))
            .map(([label]) => label);

    const [expandedMenus, setExpandedMenus] = useState<string[]>(getInitialExpanded);

    useEffect(() => {
        setExpandedMenus(getInitialExpanded());
    }, [url]);

    const toggleMenu = (label: string) => {
        setExpandedMenus((prev) =>
            prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label],
        );
    };

    const isActive = (path: string) => url.startsWith(path);

    const navItems: NavItem[] = [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, active: isActive('/dashboard') },
        { label: 'Supplier', href: '/suppliers', icon: <Building2 size={20} />, active: isActive('/suppliers') },
        {
            label: 'Milk Intake',
            icon: <Milk size={20} />,
            active: isActive('/milk-intake'),
            children: [
                { label: 'Penerimaan', href: '/milk-intake' },
            ],
        },
        {
            label: 'QC',
            icon: <FlaskConical size={20} />,
            active: isActive('/qc'),
            children: [
                { label: 'QC Mentah', href: '/qc' },
                { label: 'QC Produk', href: '/qc/produk' },
            ],
        },
        {
            label: 'Production',
            icon: <Factory size={20} />,
            active: isActive('/production'),
            children: [
                { label: 'Mozzarella', href: '/production/mozzarella' },
                { label: 'Susu Cup', href: '/production/susu-cup' },
                { label: 'Batch Tracking', href: '/production/batches' },
            ],
        },
        {
            label: 'Inventory',
            icon: <Package size={20} />,
            active: isActive('/inventory'),
            children: [
                { label: 'Produk Jadi', href: '/inventory' },
                { label: 'Packaging', href: '/inventory?tab=packaging' },
                { label: 'Transactions', href: '/inventory/transactions/create' },
            ],
        },
        { label: 'Shelf Life', href: '/shelf-life', icon: <Clock size={20} />, active: isActive('/shelf-life') },
        {
            label: 'Analytics',
            icon: <BarChart3 size={20} />,
            active: isActive('/analytics'),
            children: [
                { label: 'Overview', href: '/analytics' },
                { label: 'QC Trends', href: '/analytics?tab=qc' },
                { label: 'Supplier', href: '/analytics?tab=suppliers' },
            ],
        },
        { label: 'Settings', href: '/settings', icon: <Settings size={20} />, active: isActive('/settings') },
    ];

    return (
        <>
            <Toaster />
            <div className="flex h-screen overflow-hidden bg-[#0F172A]">
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/50 lg:hidden',
                    sidebarOpen ? 'block' : 'hidden',
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#1F2937] bg-[#111827] transition-transform duration-200 lg:relative lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-[#1F2937] px-6">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">RSI OS</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                            item.active
                                                ? 'bg-[#2563EB]/10 text-[#2563EB]'
                                                : 'text-gray-400 hover:bg-[#1F2937] hover:text-white',
                                        )}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                                            item.active
                                                ? 'bg-[#2563EB]/10 text-[#2563EB]'
                                                : 'text-gray-400 hover:bg-[#1F2937] hover:text-white',
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            {item.icon}
                                            {item.label}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={cn(
                                                'transition-transform',
                                                expandedMenus.includes(item.label) && 'rotate-180',
                                            )}
                                        />
                                    </button>
                                )}
                                {item.children && expandedMenus.includes(item.label) && (
                                    <ul className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <li key={child.label}>
                                                <Link
                                                    href={child.href}
                                                    className={cn(
                                                        'block rounded-lg px-3 py-1.5 text-sm transition-colors',
                                                        isActive(child.href)
                                                            ? 'text-[#2563EB]'
                                                            : 'text-gray-500 hover:text-white',
                                                    )}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="border-t border-[#1F2937] p-4">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <User size={18} />
                        <span>{user.name}</span>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-[#1F2937] bg-[#111827] px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-400 hover:text-white lg:hidden"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                        >
                            <LogOut size={16} />
                            Logout
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#0F172A] p-6 pb-20 lg:pb-6">
                    {children}
                </main>

                <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#1F2937] bg-[#111827] px-2 py-2 lg:hidden">
                    {[
                        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
                        { label: 'QC', href: '/qc', icon: <FlaskConical size={20} /> },
                        { label: 'Production', href: '/production', icon: <Factory size={20} /> },
                        { label: 'Inventory', href: '/inventory', icon: <Package size={20} /> },
                        { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs transition-colors',
                                isActive(item.href)
                                    ? 'text-[#2563EB]'
                                    : 'text-gray-500 hover:text-white',
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            </div>
        </>
    );
}
