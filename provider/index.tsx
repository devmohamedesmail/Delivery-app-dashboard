import React from 'react'
import { Toaster } from 'react-hot-toast'
import I18nProvider from '@/context/I18n-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (

        <I18nProvider>
            {children}
            <Toaster />
        </I18nProvider>

    )
}
