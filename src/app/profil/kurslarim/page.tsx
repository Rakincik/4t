import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
    BookOpenIcon,
    AcademicCapIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
    }).format(new Date(date));
}

function daysLeft(expiresAt: Date | null): number | null {
    if (!expiresAt) return null; // süresiz
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function MyCoursesPage() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) redirect("/giris");

    const accesses = await prisma.courseAccess.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true, title: true, slug: true, type: true,
                    imageUrl: true, category: true, hours: true,
                },
            },
        },
        orderBy: { grantedAt: "desc" },
    });

    const activeCourses = accesses.filter(a => {
        if (!a.expiresAt) return true; // süresiz
        return new Date(a.expiresAt) > new Date();
    });

    const expiredCourses = accesses.filter(a => {
        if (!a.expiresAt) return false;
        return new Date(a.expiresAt) <= new Date();
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Kurslarım</h1>
                <div className="text-sm font-bold text-gray-500">
                    {activeCourses.length} Aktif Kurs
                </div>
            </div>

            {accesses.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <BookOpenIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz Bir Kursun Yok</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Satın aldığın kurslar burada listelenir. Eğitim kataloğumuza göz atarak hemen öğrenmeye başlayabilirsin.
                    </p>
                    <Link
                        href="/kurslar"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold bg-[#DC2626] text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                        Kursları İncele
                    </Link>
                </div>
            ) : (
                <>
                    {/* Aktif Kurslar */}
                    {activeCourses.length > 0 && (
                        <div className="space-y-3">
                            {activeCourses.map((access) => {
                                const remaining = daysLeft(access.expiresAt);
                                const isUrgent = remaining !== null && remaining <= 30;
                                return (
                                    <div key={access.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition group">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                            {access.course.imageUrl ? (
                                                <div className="relative w-full h-full"><Image fill sizes="64px" src={access.course.imageUrl} alt="" className="object-cover" /></div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <AcademicCapIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 truncate [&_*]:inline" dangerouslySetInnerHTML={{ __html: access.course.title || "" }} />
                                            <div className="flex items-center gap-3 mt-1">
                                                {access.course.hours && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" /> {access.course.hours} saat
                                                    </span>
                                                )}
                                                {remaining === null ? (
                                                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                                        <CheckBadgeIcon className="w-3 h-3" /> Süresiz Erişim
                                                    </span>
                                                ) : isUrgent ? (
                                                    <span className="text-xs text-amber-600 flex items-center gap-1 font-bold">
                                                        <ExclamationTriangleIcon className="w-3 h-3" /> {remaining} gün kaldı!
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" /> {formatDate(access.expiresAt!)} tarihine kadar
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/kurs/${access.course.slug}`}
                                            className="px-5 py-2.5 rounded-xl font-bold bg-gray-50 text-gray-700 hover:bg-[#0B1221] hover:text-white transition text-sm shrink-0"
                                        >
                                            Kursa Git
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Süresi Dolmuş Kurslar */}
                    {expiredCourses.length > 0 && (
                        <div className="space-y-3 mt-8">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4" /> Süresi Dolmuş Kurslar
                            </h2>
                            {expiredCourses.map((access) => (
                                <div key={access.id} className="bg-white/60 rounded-2xl border border-gray-100 p-5 flex items-center gap-4 opacity-60">
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 grayscale">
                                        {access.course.imageUrl ? (
                                            <div className="relative w-full h-full"><Image fill sizes="64px" src={access.course.imageUrl} alt="" className="object-cover" /></div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <AcademicCapIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-500 truncate [&_*]:inline" dangerouslySetInnerHTML={{ __html: access.course.title || "" }} />
                                        <p className="text-xs text-red-500 font-medium mt-0.5">
                                            Erişim süresi {formatDate(access.expiresAt!)} tarihinde sona erdi.
                                        </p>
                                    </div>
                                    <Link
                                        href={`/kurs/${access.course.slug}`}
                                        className="px-5 py-2.5 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition text-sm shrink-0"
                                    >
                                        Yeniden Satın Al
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
