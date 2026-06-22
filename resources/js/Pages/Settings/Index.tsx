import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { FormEventHandler } from 'react';
import { Settings, Thermometer, Calendar, Calculator } from 'lucide-react';

interface Setting {
    id: number;
    key: string;
    value: string;
    group: string;
}

interface Props {
    settings: Record<string, Setting[]>;
}

export default function SettingsIndex({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        settings: Object.values(settings).flat().map((s) => ({
            key: s.key,
            value: s.value,
        })),
    });

    const handleSettingChange = (key: string, value: string) => {
        setData('settings', data.settings.map((s) => (s.key === key ? { ...s, value } : s)));
    };

    const getValue = (key: string) => data.settings.find((s) => s.key === key)?.value ?? '';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/settings', { preserveScroll: true });
    };

    const keyLabels: Record<string, string> = {
        qc_ts_min: 'Min Total Solids (%)',
        qc_protein_min: 'Min Protein (%)',
        qc_fat_min: 'Min Fat (%)',
        qc_ph_min: 'Min pH',
        qc_ph_max: 'Max pH',
        shelf_life_default_days: 'Default Shelf Life (days)',
        yield_default_factor: 'Yield Factor',
    };

    const groupIcons: Record<string, React.ReactNode> = {
        qc: <Thermometer className="h-5 w-5 text-[#2563EB]" />,
        shelf_life: <Calendar className="h-5 w-5 text-[#D97706]" />,
        yield: <Calculator className="h-5 w-5 text-[#16A34A]" />,
    };

    const groupLabels: Record<string, string> = {
        qc: 'QC Thresholds',
        shelf_life: 'Shelf Life Defaults',
        yield: 'Yield Calculation',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="mt-1 text-sm text-gray-400">System configuration parameters</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {Object.entries(settings).map(([group, items]) => (
                            <Card key={group} className="border-[#1F2937] bg-[#111827]">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    {groupIcons[group]}
                                    <CardTitle className="text-white">{groupLabels[group] ?? group}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items.map((setting) => (
                                            <div key={setting.id}>
                                                <Label htmlFor={setting.key} className="text-gray-400">
                                                    {keyLabels[setting.key] ?? setting.key}
                                                </Label>
                                                <Input
                                                    id={setting.key}
                                                    type="text"
                                                    value={getValue(setting.key)}
                                                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                                    className="mt-1 border-[#1F2937] bg-[#0F172A] text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
