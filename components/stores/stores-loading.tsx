import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import Loading from '@/components/ui/loading'
export default function StoresLoading() {
    return (
        <TableRow>
            <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                <Loading />
            </TableCell>
        </TableRow>
    )
}
