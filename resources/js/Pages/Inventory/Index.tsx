import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
    unit: string;
    minimum_stock: number;
    status: string;
}

interface Packaging {
    id: number;
    name: string;
    stock: number;
    unit: string;
    minimum_stock: number;
    status: string;
}

interface Transaction {
    id: number;
    transaction_date: string;
    item: { name: string } | null;
    transaction_type: string;
    quantity: number;
    production_batch: { batch_number: string } | null;
    notes: string | null;
}

interface Props {
    tab: string;
    products: Product[];
    packaging: Packaging[];
    transactions: { data: Transaction[] };
}

const stockBadge = (item: { stock: number; status: string }) => {
    if (item.stock <= 0) return 'danger' as const;
    if (item.status === 'low') return 'warning' as const;
    return 'success' as const;
};

const stockLabel = (item: { stock: number; status: string }) => {
    if (item.stock <= 0) return 'Out of Stock';
    if (item.status === 'low') return 'Low';
    return 'In Stock';
};

export default function InventoryIndex({ tab, products, packaging, transactions }: Props) {
    const currentTab = tab;

    const switchTab = (t: string) => {
        router.get('/inventory', { tab: t });
    };

    const tabs = [
        { key: 'products', label: 'Produk Jadi' },
        { key: 'packaging', label: 'Packaging' },
        { key: 'transactions', label: 'Transactions' },
    ];

    const productColumns: ColumnDef<Product>[] = [
        { accessorKey: 'name', header: 'Item' },
        { accessorKey: 'category', header: 'Category', cell: ({ row }) => <span className="capitalize text-gray-400">{row.getValue('category')}</span> },
        { accessorKey: 'stock', header: 'Stock', cell: ({ row }) => <span className="font-semibold">{row.getValue('stock')} {row.original.unit}</span> },
        { accessorKey: 'minimum_stock', header: 'Min Stock', cell: ({ row }) => <span className="text-gray-400">{row.getValue('minimum_stock')} {row.original.unit}</span> },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={stockBadge(row.original)}>{stockLabel(row.original)}</Badge> },
    ];

    const packagingColumns: ColumnDef<Packaging>[] = [
        { accessorKey: 'name', header: 'Item' },
        { accessorKey: 'stock', header: 'Stock', cell: ({ row }) => <span className="font-semibold">{row.getValue('stock')} {row.original.unit}</span> },
        { accessorKey: 'minimum_stock', header: 'Min Stock', cell: ({ row }) => <span className="text-gray-400">{row.getValue('minimum_stock')} {row.original.unit}</span> },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={stockBadge(row.original)}>{stockLabel(row.original)}</Badge> },
    ];

    const transactionColumns: ColumnDef<Transaction>[] = [
        { accessorKey: 'transaction_date', header: 'Date', cell: ({ row }) => <span className="text-gray-400">{row.getValue('transaction_date')}</span> },
        { accessorKey: 'item.name', header: 'Item', cell: ({ row }) => row.original.item?.name || '-' },
        {
            accessorKey: 'transaction_type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.getValue('transaction_type');
                const variant = type === 'in' ? 'success' as const : type === 'out' ? 'danger' as const : 'warning' as const;
                return <Badge variant={variant}>{String(type)}</Badge>;
            },
        },
        { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => <span className="font-semibold">{row.getValue('quantity')}</span> },
        { accessorKey: 'production_batch.batch_number', header: 'Batch', cell: ({ row }) => <span className="text-gray-400">{row.original.production_batch?.batch_number || '-'}</span> },
        { accessorKey: 'notes', header: 'Notes', cell: ({ row }) => <span className="text-gray-400">{row.getValue('notes') || '-'}</span> },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Inventory" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Inventory</h1>
                    <Link href="/inventory/transactions/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> New Transaction
                        </Button>
                    </Link>
                </div>

                <div className="flex gap-1 rounded-lg bg-[#1F2937] p-1 w-fit">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => switchTab(t.key)}
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                currentTab === t.key
                                    ? 'bg-[#2563EB] text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {currentTab === 'products' && (
                    <DataTable columns={productColumns} data={products} searchColumn="name" searchPlaceholder="Cari produk..." />
                )}

                {currentTab === 'packaging' && (
                    <DataTable columns={packagingColumns} data={packaging} searchColumn="name" searchPlaceholder="Cari packaging..." />
                )}

                {currentTab === 'transactions' && (
                    <DataTable columns={transactionColumns} data={transactions.data} searchColumn="item.name" searchPlaceholder="Cari transaksi..." />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
