import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface AuditLog {
    id: number;
    user: { name: string; email: string } | null;
    action: string;
    table_name: string;
    record_id: number | null;
    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    created_at: string;
}

interface Props {
    logs: {
        data: AuditLog[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

const actionLabel = (action: string) => {
    if (action.includes('created')) return { text: 'Dibuat', variant: 'success' as const };
    if (action.includes('updated')) return { text: 'Diubah', variant: 'warning' as const };
    if (action.includes('deleted')) return { text: 'Dihapus', variant: 'danger' as const };
    return { text: action, variant: 'default' as const };
};

export default function AuditLogsIndex({ logs }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Audit Logs" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
                    <p className="mt-1 text-sm text-gray-400">Riwayat perubahan data sistem</p>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent>
                        {logs.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#1F2937] text-gray-400">
                                            <th className="pb-3 font-medium">Waktu</th>
                                            <th className="pb-3 font-medium">User</th>
                                            <th className="pb-3 font-medium">Aksi</th>
                                            <th className="pb-3 font-medium">Tabel</th>
                                            <th className="pb-3 font-medium">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.data.map((log) => {
                                            const { text: actionText, variant } = actionLabel(log.action);
                                            return (
                                                <tr key={log.id} className="border-b border-[#1F2937] last:border-0">
                                                    <td className="py-3 text-gray-400">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                                    <td className="py-3 text-white">{log.user?.name ?? 'System'}</td>
                                                    <td className="py-3"><Badge variant={variant}>{actionText}</Badge></td>
                                                    <td className="py-3 text-gray-400 capitalize">{log.table_name.replace(/_/g, ' ')}</td>
                                                    <td className="py-3 text-gray-500 text-xs max-w-xs truncate">
                                                        {log.new_data ? JSON.stringify(log.new_data).slice(0, 80) + '...' : '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">Belum ada audit log</p>
                        )}

                        {logs.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between border-t border-[#1F2937] pt-4">
                                <p className="text-sm text-gray-400">{logs.from}–{logs.to} dari {logs.total}</p>
                                <div className="flex gap-2">
                                    {logs.links.map((link, i) => {
                                        if (!link.url) return <span key={i} className="rounded bg-[#1F2937] px-3 py-1 text-sm text-gray-600">{link.label}</span>;
                                        return (
                                            <Link key={i} href={link.url} className={`rounded px-3 py-1 text-sm transition-colors ${link.active ? 'bg-[#2563EB] text-white' : 'bg-[#1F2937] text-gray-400 hover:bg-[#374151]'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
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
