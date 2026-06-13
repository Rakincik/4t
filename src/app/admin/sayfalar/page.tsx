import Link from "next/link";
import {
    DocumentTextIcon,
    ChevronRightIcon,
    BuildingLibraryIcon,
    HomeIcon,
    PhoneIcon,
    AcademicCapIcon,
    TrophyIcon,
} from "@heroicons/react/24/outline";

import prisma from "@/lib/prisma";
import CreateOrgunSubpageButton from "@/app/admin/components/CreateOrgunSubpageButton";

export const dynamic = "force-dynamic";

const PAGES = [
    {
        slug: "hakkimizda",
        name: "Hakkımızda",
        description: "Hero alanı, misyon/vizyon, değerler, ekip görselleri",
        icon: BuildingLibraryIcon,
        color: "bg-blue-50 text-blue-600",
        href: "/admin/sayfalar/hakkimizda",
        ready: true,
    },
    {
        slug: "home",
        name: "Ana Sayfa",
        description: "İstatistikler, kategori kartları, FLIX bölümü, blog başlığı",
        icon: HomeIcon,
        color: "bg-purple-50 text-purple-600",
        href: "/admin/sayfalar/anasayfa",
        ready: true,
    },
    {
        slug: "iletisim",
        name: "İletişim",
        description: "İletişim formu, adres, telefon, WhatsApp bilgileri ve harita",
        icon: PhoneIcon,
        color: "bg-green-50 text-green-600",
        href: "/admin/sayfalar/iletisim",
        ready: true,
    },
    {
        slug: "orgun-egitim",
        name: "Örgün Eğitim",
        description: "Lokasyon, eğitim modeli, eğitmen kadrosu, başarı adımları",
        icon: AcademicCapIcon,
        color: "bg-orange-50 text-orange-600",
        href: "/admin/sayfalar/orgun-egitim",
        ready: true,
    },
    {
        slug: "basarilarimiz",
        name: "Başarılarımız",
        description: "Hero başlığı, başarı hikayeleri ve testimonial yönetimi",
        icon: TrophyIcon,
        color: "bg-amber-50 text-amber-600",
        href: "/admin/sayfalar/basarilarimiz",
        ready: true,
    },
    {
        slug: "kurslar",
        name: "Kurslar (Tüm Eğitimler)",
        description: "Hero alanı, istatistik bandı, filtreleme ve arama",
        icon: DocumentTextIcon,
        color: "bg-indigo-50 text-indigo-600",
        href: "/admin/sayfalar/kurslar",
        ready: true,
    },
];

export default async function AdminSayfalarPage() {
    // Örgün eğitim alt sayfalarını (slug: orgun-egitim-*) getir
    const dynamicPagesData = await prisma.pageContent.findMany({
        where: { pageSlug: { startsWith: "orgun-egitim-" } },
        distinct: ["pageSlug"],
        select: { pageSlug: true },
    });

    const dynamicPages = dynamicPagesData.map((p) => p.pageSlug.replace("orgun-egitim-", ""));

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Sayfa İçerikleri</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    Her sayfanın başlıklarını, açıklamalarını, istatistiklerini ve görsellerini düzenleyin.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAGES.map((page) => {
                    const Icon = page.icon;
                    return (
                        <Link
                            key={page.slug}
                            href={page.href}
                            className={`group bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-gray-300 transition ${!page.ready ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${page.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900">{page.name}</h3>
                                    {!page.ready && (
                                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Yakında</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{page.description}</p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
                        </Link>
                    );
                })}

                {dynamicPages.map((slug) => (
                    <Link
                        key={slug}
                        href={`/admin/sayfalar/orgun-egitim/${slug}`}
                        className="group bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition"
                    >
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <AcademicCapIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">Örgün Eğitim ({slug.toUpperCase()})</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Alt Sayfa (/{slug})</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition shrink-0" />
                    </Link>
                ))}

                <CreateOrgunSubpageButton />
            </div>
        </div>
    );
}
