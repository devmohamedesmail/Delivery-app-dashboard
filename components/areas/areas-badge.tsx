import React from 'react'
import { Badge } from '../ui/badge'

export default function AreasBadge({areas,t}:{
    areas:any,
    t:any
}) {
  return (
     <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{t("areas.title") || "Areas"}</h1>
                        {areas?.meta?.total !== undefined && (
                            <Badge variant="secondary" className="text-sm">
                                {areas.meta.total} {t("areas.title") || "Areas"}
                            </Badge>
                        )}
                    </div>
  )
}
