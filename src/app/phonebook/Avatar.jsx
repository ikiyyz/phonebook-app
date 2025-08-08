'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Avatar({ src, alt, size = 40 }) {
    return (
        <div className="relative w-full h-full">
            <Image
                src={src || '/avatar.png'}
                alt={alt || 'Avatar'}
                width={size}
                height={size}
                className="rounded-full object-cover"
                priority
            />
        </div>
    );
}