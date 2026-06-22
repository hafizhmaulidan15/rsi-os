import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Eye, Pencil } from 'lucide-react';

interface MilkBatch {
    id: number;
    batch_number: string;
    supplier: { name: string } | null;
    received_date: string;
    received_time: string;
    volume_liter: number;
    production_target: string;
    status: string;
}

interface Props {
    milkBatches: { data: MilkBatch[] };
}

const statusVariant = (status: string) => {
    switch (status) {
        case 'pending_qc': return 'warning' as const;
        case 'approved': return 'success' as const;
        case 'rejected': return 'danger' as const;
        case 'consumed': return 'default' as const;
        default: return 'default' as const;
    }
};

const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending_qc: 'Pending QC',
        approved: 'Approved',
        rejected: 'Rejected',
        consumed: 'Consumed',
    };
    return labels[status] || status;
};

export default function MilkIntakeIndex({ milkBatches }: Props) {
    const columns: ColumnDef<MilkBatch>[] = [
        { accessorKey: 'batch_number', header: 'Batch', cell: ({ row }) => <span className="font-mono text-[#2563EB]">{row.getValue('batch_number')}</span> },
        { accessorKey: 'supplier.name', header: 'Supplier', cell: ({ row }) => row.original.supplier?.name || '-' },
        { accessorKey: 'received_date', header: 'Tanggal', cell: ({ row }) => <span className="text-gray-400">{row.getValue('received_date')}</span> },
        { accessorKey: 'received_time', header: 'Jam', cell: ({ row }) => <span className="text-gray-400">{row.getValue('received_time')}</span> },
        { accessorKey: 'volume_liter', header: 'Volume', cell: ({ row }) => `${row.getValue('volume_liter')} L` },
        { accessorKey: 'production_target', header: 'Target', cell: ({ row }) => <span className="capitalize">{row.getValue('production_target')}</span> },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <Badge variant={statusVariant(row.getValue('status'))}>{statusLabel(row.getValue('status'))}</Badge>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Link href={`/milk-intake/${row.original.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/milk-intake/${row.original.id}/edit`}>
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Milk Intake" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Penerimaan Susu</h1>
                    <Link href="/milk-intake/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Penerimaan
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={milkBatches.data} searchColumn="batch_number" searchPlaceholder="Cari batch..." />
            </div>
        </AuthenticatedLayout>
    );
}
