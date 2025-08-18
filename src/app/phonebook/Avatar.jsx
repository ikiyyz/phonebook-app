import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function Avatar({ src, alt = 'Avatar', size = 40, className = '', fallback, showFallback = true }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!src);

    // Reset state saat src berubah
    useEffect(() => {
        setImageError(false);
        setImageLoading(!!src);
    }, [src]);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const baseClasses = "rounded-full object-cover bg-gray-100 flex items-center justify-center transition-all duration-200 border-2 border-gray-200";
    const sizeStyle = { width: size, height: size };

    if (!src || imageError || fallback) {
        if (!showFallback) return null;

        return (
            <div className={`${baseClasses} ${className}`} style={sizeStyle} aria-label={alt}>
                {fallback || <User size={size * 0.4} className="text-gray-400" aria-hidden="true" />}
            </div>
        );
    }

    return (
        <div className="relative" style={sizeStyle}>
            {imageLoading && (
                <div className={`absolute inset-0 ${baseClasses} ${className}`} style={sizeStyle}>
                    <div className="animate-pulse bg-gray-300 rounded-full w-full h-full"></div>
                </div>
            )}

            <img
                src={src}
                alt={alt}
                className={`${baseClasses} ${className} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                style={sizeStyle}
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
            />
        </div>
    );
}
