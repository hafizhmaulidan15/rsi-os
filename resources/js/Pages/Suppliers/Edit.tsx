import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema, SupplierFormData } from '@/lib/schemas';

interface Props {
    supplier: any;
}

export default function SupplierEdit({ supplier }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            supplier_code: supplier.supplier_code,
            name: supplier.name,
            phone: supplier.phone || '',
            address: supplier.address || '',
            notes: supplier.notes || '',
        },
    });

    const onSubmit = (data: SupplierFormData) => {
        router.put(`/suppliers/${supplier.id}`, { ...data, supplier_code: supplier.supplier_code });
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus supplier ini?')) {
            router.delete(`/suppliers/${supplier.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Supplier" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/suppliers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Edit Supplier</h1>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Kode Supplier</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    value={supplier.supplier_code}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Nama Supplier</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Telepon</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    {...register('phone')}
                                />
                                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Alamat</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={3}
                                    {...register('address')}
                                />
                                {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Catatan</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={2}
                                    {...register('notes')}
                                />
                                {errors.notes && <p className="text-xs text-red-400">{errors.notes.message}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                    Update
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleDelete}>
                                    Hapus
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
