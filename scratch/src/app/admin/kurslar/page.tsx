import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteCourseButton from "./DeleteCourseButton";

export const dynamic = "force-dynamic";

async function getCourses() {
    return prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { courseAccess: true, orderItems: true } },
        },
    });
}

function formatTRY(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

export default async function KurslarPage() {
    const courses = await getCourses();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kurslar</h1>
                    <p className="text-gray-500">Tüm kursları yönetin ve düzenleyin.</p>
                </div>
                <Link
                    href="/admin/kurslar/ekle"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
                >
                    <PlusIcon className="h-5 w-5" />
                    Yeni Kurs
                </Link>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                        Henüz kurs eklenmemiş.
                    </div>
                ) : (
                    courses.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="h-36 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                {c.imageUrl ? (
                                    <img
                                        src={c.imageUrl}
                                        alt={c.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-primary/30">4T</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                                            {c.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{c.category || "Genel"}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${c.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {c.isActive ? "Aktif" : "Pasif"}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-primary">
                                        {formatTRY(c.price)}
                                    </span>
                                    {c.oldPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {formatTRY(c.oldPrice)}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                    <span>{c._count.courseAccess} öğrenci</span>
                                    <span>{c._count.orderItems} satış</span>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <Link
                                        href={`/admin/kurslar/${c.id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Düzenle
                                    </Link>
                                    <DeleteCourseButton id={c.id} title={c.title} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
