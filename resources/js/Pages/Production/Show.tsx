import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { yieldSchema, shelfLifeSchema, YieldFormData, ShelfLifeFormData } from '@/lib/schemas';
import { FlaskConical as Flask } from 'lucide-react';

interface ProductionBatch {
    id: number;
    batch_number: string;
    production_type: 'mozzarella' | 'susu_cup';
    start_time: string;
    end_time: string | null;
    status: 'production' | 'chiller' | 'ready' | 'closed';
    notes: string | null;
    milkBatch?: {
        batch_number: string;
        volume_liter: number;
        supplier?: { name: string };
        qc_results?: Array<{ id: number; qc_type: string; ph: number | null; aroma: string | null; taste: string | null; result: string }>;
    };
    productionSteps?: Array<{
        rennet_ml: number | null;
        nitric_acid_ml: number | null;
        target_temperature: number | null;
        actual_temperature: number | null;
        holding_time_minutes: number | null;
        cooling_time_minutes: number | null;
        notes: string | null;
    }>;
    yieldRecord?: {
        predicted_yield_kg: number;
        actual_yield_kg: number;
        variance_percent: number;
    };
    shelfLifeRecord?: {
        chiller_in_date: string;
        chiller_in_time: string;
        shelf_life_days: number;
        expiry_date: string;
        remaining_days: number;
    };
    qcResults?: Array<{
        id: number;
        qc_type: string;
        ph: number | null;
        aroma: string | null;
        taste: string | null;
        texture: string | null;
        temperature: number | null;
        result: string;
    }>;
}

interface Props {
    productionBatch: ProductionBatch;
}

export default function ProductionShow({ productionBatch }: Props) {
    const batch = productionBatch;
    const isMozza = batch.production_type === 'mozzarella';
    const steps = batch.productionSteps ?? [];
    const firstStep = steps[0];

    const [stepForm, setStepForm] = useState({
        rennet_ml: firstStep?.rennet_ml?.toString() || '',
        nitric_acid_ml: firstStep?.nitric_acid_ml?.toString() || '',
        target_temperature: firstStep?.target_temperature?.toString() || '',
        actual_temperature: firstStep?.actual_temperature?.toString() || '',
        holding_time_minutes: firstStep?.holding_time_minutes?.toString() || '',
        cooling_time_minutes: firstStep?.cooling_time_minutes?.toString() || '',
        notes: firstStep?.notes || '',
    });

    const { register: registerYield, handleSubmit: handleSubmitYield, formState: { errors: yieldErrors } } = useForm<YieldFormData>({
        resolver: zodResolver(yieldSchema),
        defaultValues: {
            actual_yield_kg: batch.yieldRecord?.actual_yield_kg?.toString() || '',
        },
    });

    const { register: registerShelf, handleSubmit: handleSubmitShelf, formState: { errors: shelfErrors } } = useForm<ShelfLifeFormData>({
        resolver: zodResolver(shelfLifeSchema),
        defaultValues: {
            chiller_in_date: batch.shelfLifeRecord?.chiller_in_date || '',
            chiller_in_time: batch.shelfLifeRecord?.chiller_in_time || '',
            shelf_life_days: batch.shelfLifeRecord?.shelf_life_days?.toString() || '14',
        },
    });

    const saveSteps = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/production/${batch.id}/steps`, stepForm);
    };

    const saveYield = (data: YieldFormData) => {
        router.post(`/production/${batch.id}/yield`, data);
    };

    const saveShelfLife = (data: ShelfLifeFormData) => {
        router.post(`/production/${batch.id}/shelf-life`, data);
    };

    const [qcForm, setQcForm] = useState({
        ph: '',
        aroma: 'normal',
        taste: 'normal',
        texture: 'normal',
        temperature: '',
        peroxide: 'negative',
    });

    const saveQcProduct = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/qc', {
            production_batch_id: batch.id,
            qc_type: 'pasteurized',
            ph: qcForm.ph || null,
            aroma: qcForm.aroma,
            taste: qcForm.taste,
            texture: qcForm.texture,
            temperature: qcForm.temperature || null,
            peroxide: qcForm.peroxide,
        });
        setQcForm({ ph: '', aroma: 'normal', taste: 'normal', texture: 'normal', temperature: '', peroxide: 'negative' });
    };

    return (
        <AuthenticatedLayout>
            <Head title={batch.batch_number} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/production">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">{batch.batch_number}</h1>
                    <Badge variant={batch.status === 'chiller' ? 'warning' : batch.status === 'ready' ? 'success' : 'default'}>
                        {batch.status}
                    </Badge>
                    <span className="capitalize text-sm text-gray-400">{batch.production_type}</span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="text-white">Batch Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Milk Batch</span><span className="text-white">{batch.milkBatch?.batch_number}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Supplier</span><span className="text-white">{batch.milkBatch?.supplier?.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Volume</span><span className="text-white">{batch.milkBatch?.volume_liter} L</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Start Time</span><span className="text-white">{batch.start_time?.slice(0, 16).replace('T', ' ')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">End Time</span><span className="text-white">{batch.end_time?.slice(0, 16).replace('T', ' ') || '-'}</span></div>
                            {batch.notes && <div className="flex justify-between"><span className="text-gray-400">Notes</span><span className="text-white">{batch.notes}</span></div>}
                        </CardContent>
                    </Card>

                    {isMozza ? (
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Mozzarella Process</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={saveSteps} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label className="text-xs text-gray-500">Rennet (ml)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.rennet_ml} onChange={e => setStepForm({...stepForm, rennet_ml: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Nitric Acid (ml)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.nitric_acid_ml} onChange={e => setStepForm({...stepForm, nitric_acid_ml: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Target Temp (°C)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.target_temperature} onChange={e => setStepForm({...stepForm, target_temperature: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Actual Temp (°C)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.actual_temperature} onChange={e => setStepForm({...stepForm, actual_temperature: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Holding Time (min)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.holding_time_minutes} onChange={e => setStepForm({...stepForm, holding_time_minutes: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Cooling Time (min)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.cooling_time_minutes} onChange={e => setStepForm({...stepForm, cooling_time_minutes: e.target.value})} /></div>
                                    </div>
                                    <Button type="submit" size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90">Save</Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Pasteurization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={saveSteps} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label className="text-xs text-gray-500">Target Temp (°C)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.target_temperature} onChange={e => setStepForm({...stepForm, target_temperature: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Actual Temp (°C)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.actual_temperature} onChange={e => setStepForm({...stepForm, actual_temperature: e.target.value})} /></div>
                                        <div><Label className="text-xs text-gray-500">Holding Time (min)</Label><Input className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={stepForm.holding_time_minutes} onChange={e => setStepForm({...stepForm, holding_time_minutes: e.target.value})} /></div>
                                    </div>
                                    <Button type="submit" size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90">Save</Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {isMozza && (
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Yield Result</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {batch.yieldRecord ? (
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Predicted Yield</span><span className="text-white">{batch.yieldRecord.predicted_yield_kg} kg</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Actual Yield</span><span className="text-white font-semibold">{batch.yieldRecord.actual_yield_kg} kg</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Variance</span><span className={batch.yieldRecord.variance_percent < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>{batch.yieldRecord.variance_percent}%</span></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-4">Belum ada data yield</p>
                                )}
                                <form onSubmit={handleSubmitYield(saveYield)} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input type="number" step="0.01" className="border-[#1F2937] bg-[#0F172A] text-white" placeholder="Actual yield (kg)" {...registerYield('actual_yield_kg')} />
                                        {yieldErrors.actual_yield_kg && <p className="text-xs text-red-400 mt-1">{yieldErrors.actual_yield_kg.message}</p>}
                                    </div>
                                    <Button type="submit" size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90 shrink-0">Save</Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {isMozza && (
                        <Card className="border-[#1F2937] bg-[#111827]">
                            <CardHeader>
                                <CardTitle className="text-white">Shelf Life</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {batch.shelfLifeRecord ? (
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-400">Chiller In</span><span className="text-white">{batch.shelfLifeRecord.chiller_in_date} {batch.shelfLifeRecord.chiller_in_time}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Expiry Date</span><span className="text-white">{batch.shelfLifeRecord.expiry_date}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Remaining</span><span className={batch.shelfLifeRecord.remaining_days <= 3 ? 'text-[#D97706]' : 'text-[#16A34A]'}>{batch.shelfLifeRecord.remaining_days} days</span></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-4">Belum ada data shelf life</p>
                                )}
                                <form onSubmit={handleSubmitShelf(saveShelfLife)} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Chiller In Date</Label>
                                            <Input type="date" className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" {...registerShelf('chiller_in_date')} />
                                            {shelfErrors.chiller_in_date && <p className="text-xs text-red-400">{shelfErrors.chiller_in_date.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Time</Label>
                                            <Input type="time" className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" {...registerShelf('chiller_in_time')} />
                                            {shelfErrors.chiller_in_time && <p className="text-xs text-red-400">{shelfErrors.chiller_in_time.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input type="number" className="border-[#1F2937] bg-[#0F172A] text-white flex-1" placeholder="Shelf life days" {...registerShelf('shelf_life_days')} />
                                        <Button type="submit" size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90 shrink-0">Save</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {!isMozza && (
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Flask className="h-5 w-5 text-[#D97706]" />
                                QC Produk (Post-Pasteurisasi)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={saveQcProduct} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs text-gray-500">pH</Label>
                                        <Input type="number" step="0.01" className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={qcForm.ph} onChange={e => setQcForm({...qcForm, ph: e.target.value})} placeholder="6.5" />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Temperature (°C)</Label>
                                        <Input type="number" step="0.1" className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm" value={qcForm.temperature} onChange={e => setQcForm({...qcForm, temperature: e.target.value})} placeholder="4" />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Aroma</Label>
                                        <select className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm rounded-md w-full px-2" value={qcForm.aroma} onChange={e => setQcForm({...qcForm, aroma: e.target.value})}>
                                            <option value="normal">Normal</option>
                                            <option value="sour">Asam</option>
                                            <option value="off">Bau Lain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Rasa</Label>
                                        <select className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm rounded-md w-full px-2" value={qcForm.taste} onChange={e => setQcForm({...qcForm, taste: e.target.value})}>
                                            <option value="normal">Normal</option>
                                            <option value="sour">Asam</option>
                                            <option value="bitter">Pahit</option>
                                            <option value="off">Rasa Lain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Tekstur</Label>
                                        <select className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm rounded-md w-full px-2" value={qcForm.texture} onChange={e => setQcForm({...qcForm, texture: e.target.value})}>
                                            <option value="normal">Normal</option>
                                            <option value="watery">Encer</option>
                                            <option value="thick">Kental</option>
                                            <option value="grainy">Bergumpal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Peroksida</Label>
                                        <select className="border-[#1F2937] bg-[#0F172A] text-white h-8 text-sm rounded-md w-full px-2" value={qcForm.peroxide} onChange={e => setQcForm({...qcForm, peroxide: e.target.value})}>
                                            <option value="negative">Negatif</option>
                                            <option value="positive">Positif</option>
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" size="sm" className="bg-[#D97706] hover:bg-[#D97706]/90">Simpan QC Produk</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardHeader>
                        <CardTitle className="text-white">Riwayat QC</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(batch.qcResults?.length ?? 0) > 0 ? batch.qcResults?.map((qc) => (
                            <div key={qc.id} className="flex items-center justify-between border-b border-[#1F2937] py-2 last:border-0">
                                <div>
                                    <p className="text-sm text-white capitalize">{qc.qc_type === 'pasteurized' ? 'Produk' : qc.qc_type} QC</p>
                                    <p className="text-xs text-gray-400">pH: {qc.ph ?? '-'} | Aroma: {qc.aroma ?? '-'} | Rasa: {qc.taste ?? '-'}</p>
                                </div>
                                <Badge variant={qc.result === 'pass' ? 'success' : 'danger'}>{qc.result.toUpperCase()}</Badge>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500">Belum ada QC</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
