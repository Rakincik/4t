"use client";

import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface SortableListProps<T> {
    items: T[];
    onChange: (items: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string;
}

export default function SortableList<T>({ items, onChange, renderItem, keyExtractor }: SortableListProps<T>) {
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        onChange(newItems);
    };

    const moveDown = (index: number) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        onChange(newItems);
    };

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={keyExtractor ? keyExtractor(item, i) : i} className="flex items-start gap-1.5">
                    {/* Sort Controls */}
                    <div className="flex flex-col gap-0.5 pt-1">
                        <button
                            type="button"
                            onClick={() => moveUp(i)}
                            disabled={i === 0}
                            className={`w-5 h-5 rounded flex items-center justify-center transition ${i === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                            title="Yukarı Taşı"
                        >
                            <ChevronUpIcon className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            onClick={() => moveDown(i)}
                            disabled={i === items.length - 1}
                            className={`w-5 h-5 rounded flex items-center justify-center transition ${i === items.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                            title="Aşağı Taşı"
                        >
                            <ChevronDownIcon className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {renderItem(item, i)}
                    </div>
                </div>
            ))}
        </div>
    );
}
