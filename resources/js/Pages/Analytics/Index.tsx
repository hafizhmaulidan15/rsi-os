import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { FlaskConical, Factory, Package, TrendingDown } from 'lucide-react';

interface YieldItem {
    batch: string;
    supplier: string;
    predicted: number;
    actual: number;
    variance: number;
    date: string;
}

interface QcItem {
    date: string;
    supplier: string;
    total_solids: number;
    fat: number;
    protein: number;
    ph: number;
    result: string;
}

interface SupplierItem {
    supplier: string;
    total_batches: number;
    avg_volume: number;
}

interface ShelfLifeItem {
    batch: string;
    expiry_date: string;
    remaining_days: number;
}

interface InventoryItem {
    item: string;
    stock: number;
    min_stock: number;
}

interface Props {
    yieldData: YieldItem[];
    qcTrend: QcItem[];
    supplierTrend: SupplierItem[];
    shelfLifeData: ShelfLifeItem[];
    inventoryTrend: InventoryItem[];
}

export default function AnalyticsIndex({ yieldData, qcTrend, supplierTrend, shelfLifeData, inventoryTrend }: Props) {
    const url = usePage().url;
    const tab = new URLSearchParams(url.split('?')[1] || '').get('tab') || 'overview';

    const latestYield = yieldData.slice(0, 20);
    const recentQc = qcTrend.slice(0, 30);
    const expiredCount = shelfLifeData.filter((s) => s.remaining_days <= 0).length;
    const expiringSoonCount = shelfLifeData.filter((s) => s.remaining_days > 0 && s.remaining_days <= 7).length;
    const lowStockItems = inventoryTrend.filter((i) => i.stock <= i.min_stock);

    const tabs = [
        { label: 'Overview', href: '/analytics', key: 'overview' },
        { label: 'QC Trends', href: '/analytics?tab=qc', key: 'qc' },
        { label: 'Supplier', href: '/analytics?tab=suppliers', key: 'suppliers' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Analytics" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Analytics</h1>
                        <p className="mt-1 text-sm text-gray-400">Performance trends and insights</p>
                    </div>
                    <div className="flex gap-1 rounded-lg bg-[#1F2937] p-1">
                        {tabs.map((t) => (
                            <Link
                                key={t.key}
                                href={t.href}
                                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                                    tab === t.key
                                        ? 'bg-[#2563EB] text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {t.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {tab === 'overview' && (
                    <>
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Average Yield Variance</CardTitle>
                                    <TrendingDown className="h-4 w-4 text-[#2563EB]" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-white">
                                        {yieldData.length > 0
                                            ? `${(yieldData.reduce((s, y) => s + y.variance, 0) / yieldData.length).toFixed(1)}%`
                                            : '—'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">QC Pass Rate</CardTitle>
                                    <FlaskConical className="h-4 w-4 text-[#16A34A]" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {qcTrend.length > 0
                                            ? `${((qcTrend.filter((q) => q.result === 'pass' || q.result === 'warning').length / qcTrend.length) * 100).toFixed(0)}%`
                                            : '—'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Suppliers Active</CardTitle>
                                    <Factory className="h-4 w-4 text-[#D97706]" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-white">{supplierTrend.length}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Low Stock Items</CardTitle>
                                    <Package className="h-4 w-4 text-[#DC2626]" />
                                </CardHeader>
                                <CardContent>
                                    <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {lowStockItems.length}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader>
                                    <CardTitle className="text-white">Yield Trend (Predicted vs Actual)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {latestYield.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={latestYield}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                                                <XAxis dataKey="batch" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval="preserveStartEnd" />
                                                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="predicted" stroke="#3B82F6" name="Predicted (kg)" strokeWidth={2} />
                                                <Line type="monotone" dataKey="actual" stroke="#10B981" name="Actual (kg)" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="py-8 text-center text-sm text-gray-500">No yield data yet.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader>
                                    <CardTitle className="text-white">Inventory Stock Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {inventoryTrend.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={inventoryTrend}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                                                <XAxis dataKey="item" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval="preserveStartEnd" />
                                                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                                <Legend />
                                                <Bar dataKey="stock" fill="#3B82F6" name="Current Stock" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="min_stock" fill="#EF4444" name="Min Stock" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="py-8 text-center text-sm text-gray-500">No inventory data yet.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader>
                                    <CardTitle className="text-white">Shelf Life Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg bg-[#0F172A] px-4 py-3">
                                            <span className="text-sm text-gray-400">Expired</span>
                                            <span className={`font-bold ${expiredCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {expiredCount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-[#0F172A] px-4 py-3">
                                            <span className="text-sm text-gray-400">Expiring in 7 days</span>
                                            <span className={`font-bold ${expiringSoonCount > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                {expiringSoonCount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-[#0F172A] px-4 py-3">
                                            <span className="text-sm text-gray-400">Healthy</span>
                                            <span className="font-bold text-emerald-400">
                                                {shelfLifeData.filter((s) => s.remaining_days > 7).length}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader>
                                    <CardTitle className="text-white">Supplier Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {supplierTrend.length > 0 ? (
                                        <div className="space-y-3">
                                            {supplierTrend.map((s, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg bg-[#0F172A] px-4 py-3">
                                                    <span className="text-sm text-white">{s.supplier}</span>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-white">{s.total_batches} batches</p>
                                                        <p className="text-xs text-gray-400">{s.avg_volume} L avg</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-8 text-center text-sm text-gray-500">No supplier data yet.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {tab === 'qc' && (
                    <div className="grid gap-6 md:grid-cols-1">
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">QC Parameters Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentQc.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={recentQc}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval="preserveStartEnd" />
                                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="total_solids" stroke="#8B5CF6" name="Total Solids %" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="fat" stroke="#F59E0B" name="Fat %" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="protein" stroke="#EC4899" name="Protein %" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="ph" stroke="#10B981" name="pH" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="py-8 text-center text-sm text-gray-500">No QC data yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {tab === 'suppliers' && (
                    <div className="grid gap-6 md:grid-cols-1">
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Supplier Volume Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {supplierTrend.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={supplierTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                                            <XAxis dataKey="supplier" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                                            <Legend />
                                            <Bar dataKey="total_batches" fill="#3B82F6" name="Total Batches" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="avg_volume" fill="#10B981" name="Avg Volume (L)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="py-8 text-center text-sm text-gray-500">No supplier data yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
