import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast'
export default function UserMenu() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();


    const handle_logout = async () => {
        await logout();
        toast.success(t('auth.logout_success'));
        setTimeout(() => {
            router.push('/auth/login');
        }, 1000);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className='cursor-pointer border-0'>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                        {user?.name?.charAt(0)}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <div className="p-3 border-b border-border">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                        <User className="h-4 w-4" />
                        <span>{t('auth.profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="h-4 w-4" />
                        <span>{t('common.settings')}</span>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handle_logout()}>
                        <LogOut className="h-4 w-4" />
                        <span>{t('auth.logout')}</span>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
