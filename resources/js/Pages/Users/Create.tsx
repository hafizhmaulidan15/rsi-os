import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';

export default function UsersCreate() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/users', form);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah User" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Tambah User Baru</h1>

                <Card className="border-[#1F2937] bg-[#111827] max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Form User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="text-gray-400">Nama</Label>
                                <Input className="border-[#1F2937] bg-[#0F172A] text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div>
                                <Label className="text-gray-400">Email</Label>
                                <Input type="email" className="border-[#1F2937] bg-[#0F172A] text-white" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                            </div>
                            <div>
                                <Label className="text-gray-400">Password</Label>
                                <Input type="password" className="border-[#1F2937] bg-[#0F172A] text-white" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                            </div>
                            <div>
                                <Label className="text-gray-400">Konfirmasi Password</Label>
                                <Input type="password" className="border-[#1F2937] bg-[#0F172A] text-white" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} required />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">Simpan</Button>
                                <Link href="/users"><Button variant="ghost" className="text-gray-400">Batal</Button></Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
