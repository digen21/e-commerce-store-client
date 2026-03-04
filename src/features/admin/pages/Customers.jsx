import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const AdminCustomers = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 10;

    const { data: customersData, isLoading } = useCustomers({ page, limit, search });

    const customers = customersData?.customers || [];
    const totalPages = customersData?.pagination?.totalPages || 1;
    const totalCustomers = customersData?.pagination?.total || 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your customer base</p>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{totalCustomers} Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-muted/50 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No customers found
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Total Spent</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => (
                                        <TableRow key={customer._id}>
                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                    {customer.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{customer.totalOrders} orders</Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold text-primary">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    {customer.totalSpent?.toFixed(2)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={customer.isEmailVerified ? 'default' : 'secondary'}>
                                                    {customer.isEmailVerified ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCustomers)} of {totalCustomers} customers
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCustomers;
