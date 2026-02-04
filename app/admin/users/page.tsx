'use client'
import React, { useState, useMemo } from 'react'
import { useQuery } from "@tanstack/react-query";
import UsersController from '@/controllers/users-controller';
import type { User } from '@/controllers/users-controller';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge";
import { Search, X, Users, ShieldCheck, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function UsersPage() {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [verificationFilter, setVerificationFilter] = useState<string>('all');
    const [storeFilter, setStoreFilter] = useState<string>('all');

    /* ================= FETCH USERS ================= */
    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: UsersController.getUsers,
    });

    /* ================= SEARCH AND FILTER ================= */
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        let filtered = [...users];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((user: User) => {
                const nameMatch = user.name?.toLowerCase().includes(query);
                const emailMatch = user.email?.toLowerCase().includes(query);
                const phoneMatch = user.phone?.toLowerCase().includes(query);
                return nameMatch || emailMatch || phoneMatch;
            });
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter((user: User) => user.role.role === roleFilter);
        }

        // Verification filter
        if (verificationFilter === 'verified') {
            filtered = filtered.filter((user: User) => user.email_verified || user.phone_verified);
        } else if (verificationFilter === 'not_verified') {
            filtered = filtered.filter((user: User) => !user.email_verified && !user.phone_verified);
        }

        // Store filter
        if (storeFilter === 'has_store') {
            filtered = filtered.filter((user: User) => user.store !== null);
        } else if (storeFilter === 'no_store') {
            filtered = filtered.filter((user: User) => user.store === null);
        }

        return filtered;
    }, [users, searchQuery, roleFilter, verificationFilter, storeFilter]);

    /* ================= STATS ================= */
    const stats = useMemo(() => {
        const totalUsers = users?.length || 0;
        const verifiedUsers = users?.filter((u: User) => u.email_verified || u.phone_verified).length || 0;
        const storeOwners = users?.filter((u: User) => u.role.role === 'store_owner').length || 0;
        return { totalUsers, verifiedUsers, storeOwners };
    }, [users]);

    /* ================= FORMAT DATE ================= */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    /* ================= CLEAR FILTERS ================= */
    const clearFilters = () => {
        setSearchQuery('');
        setRoleFilter('all');
        setVerificationFilter('all');
        setStoreFilter('all');
    };

    const hasActiveFilters = searchQuery || roleFilter !== 'all' || verificationFilter !== 'all' || storeFilter !== 'all';

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("users.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("users.subtitle")}</p>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("users.totalUsers")}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {filteredUsers.length !== stats.totalUsers && (
                                <span>{filteredUsers.length} {t("users.noResults").toLowerCase()}</span>
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("users.verifiedUsers")}
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("users.emailVerified")} / {t("users.phoneVerified")}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("users.storeOwners")}
                        </CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.storeOwners}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("users.roles.store_owner")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("users.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={t("users.clearSearch")}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    {/* Role Filter */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder={t("users.filterByRole")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("users.allRoles")}</SelectItem>
                            <SelectItem value="admin">{t("users.roles.admin")}</SelectItem>
                            <SelectItem value="store_owner">{t("users.roles.store_owner")}</SelectItem>
                            <SelectItem value="user">{t("users.roles.user")}</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Verification Filter */}
                    <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                        <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder={t("users.filterByVerification")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("users.allVerificationStatus")}</SelectItem>
                            <SelectItem value="verified">{t("users.verified")}</SelectItem>
                            <SelectItem value="not_verified">{t("users.notVerified")}</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Store Filter */}
                    <Select value={storeFilter} onValueChange={setStoreFilter}>
                        <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder={t("users.filterByStore")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("common.all")}</SelectItem>
                            <SelectItem value="has_store">{t("users.hasStore")}</SelectItem>
                            <SelectItem value="no_store">{t("users.noStore")}</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="shadow-sm"
                        >
                            <X className="w-4 h-4 mr-2" />
                            {t("users.clearSearch")}
                        </Button>
                    )}
                </div>
            </div>

            {/* TABLE */}
            <Card className="shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className='text-center font-semibold'>{t("common.id")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.name")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.contact")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.role")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.verification")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.store")}</TableHead>
                            <TableHead className='text-center font-semibold'>{t("users.joinDate")}</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t("common.loading")}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map((user: User) => (
                                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className='text-center font-medium'>{user.id}</TableCell>
                                    <TableCell className='text-center font-medium'>{user.name}</TableCell>
                                    <TableCell className='text-center text-muted-foreground'>
                                        <div className="flex flex-col gap-1">
                                            {user.email && (
                                                <span className="text-sm">{user.email}</span>
                                            )}
                                            {user.phone && (
                                                <span className="text-sm">{user.phone}</span>
                                            )}
                                            {!user.email && !user.phone && (
                                                <span className="text-sm italic">{t("users.notAvailable")}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant="secondary" className="shadow-sm">
                                            {i18n.language === "ar" ? user.role.title_ar : user.role.title_en}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <div className="flex flex-col gap-1 items-center">
                                            {user.email_verified && (
                                                <Badge variant="default" className="shadow-sm bg-green-500 hover:bg-green-600">
                                                    {t("users.emailVerified")}
                                                </Badge>
                                            )}
                                            {user.phone_verified && (
                                                <Badge variant="default" className="shadow-sm bg-blue-500 hover:bg-blue-600">
                                                    {t("users.phoneVerified")}
                                                </Badge>
                                            )}
                                            {!user.email_verified && !user.phone_verified && (
                                                <Badge variant="outline" className="shadow-sm">
                                                    {t("users.notVerified")}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        {user.store ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-sm">{user.store.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.store.phone}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">{t("users.noStore")}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-center text-muted-foreground text-sm'>
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        {hasActiveFilters ? (
                                            <>
                                                <Search className="w-12 h-12 text-muted-foreground/30" />
                                                <p className="text-lg font-medium text-muted-foreground">{t("users.noResults")}</p>
                                                <p className="text-sm text-muted-foreground">{t("users.tryDifferentSearch")}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={clearFilters}
                                                    className="mt-2"
                                                >
                                                    {t("users.clearSearch")}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Users className="w-12 h-12 text-muted-foreground/30" />
                                                <p className="text-lg font-medium text-muted-foreground">{t("users.noUsersFound")}</p>
                                                <p className="text-sm text-muted-foreground">{t("users.adjustFilters")}</p>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
