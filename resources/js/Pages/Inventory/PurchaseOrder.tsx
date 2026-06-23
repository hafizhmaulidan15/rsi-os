import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

interface PoItem {
    item: {
        id: number;
        name: string;
        sku: string;
        unit: string;
        category: string;
    } | null;
    quantity: number;
}

interface Props {
    poItems: PoItem[];
}

export default function PurchaseOrder({ poItems }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        items: poItems.map((pi) => ({
            id: pi.item?.id ?? 0,
            qty: pi.quantity,
        })),
    });

    const updateQty = (id: number, delta: number) => {
        setData('items', data.items.map((i) =>
            i.id === id
                ? { ...i, qty: Math.max(0, (i.qty ?? 0) + delta) }
                : i
        ));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/purchase-order/save');
    };

    const clear = () => {
        if (confirm('Hapus semua item Purchase Order?')) {
            post('/purchase-order/clear');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Purchase Order" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Purchase Order</h1>
                    <form onSubmit={submit} className="flex gap-2">
                        {data.items.some((i) => (i.qty ?? 0) > 0) && (
                            <Button
                                type="button"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                onClick={clear}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Semua
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                            disabled={processing}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Simpan PO
                        </Button>
                    </form>
                </div>

                {errors.items && (
                    <p className="text-red-400 text-sm">{errors.items}</p>
                )}

                {poItems.length === 0 ? (
                    <Card className="bg-[#111827] border-[#1F2937]">
                        <CardContent className="py-12 text-center">
                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                            <p className="text-gray-400">Belum ada item dalam Purchase Order.</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Gunakan form di halaman Inventory untuk menambahkan item ke PO.
                            </p>
                            <Link href="/inventory">
                                <Button variant="outline" className="mt-4 border-[#1F2937] text-gray-300">
                                    Ke Inventory
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-[#111827] border-[#1F2937]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">
                                Daftar Purchase Order ({poItems.length} item)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {poItems.map((pi) => {
                                    const inputQty = data.items.find((i) => i.id === pi.item?.id)?.qty ?? 0;
                                    return (
                                        <div
                                            key={pi.item?.id}
                                            className="flex items-center justify-between rounded-lg border border-[#1F2937] bg-[#0F172A] p-4"
                                        >
                                            <div>
                                                <p className="text-white text-sm font-medium">{pi.item?.name}</p>
                                                <p className="text-gray-500 text-xs font-mono">{pi.item?.sku}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="default" className="border-[#1F2937] text-gray-400 bg-transparent">
                                                    {pi.item?.unit}
                                                </Badge>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => pi.item && updateQty(pi.item.id, -1)}
                                                        className="rounded p-1 text-gray-400 hover:text-white hover:bg-[#1F2937] transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-12 text-center text-white font-semibold">
                                                        {inputQty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => pi.item && updateQty(pi.item.id, 1)}
                                                        className="rounded p-1 text-gray-400 hover:text-white hover:bg-[#1F2937] transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
