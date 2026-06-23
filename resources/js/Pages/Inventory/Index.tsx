import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Package, Layers, Box, FlaskConical, FileDown, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StockItem {
    id: number;
    item_code: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
    minimum_stock: number;
    health: string;
}

interface Transaction {
    id: number;
    transaction_date: string;
    item: { name: string } | null;
    transaction_type: string;
    quantity: number;
    request_by: string | null;
    no_sj: string | null;
    production_batch: { batch_number: string } | null;
    notes: string | null;
}

interface PoEntry {
    item: { id: number; name: string; sku: string; unit: string } | null;
    quantity: number;
}

interface Props {
    tab: string;
    allStock: StockItem[];
    products: StockItem[];
    packaging: StockItem[];
    transactions: { data: Transaction[] };
    purchaseOrder: PoEntry[];
}

const healthVariant = (health: string) => {
    switch (health) {
        case 'ok': return 'success' as const;
        case 'medium': return 'warning' as const;
        case 'low': return 'danger' as const;
        case 'out_of_stock': return 'danger' as const;
        default: return 'default' as const;
    }
};

const healthLabel = (health: string) => {
    switch (health) {
        case 'ok': return 'Aman';
        case 'medium': return 'Cukup';
        case 'low': return 'Rendah';
        case 'out_of_stock': return 'Habis';
        default: return health;
    }
};

const healthColor = (health: string) => {
    switch (health) {
        case 'ok': return 'bg-[#16A34A]';
        case 'medium': return 'bg-[#D97706]';
        case 'low': return 'bg-[#DC2626]';
        case 'out_of_stock': return 'bg-[#6B7280]';
        default: return 'bg-[#6B7280]';
    }
};

const categoryIcon = (cat: string) => {
    switch (cat) {
        case 'mozzarella': return <FlaskConical className="h-4 w-4 text-blue-400" />;
        case 'susu_cup': return <Package className="h-4 w-4 text-[#2563EB]" />;
        case 'packaging': return <Layers className="h-4 w-4 text-emerald-400" />;
        default: return <Box className="h-4 w-4 text-purple-400" />;
    }
};

export default function InventoryIndex({ tab, allStock, products, packaging, transactions, purchaseOrder }: Props) {
    const currentTab = tab;
    const [poQtys, setPoQtys] = useState<Record<number, number>>({});

    const switchTab = (t: string) => {
        router.get('/inventory', { tab: t });
    };

    const addToPo = (itemId: number) => {
        const qty = poQtys[itemId] ?? 1;
        if (qty < 1) {
            toast.error('Minimal quantity 1');
            return;
        }
        router.post('/purchase-order/add-item', {
            item_id: itemId,
            quantity: qty,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setPoQtys((prev) => ({ ...prev, [itemId]: 1 }));
                toast.success('Ditambahkan ke PO');
            },
        });
    };

    const totalPoItems = purchaseOrder.reduce((sum, p) => sum + p.quantity, 0);

    const tabs = [
        { key: 'all', label: 'Semua Stok' },
        { key: 'products', label: 'Produk Jadi' },
        { key: 'packaging', label: 'Packaging & Items' },
        { key: 'transactions', label: 'Transaksi' },
    ];

    const stockTable: ColumnDef<StockItem>[] = [
        {
            id: 'name',
            header: 'Item',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {categoryIcon(row.original.category)}
                    <div>
                        <span className="text-white text-sm">{row.original.name}</span>
                        <span className="text-gray-500 text-xs ml-2 font-mono">{row.original.item_code}</span>
                    </div>
                </div>
            ),
        },
        { accessorKey: 'category', header: 'Kategori', cell: ({ row }) => <span className="capitalize text-gray-400 text-xs">{row.original.category === 'susu_cup' ? 'Susu Cup' : row.original.category}</span> },
        { accessorKey: 'stock', header: 'Stok', cell: ({ row }) => <span className="font-semibold text-white">{row.original.stock.toLocaleString('id-ID')} <span className="text-gray-400 text-xs">{row.original.unit}</span></span> },
        { accessorKey: 'minimum_stock', header: 'Min', cell: ({ row }) => <span className="text-gray-400 text-xs">{row.original.minimum_stock.toLocaleString('id-ID')} {row.original.unit}</span> },
        {
            id: 'health',
            header: 'Kesehatan Stok',
            cell: ({ row }) => {
                const ratio = row.original.minimum_stock > 0 ? Math.min(row.original.stock / row.original.minimum_stock, 2) / 2 : 0;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-[#1F2937] overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${healthColor(row.original.health)}`}
                                style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                            />
                        </div>
                        <Badge variant={healthVariant(row.original.health)} className="text-[10px] px-1.5 py-0">{healthLabel(row.original.health)}</Badge>
                    </div>
                );
            },
        },
        {
            id: 'po',
            header: 'PO',
            cell: ({ row }) => {
                const item = row.original;
                if (item.category !== 'packaging') return <span className="text-gray-600 text-xs">-</span>;
                return (
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            min="1"
                            value={poQtys[item.id] ?? 1}
                            onChange={(e) =>
                                setPoQtys((prev) => ({
                                    ...prev,
                                    [item.id]: Math.max(1, parseInt(e.target.value) || 1),
                                }))
                            }
                            className="w-14 rounded border border-[#1F2937] bg-[#0F172A] px-1.5 py-1 text-xs text-white text-center"
                        />
                        <button
                            onClick={() => addToPo(item.id)}
                            className="rounded-md bg-emerald-600/20 p-1.5 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                            title="Tambah ke PO"
                        >
                            <ShoppingCart size={14} />
                        </button>
                    </div>
                );
            },
        },
    ];

    const productColumns: ColumnDef<StockItem>[] = [
        { accessorKey: 'name', header: 'Item' },
        { accessorKey: 'category', header: 'Kategori', cell: ({ row }) => <span className="capitalize text-gray-400">{row.original.category === 'susu_cup' ? 'Susu Cup' : row.original.category}</span> },
        { accessorKey: 'stock', header: 'Stok', cell: ({ row }) => <span className="font-semibold">{row.original.stock.toLocaleString('id-ID')} {row.original.unit}</span> },
        { accessorKey: 'minimum_stock', header: 'Min', cell: ({ row }) => <span className="text-gray-400 text-xs">{row.original.minimum_stock.toLocaleString('id-ID')} {row.original.unit}</span> },
        { accessorKey: 'health', header: 'Status', cell: ({ row }) => <Badge variant={healthVariant(row.original.health)}>{healthLabel(row.original.health)}</Badge> },
    ];

    const transactionColumns: ColumnDef<Transaction>[] = [
        { accessorKey: 'transaction_date', header: 'Tanggal', cell: ({ row }) => <span className="text-gray-400 text-xs">{row.getValue('transaction_date')}</span> },
        { accessorKey: 'item.name', header: 'Item', cell: ({ row }) => row.original.item?.name || '-' },
        {
            accessorKey: 'transaction_type',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.getValue('transaction_type');
                const variant = type === 'in' ? 'success' as const : type === 'out' ? 'danger' as const : 'warning' as const;
                const label = type === 'in' ? 'Masuk' : type === 'out' ? 'Keluar' : 'Adjust';
                return <Badge variant={variant}>{label}</Badge>;
            },
        },
        { accessorKey: 'quantity', header: 'Jumlah', cell: ({ row }) => <span className="font-semibold">{Math.abs(row.original.quantity).toLocaleString('id-ID')}</span> },
        { accessorKey: 'request_by', header: 'Request By', cell: ({ row }) => <span className="text-gray-400 text-xs">{row.original.request_by || '-'}</span> },
        { accessorKey: 'no_sj', header: 'No. SJ', cell: ({ row }) => <span className="text-gray-400 text-xs font-mono">{row.original.no_sj || '-'}</span> },
        { accessorKey: 'notes', header: 'Keterangan', cell: ({ row }) => <span className="text-gray-400 text-xs">{row.original.notes || '-'}</span> },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Inventory" />
            <div className="space-y-6">
                {purchaseOrder.length > 0 && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-900/10 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-emerald-400" />
                                <span className="text-emerald-300 text-sm font-medium">
                                    Purchase Order ({totalPoItems} item{totalPoItems > 1 ? 's' : ''})
                                </span>
                            </div>
                            <Link href="/purchase-order">
                                <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 text-xs">
                                    Kelola PO
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {purchaseOrder.map((po) => (
                                <Badge key={po.item?.id} variant="default" className="border-emerald-500/20 text-emerald-300 text-xs bg-emerald-900/20">
                                    {po.item?.name}: {po.quantity} {po.item?.unit}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Inventory</h1>
                    <div className="flex gap-2">
                        <Link href="/inventory/items">
                            <Button variant="outline" className="border-[#1F2937] text-gray-300">
                                <Package className="mr-2 h-4 w-4" /> Items
                            </Button>
                        </Link>
                        <a href="/export/csv/inventory" target="_blank">
                            <Button variant="outline" className="border-[#1F2937] text-gray-300">
                                <FileDown className="mr-2 h-4 w-4" /> CSV
                            </Button>
                        </a>
                        <Link href="/inventory/transactions/create">
                            <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                <Plus className="mr-2 h-4 w-4" /> Transaksi Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex gap-1 rounded-lg bg-[#1F2937] p-1 w-fit flex-wrap">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => switchTab(t.key)}
                            className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
                                currentTab === t.key
                                    ? 'bg-[#2563EB] text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {currentTab === 'all' && (
                    <div className="space-y-6">
                        {allStock.length === 0 ? (
                            <p className="text-gray-500 text-sm">Belum ada item inventory.</p>
                        ) : (
                            <DataTable columns={stockTable} data={allStock} searchColumn="name" searchPlaceholder="Cari item..." />
                        )}
                    </div>
                )}

                {currentTab === 'products' && (
                    <DataTable columns={productColumns} data={products} searchColumn="name" searchPlaceholder="Cari produk..." />
                )}

                {currentTab === 'packaging' && (
                    <DataTable columns={productColumns} data={packaging} searchColumn="name" searchPlaceholder="Cari packaging..." />
                )}

                {currentTab === 'transactions' && (
                    <DataTable columns={transactionColumns} data={transactions.data} searchColumn="item.name" searchPlaceholder="Cari transaksi..." />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
