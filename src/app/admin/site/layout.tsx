"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Cog6ToothIcon,
    ListBulletIcon,
    PencilSquareIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const siteNavItems = [
    { href: "/admin/site", label: "Genel Ayarlar", icon: Cog6ToothIcon },
    { href: "/admin/site/menuler", label: "Menüler", icon: ListBulletIcon },
];

export default function SiteAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Admin Panel
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Site Yönetimi
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Footer, menü ve iletişim bilgilerini burada düzenleyin.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4">
                    {siteNavItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin/site" &&
                                pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div>{children}</div>
        </div>
    );
}
