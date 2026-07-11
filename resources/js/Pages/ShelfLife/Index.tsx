import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface ShelfLifeRecord {
    id: number;
    production_batch: {
        id: number;
        batch_number: string;
        start_time: string;
        milk_batch: {
            id: number;
            batch_number: string;
            supplier: { name: string } | null;
        } | null;
    } | null;
    chiller_in_date: string;
    chiller_in_time: string;
    expiry_date: string;
    remaining_days: number;
}

interface Props {
    records: {
        data: ShelfLifeRecord[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function ShelfLifeIndex({ records }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Shelf Life" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Shelf Life Monitoring</h1>
                    <p className="mt-1 text-sm text-gray-400">Track expiry dates and remaining shelf life of all production batches</p>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardHeader>
                        <CardTitle className="text-white">Riwayat Shelf Life</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {records.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#1F2937] text-gray-400">
                                            <th className="pb-3 pr-4 font-medium">Batch</th>
                                            <th className="pb-3 pr-4 font-medium">Supplier</th>
                                            <th className="pb-3 pr-4 font-medium">Produksi</th>
                                            <th className="pb-3 pr-4 font-medium">Chiller</th>
                                            <th className="pb-3 pr-4 font-medium">Expired</th>
                                            <th className="pb-3 pr-4 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.data.map((record) => (
                                            <tr key={record.id} className="border-b border-[#1F2937] last:border-0">
                                                <td className="py-3 pr-4 text-white">
                                                    {record.production_batch?.batch_number ?? '—'}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-400">
                                                    {record.production_batch?.milk_batch?.supplier?.name ?? '—'}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-300">
                                                    {record.production_batch?.start_time?.slice(0, 10) ?? '—'}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-300">
                                                    {record.chiller_in_date ?? '—'}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-300">
                                                    {record.expiry_date}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {record.remaining_days <= 0 ? (
                                                        <Badge variant="danger">Expired</Badge>
                                                    ) : record.remaining_days <= 7 ? (
                                                        <Badge variant="warning">{record.remaining_days} hari lagi</Badge>
                                                    ) : (
                                                        <Badge variant="success">{record.remaining_days} hari</Badge>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {record.production_batch && (
                                                        <Link
                                                            href={`/production/${record.production_batch.id}`}
                                                            className="text-sm text-[#60A5FA] hover:text-[#3B82F6]"
                                                        >
                                                            Detail
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 text-gray-500">
                                <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">Belum ada data shelf life</p>
                            </div>
                        )}

                        {records.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between border-t border-[#1F2937] pt-4">
                                <p className="text-sm text-gray-400">
                                    {records.from}–{records.to} dari {records.total}
                                </p>
                                <div className="flex gap-2">
                                    {records.links.map((link, i) => {
                                        if (!link.url) {
                                            return (
                                                <span key={i} className="rounded bg-[#1F2937] px-3 py-1 text-sm text-gray-600">
                                                    {link.label}
                                                </span>
                                            );
                                        }
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`rounded px-3 py-1 text-sm transition-colors ${
                                                    link.active
                                                        ? 'bg-[#2563EB] text-white'
                                                        : 'bg-[#1F2937] text-gray-400 hover:bg-[#374151] hover:text-white'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
