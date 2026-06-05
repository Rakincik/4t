"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface ResizableSplitterProps {
    minWidth?: number;
    maxWidth?: number;
    defaultWidth?: number;
    children: [React.ReactNode, React.ReactNode]; // [left, right]
}

export default function ResizableSplitter({
    minWidth = 320,
    maxWidth = 800,
    defaultWidth = 480,
    children,
}: ResizableSplitterProps) {
    const [rightWidth, setRightWidth] = useState(defaultWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = rect.right - e.clientX;
            setRightWidth(Math.min(maxWidth, Math.max(minWidth, newWidth)));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        // Prevent text selection while dragging
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [isDragging, minWidth, maxWidth]);

    return (
        <div ref={containerRef} className="flex h-full overflow-hidden" style={{ position: "relative" }}>
            {/* Left Panel (flex-1) */}
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                {children[0]}
            </div>

            {/* Drag Handle */}
            <div
                onMouseDown={handleMouseDown}
                className={`relative w-0 shrink-0 z-10 group ${isDragging ? "" : "hover:cursor-col-resize"}`}
                style={{ cursor: "col-resize" }}
            >
                {/* Visible line */}
                <div className={`absolute inset-y-0 -left-px w-[3px] transition-colors duration-150 ${
                    isDragging ? "bg-blue-500" : "bg-gray-200 group-hover:bg-blue-400"
                }`} />

                {/* Grab indicator — centered dots */}
                <div className={`absolute top-1/2 -translate-y-1/2 -left-[7px] w-[14px] h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
                    isDragging 
                        ? "bg-blue-500 shadow-lg shadow-blue-500/30 scale-110" 
                        : "bg-gray-200 group-hover:bg-blue-400 group-hover:shadow-md"
                }`}>
                    <div className="flex flex-col gap-[3px]">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`w-1 h-1 rounded-full ${isDragging ? "bg-white" : "bg-gray-400 group-hover:bg-white"}`} />
                        ))}
                    </div>
                </div>

                {/* Wider invisible hit area */}
                <div className="absolute inset-y-0 -left-2 w-5" />
            </div>

            {/* Right Panel (resizable) */}
            <div 
                className="shrink-0 overflow-hidden flex flex-col"
                style={{ width: rightWidth }}
            >
                {children[1]}
            </div>
        </div>
    );
}
