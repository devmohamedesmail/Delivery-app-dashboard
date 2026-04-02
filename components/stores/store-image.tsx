import React from 'react'
import { Store } from 'lucide-react'
import Image from 'next/image'

export default function StoreImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
    if (!src) {
        return (
            <div className={`flex items-center justify-center bg-muted rounded-md ${className ?? 'w-10 h-10'}`}>
                <Store className="h-4 w-4 text-muted-foreground" />
            </div>
        )
    }
  return (
    <Image
                src={src}
                alt={alt}
                width={40}
                height={40}
                unoptimized
                className={`object-cover rounded-md ${className ?? 'w-10 h-10'}`}
            />
  )
}
