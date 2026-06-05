"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[var(--c-bg)]">
            {/* Mesh Gradient 1: Primary Blue */}
            <motion.div
                className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[var(--c-primary)] opacity-10 blur-[100px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Mesh Gradient 2: Secondary Red (Subtle) */}
            <motion.div
                className="absolute top-[40%] right-[0%] h-[40vh] w-[40vh] rounded-full bg-[var(--c-secondary)] opacity-5 blur-[90px]"
                animate={{
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
            />

            {/* Mesh Gradient 3: Accent Violet */}
            <motion.div
                className="absolute bottom-[0%] left-[20%] h-[60vh] w-[60vh] rounded-full bg-[var(--c-accent)] opacity-5 blur-[120px]"
                animate={{
                    x: [0, 40, 0],
                    y: [0, -60, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Grid Pattern Overlay (Optional for texture) */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
