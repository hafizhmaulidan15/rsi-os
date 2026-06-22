import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil } from 'lucide-react';

interface Supplier {
    id: number;
    supplier_code: string;
    name: string;
    phone: string | null;
    address: string | null;
}

interface Props {
    suppliers: { data: Supplier[] };
}

export default function SupplierIndex({ suppliers }: Props) {
    const columns: ColumnDef<Supplier>[] = [
        { accessorKey: 'supplier_code', header: 'Kode', cell: ({ row }) => <span className="font-mono text-[#2563EB]">{row.getValue('supplier_code')}</span> },
        { accessorKey: 'name', header: 'Nama' },
        { accessorKey: 'phone', header: 'Telepon', cell: ({ row }) => row.getValue('phone') || '-' },
        { accessorKey: 'address', header: 'Alamat', cell: ({ row }) => row.getValue('address') || '-' },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/suppliers/${row.original.id}/edit`}>
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Suppliers" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Suppliers</h1>
                    <Link href="/suppliers/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Supplier
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={suppliers.data} searchColumn="name" searchPlaceholder="Cari supplier..." />
            </div>
        </AuthenticatedLayout>
    );
}
