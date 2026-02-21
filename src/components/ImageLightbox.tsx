import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
    images: { src: string; alt: string }[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) => {
    const [current, setCurrent] = useState(initialIndex);

    useEffect(() => {
        setCurrent(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
            if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, images.length, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all hover:bg-white/5"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Counter */}
                <div className="absolute top-6 left-6 z-20">
                    <span className="text-white/50 font-body text-sm">
                        {current + 1} / {images.length}
                    </span>
                </div>

                {/* Image */}
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative z-10 max-w-[90vw] max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={images[current]?.src}
                        alt={images[current]?.alt}
                        className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
                    />
                    {/* Caption */}
                    <p className="text-center text-white/60 font-body text-sm mt-4">
                        {images[current]?.alt}
                    </p>
                </motion.div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
                            className="absolute left-4 md:left-8 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                            aria-label="Previous"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
                            className="absolute right-4 md:right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                            aria-label="Next"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-1">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                                className={`w-12 h-12 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${i === current ? "border-primary opacity-100 scale-110" : "border-transparent opacity-40 hover:opacity-70"
                                    }`}
                            >
                                <img src={img.src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageLightbox;
