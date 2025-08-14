/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head,  router, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function index({ users }: { users: User[] }) {
    const [showLogoutDelete, setShowLogoutDelete] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | number | null>(null);
    const { data, setData, post, put, processing } = useForm({
        name: '',
        email: '',
        role: '',
        status: 'active' as 'active' | 'inactive',
    });

    const openEditDialog = (user: User) => {
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setEditingUserId(user.id);
        setEditMode(true);
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setDeleteUserId(user.id);
        setShowLogoutDelete(true);
    };

    const openAddDialog = () => {
        setData({ name: '', email: '', role: 'cashier', status: 'active' });
        setEditingUserId(null);
        setEditMode(false);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editMode) {
            const url: string = `/users/${editingUserId}`;
            put(url);
        } else {
            post(route('users.store'));
        }

        setIsDialogOpen(false);
    };

    const handleDelete = () => {
         router.delete(`/users/${deleteUserId}`);
        setShowLogoutDelete(false);                                                              
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'moderator':
                return 'secondary';
            default:
                return 'default';
        }
    };

    // useEffect(() => {
    //     if (flash?.success) {
    //         setShowAlert(true);

    //         // Sembunyikan alert otomatis setelah beberapa detik (opsional)
    //         const timer = setTimeout(() => setShowAlert(false), 5000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [flash]);

    // useEffect(() => {
    //     setData(transactions);
    // }, [transactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                <div className="mx-auto max-w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        </div>
                        <p className="text-gray-600">Manage and monitor all users in your system</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{users.length}</div>
                            </CardContent>
                        </Card>
                        {/* <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                <div className="h-4 w-4 rounded-full bg-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{users.filter((user) => user.status === 'active').length}</div>
                            </CardContent>
                        </Card> */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                                <div className="h-4 w-4 rounded-full bg-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{users.filter((user) => user.role === 'admin').length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Users Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Users</CardTitle>
                                    <CardDescription>
                                        A list of all users in your system including their name, email, role and status.
                                    </CardDescription>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="" onClick={openAddDialog}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
                                            <DialogDescription>
                                                {editMode
                                                    ? 'Update user information below.'
                                                    : 'Create a new user account. Fill in the details below.'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                                        className="col-span-3"
                                                        placeholder="Enter full name"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="email" className="text-right">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                                        className="col-span-3"
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="role" className="text-right">
                                                        Role
                                                    </Label>
                                                    <Select
                                                        value={data.role}
                                                        onValueChange={(value: 'admin' | 'cashier' | 'moderator') =>
                                                            setData({ ...data, role: value })
                                                        }
                                                    >
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cashier">Cashier</SelectItem>
                                                            <SelectItem value="moderator">Moderator</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={processing} className="">
                                                    {editMode ? 'Update User' : 'Add User'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(user)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showLogoutDelete} onOpenChange={setShowLogoutDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>Are you sure you want to Delete this user.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowLogoutDelete(false)}>
                            Cancel
                        </Button>
                        
                        <Button variant="destructive"  onClick={handleDelete} className="cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
