"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function Avatar({
    src,
    alt = "Avatar",
    size = 40,
    className = "",
    fallback,
    showFallback = true,
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!src);

    // Kalau error atau kosong → fallback ke avatar.svg
    const finalSrc = !src || imageError ? "/avatar.svg" : src;

    const baseClasses =
        "rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 border border-gray-200";
    const sizeStyle = { width: size, height: size };

    if (!showFallback && (!src || imageError)) return null;

    return (
        <div className="relative" style={sizeStyle}>
            {/* Skeleton shimmer */}
            {imageLoading && (
                <div
                    className={`absolute inset-0 ${baseClasses} ${className}`}
                    style={sizeStyle}
                >
                    <div className="animate-pulse bg-gray-300 rounded-full w-full h-full" />
                </div>
            )}

            {/* Avatar Image with fallback */}
            {finalSrc ? (
                <div
                    className={`relative overflow-hidden ${baseClasses} ${className}`}
                    style={sizeStyle}
                >
                    <Image
                        src={finalSrc}
                        alt={alt}
                        fill
                        sizes={`${size}px`}
                        onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                        }}
                        onLoad={() => setImageLoading(false)}
                        className={`object-cover rounded-full transition-opacity duration-200 ${imageLoading ? "opacity-0" : "opacity-100"
                            }`}
                    />
                </div>
            ) : (
                fallback || (
                    <div
                        className={`${baseClasses} ${className}`}
                        style={sizeStyle}
                        aria-label={alt}
                    >
                        <User size={size * 0.4} className="text-gray-400" />
                    </div>
                )
            )}
        </div>
    );
}
