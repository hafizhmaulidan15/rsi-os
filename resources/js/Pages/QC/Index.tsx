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
    peroxide: string | null;
    result: string;
}

interface Props {
    qcType: 'raw' | 'pasteurized';
    qcResults: { data: QcResult[] };
}

export default function QcIndex({ qcType, qcResults }: Props) {
    const isProduk = qcType === 'pasteurized';
    const title = isProduk ? 'QC Produk' : 'QC Mentah';

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
        ...(isProduk
            ? [
                {
                    accessorKey: 'production_batch.production_type',
                    header: 'Produk',
                    cell: ({ row }: any) => {
                        const type = row.original.production_batch?.production_type || '-';
                        return <span className="capitalize">{type}</span>;
                    },
                } as ColumnDef<QcResult>,
            ]
            : [
                {
                    accessorKey: 'milk_batch.supplier.name',
                    header: 'Supplier',
                    cell: ({ row }: any) => row.original.milk_batch?.supplier?.name || '-',
                } as ColumnDef<QcResult>,
                {
                    accessorKey: 'total_solids',
                    header: 'TS',
                    cell: ({ row }: any) => (row.getValue('total_solids') ?? '-'),
                } as ColumnDef<QcResult>,
                {
                    accessorKey: 'fat',
                    header: 'Fat',
                    cell: ({ row }: any) => (row.getValue('fat') ?? '-'),
                } as ColumnDef<QcResult>,
                {
                    accessorKey: 'protein',
                    header: 'Protein',
                    cell: ({ row }: any) => (row.getValue('protein') ?? '-'),
                } as ColumnDef<QcResult>,
            ]),
        {
            accessorKey: 'ph',
            header: 'pH',
            cell: ({ row }) => row.getValue('ph') ?? '-',
        },
        ...(isProduk
            ? [
                {
                    accessorKey: 'aroma',
                    header: 'Aroma',
                    cell: ({ row }: any) => row.getValue('aroma') ?? '-',
                } as ColumnDef<QcResult>,
                {
                    accessorKey: 'taste',
                    header: 'Rasa',
                    cell: ({ row }: any) => row.getValue('taste') ?? '-',
                } as ColumnDef<QcResult>,
                {
                    accessorKey: 'texture',
                    header: 'Tekstur',
                    cell: ({ row }: any) => row.getValue('texture') ?? '-',
                } as ColumnDef<QcResult>,
            ]
            : []),
        {
            accessorKey: 'result',
            header: 'Hasil',
            cell: ({ row }) => <Badge variant={row.getValue('result') === 'pass' ? 'success' : 'danger'}>{String(row.getValue('result')).toUpperCase()}</Badge>,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    {!isProduk && (
                        <Link href="/qc/create">
                            <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                <Plus className="mr-2 h-4 w-4" /> Input QC Mentah
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable columns={columns} data={qcResults.data} searchColumn="id" searchPlaceholder="Cari..." />
            </div>
        </AuthenticatedLayout>
    );
}
