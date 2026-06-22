import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

interface QcResult {
    id: number;
    milk_batch: { batch_number: string; supplier: { name: string } } | null;
    production_batch: { batch_number: string; production_type: string } | null;
    qc_type: string;
    total_solids: number | null;
    fat: number | null;
    protein: number | null;
    ph: number | null;
    aroma: string | null;
    taste: string | null;
    texture: string | null;
    temperature: number | null;
    result: string;
}

interface Props {
    qcResults: { data: QcResult[] };
}

export default function QcIndex({ qcResults }: Props) {
    const columns: ColumnDef<QcResult>[] = [
        {
            accessorKey: 'milk_batch.batch_number',
            header: 'Batch',
            cell: ({ row }) => {
                const mb = row.original.milk_batch?.batch_number;
                const pb = row.original.production_batch?.batch_number;
                return <span className="font-mono text-[#2563EB]">{mb || pb || '-'}</span>;
            },
        },
        {
            accessorKey: 'qc_type',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.getValue('qc_type') as string;
                return <span>{type === 'pasteurized' ? 'Pasteurisasi' : 'Mentah'}</span>;
            },
        },
        {
            accessorKey: 'ph',
            header: 'pH',
            cell: ({ row }) => row.getValue('ph') ?? '-',
        },
        {
            accessorKey: 'result',
            header: 'Hasil',
            cell: ({ row }) => <Badge variant={row.getValue('result') === 'pass' ? 'success' : 'danger'}>{String(row.getValue('result')).toUpperCase()}</Badge>,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Quality Control" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Quality Control</h1>
                    <Link href="/qc/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> Input QC
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={qcResults.data} searchColumn="id" searchPlaceholder="Cari..." />
            </div>
        </AuthenticatedLayout>
    );
}
