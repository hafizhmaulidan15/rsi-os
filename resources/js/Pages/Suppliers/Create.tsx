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

export default function SupplierCreate() {
    const { register, handleSubmit, formState: { errors } } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: { supplier_code: '', name: '', phone: '', address: '', notes: '' },
    });

    const onSubmit = (data: SupplierFormData) => {
        router.post('/suppliers', data);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Supplier" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/suppliers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Tambah Supplier</h1>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Kode Supplier</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="SUP-001"
                                    {...register('supplier_code')}
                                />
                                {errors.supplier_code && <p className="text-xs text-red-400">{errors.supplier_code.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Nama Supplier</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="Nama peternakan"
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Telepon</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="081234567890"
                                    {...register('phone')}
                                />
                                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Alamat</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={3}
                                    placeholder="Alamat lengkap"
                                    {...register('address')}
                                />
                                {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Catatan</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={2}
                                    placeholder="Catatan (opsional)"
                                    {...register('notes')}
                                />
                                {errors.notes && <p className="text-xs text-red-400">{errors.notes.message}</p>}
                            </div>
                            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                Simpan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
