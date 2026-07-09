"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export interface Slide {
    id: number;
    image: string;
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    btnBg?: string;
    btnColor?: string;
    btnPosition?: string;
}

interface HeroSliderProps {
    slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    if (!slides || slides.length === 0) return null;

    return (
        <section className="relative h-[85svh] min-h-[500px] lg:min-h-[600px] w-full overflow-hidden bg-[#0B1221]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <motion.div
                            className="w-full h-full absolute inset-0"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 6 }}
                        >
                            <Image fill sizes="100vw" priority src={slides[current].image} alt={slides[current].title} className="object-cover" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/95 via-[#0B1221]/70 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto max-w-7xl px-4 flex items-center pb-24 md:pb-32">
                        <div className="max-w-2xl space-y-4 md:space-y-6 pt-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white">{slides[current].subtitle}</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1]"
                            >
                                {slides[current].title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="text-sm md:text-xl text-gray-300 leading-relaxed max-w-xl line-clamp-3 md:line-clamp-none"
                            >
                                {slides[current].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className={`pt-4 w-full flex ${slides[current].btnPosition === 'center' ? 'justify-center' : slides[current].btnPosition === 'right' ? 'justify-end' : 'justify-start'}`}
                            >
                                <a
                                    href={slides[current].href}
                                    style={{
                                        backgroundColor: slides[current].btnBg || "#DC2626",
                                        color: slides[current].btnColor || "#FFFFFF"
                                    }}
                                    className="group inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 font-bold rounded-2xl transition-all shadow-lg hover:shadow-black/20 hover:-translate-y-1 hover:brightness-110"
                                >
                                    {slides[current].cta}
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="hidden md:flex absolute bottom-24 right-12 gap-4 z-20">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? "w-8 bg-[#DC2626]" : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
