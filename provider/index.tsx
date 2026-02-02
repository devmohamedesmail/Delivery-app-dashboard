'use client'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import I18nProvider from '@/context/I18n-provider'
import { AuthProvider } from '@/context/auth-provider'
import AppCookiesProvider from '@/context/cookie-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppCookiesProvider>
            <I18nProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster />
            </I18nProvider>
        </AppCookiesProvider>

    )
}
