import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Eye } from 'lucide-react';

interface ProductionBatch {
    id: number;
    batch_number: string;
    production_type: string;
    milk_batch: { supplier: { name: string } } | null;
    start_time: string | null;
    status: string;
}

interface Props {
    productionBatches: { data: ProductionBatch[] };
    filter?: string;
}

const statusVariant = (status: string) => {
    switch (status) {
        case 'production': return 'default' as const;
        case 'chiller': return 'warning' as const;
        case 'ready': return 'success' as const;
        case 'closed': return 'default' as const;
        default: return 'default' as const;
    }
};

const statusLabel = (status: string) => {
    switch (status) {
        case 'production': return 'In Production';
        case 'chiller': return 'In Chiller';
        case 'ready': return 'Ready';
        case 'closed': return 'Closed';
        default: return status;
    }
};

export default function ProductionIndex({ productionBatches, filter = 'all' }: Props) {
    const tabs = [
        { label: 'All Batches', href: '/production/batches', key: 'all' },
        { label: 'Mozzarella', href: '/production/mozzarella', key: 'mozzarella' },
        { label: 'Susu Cup', href: '/production/susu-cup', key: 'susu_cup' },
    ];

    const columns: ColumnDef<ProductionBatch>[] = [
        { accessorKey: 'batch_number', header: 'Batch', cell: ({ row }) => <span className="font-mono text-[#2563EB]">{row.getValue('batch_number')}</span> },
        { accessorKey: 'production_type', header: 'Type', cell: ({ row }) => <span className="capitalize">{row.getValue('production_type')}</span> },
        { accessorKey: 'milk_batch.supplier.name', header: 'Supplier', cell: ({ row }) => <span className="text-gray-400">{row.original.milk_batch?.supplier?.name || '-'}</span> },
        {
            accessorKey: 'start_time',
            header: 'Start',
            cell: ({ row }) => {
                const val = row.getValue('start_time');
                return <span className="text-gray-400">{val ? String(val).slice(0, 16).replace('T', ' ') : '-'}</span>;
            },
        },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusVariant(row.getValue('status'))}>{statusLabel(row.getValue('status'))}</Badge> },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <Link href={`/production/${row.original.id}`}>
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Production" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Production</h1>
                    <Link href="/production/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> New Batch
                        </Button>
                    </Link>
                </div>

                <div className="flex gap-1 rounded-lg bg-[#1F2937] p-1 w-fit">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                                filter === tab.key
                                    ? 'bg-[#2563EB] text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <DataTable columns={columns} data={productionBatches.data} searchColumn="batch_number" searchPlaceholder="Cari batch..." />
            </div>
        </AuthenticatedLayout>
    );
}
