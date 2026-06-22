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

interface Props {
    milkBatches: any[];
    selectedMilkBatch?: any;
}

export default function QcCreate({ milkBatches, selectedMilkBatch }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<QcResultFormData>({
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

    const onSubmit = (data: QcResultFormData) => {
        router.post('/qc', data);
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
                                <CardTitle className="text-white">Batch Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Milk Batch</Label>
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
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tipe QC</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                        {...register('qc_type')}
                                    >
                                        <option value="raw">Raw (Susu Mentah)</option>
                                        <option value="pasteurized">Pasteurized</option>
                                        <option value="mozzarella">Mozzarella</option>
                                    </select>
                                    {errors.qc_type && <p className="text-xs text-red-400">{errors.qc_type.message}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">QC Parameters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {([
                                        { key: 'fat', label: 'Fat (%)' },
                                        { key: 'snf', label: 'SNF (%)' },
                                        { key: 'density', label: 'Density' },
                                        { key: 'protein', label: 'Protein (%)' },
                                        { key: 'lactose', label: 'Lactose (%)' },
                                        { key: 'salts', label: 'Salts (%)' },
                                        { key: 'total_solids', label: 'Total Solids (%)' },
                                        { key: 'added_water', label: 'Added Water (%)' },
                                        { key: 'freezing_point', label: 'Freezing Point' },
                                        { key: 'temperature', label: 'Temperature (°C)' },
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
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Sensory & Safety</CardTitle>
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
