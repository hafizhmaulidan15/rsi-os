import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Milk, Factory, FlaskConical, Package, AlertTriangle, Clock, Server } from 'lucide-react';

interface PageProps {
    activeBatches: any[];
    todayProduction: number;
    todayQc: number;
    latestQc: any[];
    shelfLifeAlerts: any[];
    expiredBatches: any[];
    inventorySummary: any[];
}

export default function Dashboard({
    activeBatches,
    todayProduction,
    todayQc,
    latestQc,
    shelfLifeAlerts,
    expiredBatches,
    inventorySummary,
}: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="rounded-lg border border-[#D97706]/20 bg-[#D97706]/5 px-4 py-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Server size={16} className="text-[#D97706]" />
                        <span>
                            Server akan <strong className="text-gray-300">sleep</strong> setelah <strong className="text-gray-300">15 menit</strong> tidak ada aktivitas. Saat diakses lagi, perlu <strong className="text-gray-300">30 detik - 1 menit</strong> cold start. Bersabar ya.
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Batch Aktif</CardTitle>
                            <Factory className="h-4 w-4 text-[#2563EB]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{activeBatches.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Produksi Hari Ini</CardTitle>
                            <Milk className="h-4 w-4 text-[#16A34A]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{todayProduction}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">QC Hari Ini</CardTitle>
                            <FlaskConical className="h-4 w-4 text-[#D97706]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{todayQc}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Shelf Life Alerts</CardTitle>
                            <Clock className="h-4 w-4 text-[#DC2626]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{shelfLifeAlerts.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="text-white">Latest QC</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestQc.length === 0 ? (
                                <p className="text-sm text-gray-500">Belum ada data QC</p>
                            ) : (
                                <div className="space-y-3">
                                    {latestQc.map((qc: any) => (
                                        <div key={qc.id} className="flex items-center justify-between border-b border-[#1F2937] pb-2 last:border-0">
                                            <div>
                                                <p className="text-sm font-medium text-white">{qc.milk_batch?.supplier?.name}</p>
                                                <p className="text-xs text-gray-500">TS: {qc.total_solids} | Fat: {qc.fat} | Protein: {qc.protein}</p>
                                            </div>
                                            <Badge variant={qc.result === 'pass' ? 'success' : 'danger'}>
                                                {qc.result.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="text-white">Inventory Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {inventorySummary.length === 0 ? (
                                <p className="text-sm text-gray-500">Belum ada data inventory</p>
                            ) : (
                                <div className="space-y-2">
                                    {inventorySummary.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white">{item.stock} {item.unit}</span>
                                                <Badge variant={item.status === 'ok' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}>
                                                    {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Low' : 'Habis'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {(shelfLifeAlerts.length > 0 || expiredBatches.length > 0) && (
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <AlertTriangle className="h-5 w-5 text-[#D97706]" />
                                Shelf Life Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {expiredBatches.map((s: any) => (
                                    <div key={s.id} className="flex items-center justify-between rounded-lg bg-[#DC2626]/10 p-2">
                                        <span className="text-sm text-white">{s.production_batch?.batch_number}</span>
                                        <Badge variant="danger">Expired</Badge>
                                    </div>
                                ))}
                                {shelfLifeAlerts.map((s: any) => (
                                    <div key={s.id} className="flex items-center justify-between rounded-lg bg-[#D97706]/10 p-2">
                                        <span className="text-sm text-white">{s.production_batch?.batch_number}</span>
                                        <Badge variant="warning">{s.remaining_days} hari lagi</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardHeader>
                        <CardTitle className="text-white">Mozzarella Chiller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeBatches.filter((b: any) => b.production_type === 'mozzarella').length === 0 ? (
                            <p className="text-sm text-gray-500">Tidak ada batch mozzarella di chiller</p>
                        ) : (
                            <div className="space-y-2">
                                {activeBatches.filter((b: any) => b.production_type === 'mozzarella').map((batch: any) => (
                                    <div key={batch.id} className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                                        <div>
                                            <p className="text-sm font-medium text-white">{batch.batch_number}</p>
                                            <p className="text-xs text-gray-500">{batch.milk_batch?.supplier?.name}</p>
                                        </div>
                                        <Badge variant={batch.status === 'chiller' ? 'warning' : 'default'}>
                                            {batch.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
