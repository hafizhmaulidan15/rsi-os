import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, FlaskConical } from 'lucide-react';

interface Props {
    milkBatch: any;
}

export default function MilkIntakeShow({ milkBatch }: Props) {
    const statusVariant = (status: string) => {
        switch (status) {
            case 'pending_qc': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'default';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={milkBatch.batch_number} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/milk-intake">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">{milkBatch.batch_number}</h1>
                    <Badge variant={statusVariant(milkBatch.status)}>
                        {milkBatch.status}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="text-white">Informasi Penerimaan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Supplier</span>
                                <span className="text-white">{milkBatch.supplier?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Volume</span>
                                <span className="text-white">{milkBatch.volume_liter} L</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Target Produksi</span>
                                <span className="text-white capitalize">{milkBatch.production_target}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tanggal</span>
                                <span className="text-white">{milkBatch.received_date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Jam</span>
                                <span className="text-white">{milkBatch.received_time}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#1F2937] bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="text-white">QC Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {milkBatch.qcResults?.length > 0 ? (
                                <div className="space-y-2">
                                    {milkBatch.qcResults.map((qc: any) => (
                                        <div key={qc.id} className="flex items-center justify-between rounded-lg bg-[#1F2937] p-3">
                                            <div>
                                                <p className="text-sm text-white capitalize">{qc.qc_type} QC</p>
                                                <p className="text-xs text-gray-400">TS: {qc.total_solids}% | pH: {qc.ph}</p>
                                            </div>
                                            <Badge variant={qc.result === 'pass' ? 'success' : 'danger'}>
                                                {qc.result.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-4">Belum ada QC</p>
                                    <Link href={`/qc/create?milk_batch_id=${milkBatch.id}`}>
                                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                            <FlaskConical className="mr-2 h-4 w-4" /> Input QC
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
