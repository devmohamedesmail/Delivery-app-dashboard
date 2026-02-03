'use client'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import I18nProvider from '@/context/I18n-provider'
import { AuthProvider } from '@/context/auth-provider'
import AppCookiesProvider from '@/context/cookie-provider'
import SettingProvider from '@/context/setting-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient()

    return (
        <AppCookiesProvider>
            <QueryClientProvider client={queryClient}>
                <I18nProvider>
                    <AuthProvider>
                        <SettingProvider>
                            {children}
                        </SettingProvider>
                    </AuthProvider>
                    <Toaster />
                </I18nProvider>
            </QueryClientProvider>
        </AppCookiesProvider>

    )
}
