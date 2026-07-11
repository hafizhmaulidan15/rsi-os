import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function UsersIndex({ users }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            router.delete(`/users/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="mt-1 text-sm text-gray-400">Kelola akun pengguna sistem</p>
                    </div>
                    <Link href="/users/create">
                        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                            <Plus className="mr-2 h-4 w-4" /> Tambah User
                        </Button>
                    </Link>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#1F2937] text-gray-400">
                                    <th className="pb-3 font-medium">Nama</th>
                                    <th className="pb-3 font-medium">Email</th>
                                    <th className="pb-3 font-medium">Role</th>
                                    <th className="pb-3 font-medium">Terdaftar</th>
                                    <th className="pb-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b border-[#1F2937] last:border-0">
                                        <td className="py-3 text-white">{user.name}</td>
                                        <td className="py-3 text-gray-400">{user.email}</td>
                                        <td className="py-3">
                                            <Badge variant={user.role === 'admin' ? 'success' : 'default'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-gray-400">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="py-3">
                                            <div className="flex gap-2">
                                                <Link href={`/users/${user.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#DC2626]" onClick={() => handleDelete(user.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
