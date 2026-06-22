import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { qcResultSchema, QcResultFormData } from '@/lib/schemas';
import { useState } from 'react';

interface Props {
    milkBatches: any[];
    productionBatches: any[];
    selectedMilkBatch?: any;
}

export default function QcCreate({ milkBatches, productionBatches, selectedMilkBatch }: Props) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<QcResultFormData>({
        resolver: zodResolver(qcResultSchema),
        defaultValues: {
            milk_batch_id: selectedMilkBatch?.id?.toString() || '',
            qc_type: 'raw',
            fat: '',
            snf: '',
            density: '',
            protein: '',
            lactose: '',
            salts: '',
            total_solids: '',
            added_water: '',
            freezing_point: '',
            temperature: '',
            ph: '',
            peroxide: '',
            antibiotic: '',
            aroma: '',
            taste: '',
            texture: '',
            notes: '',
        },
    });

    const qcType = watch('qc_type');
    const isMentah = qcType === 'raw';

    const onSubmit = (data: QcResultFormData) => {
        const payload: Record<string, any> = { qc_type: data.qc_type };
        if (data.qc_type === 'raw') {
            payload.milk_batch_id = data.milk_batch_id;
            ['fat','snf','density','protein','lactose','salts','total_solids','added_water','freezing_point','temperature','ph','peroxide','antibiotic','aroma','taste','texture','notes'].forEach(k => { if (data[k as keyof typeof data]) payload[k] = data[k as keyof typeof data]; });
        } else {
            payload.production_batch_id = data.production_batch_id;
            ['ph','temperature','peroxide','aroma','taste','texture','notes'].forEach(k => { if (data[k as keyof typeof data]) payload[k] = data[k as keyof typeof data]; });
        }
        router.post('/qc', payload);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Input QC" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href="/qc">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Input Quality Control</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Informasi Batch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tipe QC</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                        {...register('qc_type')}
                                    >
                                        <option value="raw">Mentah</option>
                                        <option value="pasteurized">Pasteurisasi</option>
                                    </select>
                                    {errors.qc_type && <p className="text-xs text-red-400">{errors.qc_type.message}</p>}
                                </div>

                                {isMentah ? (
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Batch Susu Mentah</Label>
                                        <select
                                            className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                            {...register('milk_batch_id')}
                                        >
                                            <option value="">Pilih Batch</option>
                                            {milkBatches.map((batch: any) => (
                                                <option key={batch.id} value={batch.id}>
                                                    {batch.batch_number} - {batch.supplier?.name} ({batch.volume_liter}L)
                                                </option>
                                            ))}
                                        </select>
                                        {errors.milk_batch_id && <p className="text-xs text-red-400">{errors.milk_batch_id.message}</p>}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Batch Produksi</Label>
                                        <select
                                            className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                            {...register('production_batch_id')}
                                        >
                                            <option value="">Pilih Batch Produksi</option>
                                            {productionBatches.map((batch: any) => (
                                                <option key={batch.id} value={batch.id}>
                                                    {batch.batch_number} - {batch.production_type}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.production_batch_id && <p className="text-xs text-red-400">{errors.production_batch_id.message}</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Parameter QC</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {isMentah ? (
                                        <>
                                            {([
                                                { key: 'fat', label: 'Lemak (%)' },
                                                { key: 'snf', label: 'SNF (%)' },
                                                { key: 'density', label: 'Density' },
                                                { key: 'protein', label: 'Protein (%)' },
                                                { key: 'lactose', label: 'Laktosa (%)' },
                                                { key: 'salts', label: 'Garam (%)' },
                                                { key: 'total_solids', label: 'Total Padatan (%)' },
                                                { key: 'added_water', label: 'Air Tambahan (%)' },
                                                { key: 'freezing_point', label: 'Titik Beku' },
                                                { key: 'temperature', label: 'Suhu (°C)' },
                                                { key: 'ph', label: 'pH' },
                                            ] as const).map((param) => (
                                                <div key={param.key} className="space-y-1">
                                                    <Label className="text-xs text-gray-500">{param.label}</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                        {...register(param.key as keyof QcResultFormData)}
                                                    />
                                                    {errors[param.key as keyof typeof errors] && (
                                                        <p className="text-xs text-red-400">{errors[param.key as keyof typeof errors]?.message}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">pH</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                    {...register('ph')}
                                                />
                                                {errors.ph && <p className="text-xs text-red-400">{errors.ph.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Suhu (°C)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                    {...register('temperature')}
                                                />
                                                {errors.temperature && <p className="text-xs text-red-400">{errors.temperature.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Peroxide</Label>
                                                <select
                                                    className="flex h-8 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 text-sm text-white shadow-sm"
                                                    {...register('peroxide')}
                                                >
                                                    <option value="">-</option>
                                                    <option value="negative">Negative</option>
                                                    <option value="positive">Positive</option>
                                                </select>
                                                {errors.peroxide && <p className="text-xs text-red-400">{errors.peroxide.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Aroma</Label>
                                                <Input
                                                    className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                    {...register('aroma')}
                                                />
                                                {errors.aroma && <p className="text-xs text-red-400">{errors.aroma.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Rasa</Label>
                                                <Input
                                                    className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                    {...register('taste')}
                                                />
                                                {errors.taste && <p className="text-xs text-red-400">{errors.taste.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Tekstur</Label>
                                                <Input
                                                    className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                    {...register('texture')}
                                                />
                                                {errors.texture && <p className="text-xs text-red-400">{errors.texture.message}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {isMentah && (
                            <Card className="border-[#1F2937] bg-[#111827]">
                                <CardHeader>
                                    <CardTitle className="text-white">Sensorik & Keamanan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Peroxide</Label>
                                            <select
                                                className="flex h-8 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 text-sm text-white shadow-sm"
                                                {...register('peroxide')}
                                            >
                                                <option value="">-</option>
                                                <option value="negative">Negative</option>
                                                <option value="positive">Positive</option>
                                            </select>
                                            {errors.peroxide && <p className="text-xs text-red-400">{errors.peroxide.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Antibiotic</Label>
                                            <select
                                                className="flex h-8 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 text-sm text-white shadow-sm"
                                                {...register('antibiotic')}
                                            >
                                                <option value="">-</option>
                                                <option value="negative">Negative</option>
                                                <option value="positive">Positive</option>
                                            </select>
                                            {errors.antibiotic && <p className="text-xs text-red-400">{errors.antibiotic.message}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Aroma</Label>
                                            <Input
                                                className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                {...register('aroma')}
                                            />
                                            {errors.aroma && <p className="text-xs text-red-400">{errors.aroma.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Rasa</Label>
                                            <Input
                                                className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                {...register('taste')}
                                            />
                                            {errors.taste && <p className="text-xs text-red-400">{errors.taste.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Tekstur</Label>
                                            <Input
                                                className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm"
                                                {...register('texture')}
                                            />
                                            {errors.texture && <p className="text-xs text-red-400">{errors.texture.message}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90 px-8">
                                Simpan Hasil QC
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
