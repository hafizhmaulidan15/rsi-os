import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
}

export default function UsersEdit({ user }: Props) {
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/users/${user.id}`, form);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit User" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Edit User: {user.name}</h1>

                <Card className="border-[#1F2937] bg-[#111827] max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Form Edit User</CardTitle>
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
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">Update</Button>
                                <Link href="/users"><Button variant="ghost" className="text-gray-400">Batal</Button></Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
