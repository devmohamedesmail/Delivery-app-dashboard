import React from 'react'
import { Image as ImageLucide } from 'lucide-react';
import Image from 'next/image';

export default function BannerThumbnail({ src }: { src?: string | null }) {
    if (!src) {
        return (
            <div className="inline-flex items-center justify-center w-16 h-10 rounded-md bg-muted mx-auto">
                <ImageLucide className="w-4 h-4 text-muted-foreground" />
            </div>
        );
    }
    return (
        <div className="inline-flex items-center justify-center">
            <div className="relative w-16 h-10 rounded-md overflow-hidden border shadow-sm">
                <Image src={src} alt="banner" fill className="object-cover" />
            </div>
        </div>
    )
}
