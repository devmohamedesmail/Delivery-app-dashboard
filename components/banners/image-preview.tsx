import React, { useState } from 'react'
import Image from 'next/image';

export default function ImagePreview({ file, existingUrl }: { file: File | null; existingUrl?: string | null }) {
    const [preview, setPreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (!file) { setPreview(null); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const src = preview ?? existingUrl;
    if (!src) return null;

    return (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border shadow-sm">
            <Image src={src} alt="banner preview" fill className="object-cover" unoptimized={!!preview} />
        </div>
    )
}
