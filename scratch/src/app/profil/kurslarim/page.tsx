"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon, BookOpenIcon } from "@heroicons/react/24/solid";

// Mock data until we connect to real DB
const mockCourses = [
    // {
    //   id: 1,
    //   title: "2024 KPSS A Video Ders Paketi",
    //   image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
    //   progress: 35,
    //   lastLesson: "İktisat - Mikro İktisat Teorisi",
    // },
];

export default function MyCoursesPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Kurslarım</h1>
                <div className="text-sm font-bold text-gray-500">
                    Toplam {mockCourses.length} Kurs
                </div>
            </div>

            {mockCourses.length === 0 ? (
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircleIcon className="w-16 h-16 text-white" />
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{course.title}</h3>
                                <div className="text-sm text-gray-500 mb-4">
                                    Son izlenen: <span className="text-gray-700 font-medium">{course.lastLesson}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">% {course.progress} Tamamlandı</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#DC2626] rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="mt-5 w-full py-3 rounded-xl font-bold bg-gray-50 text-gray-700 hover:bg-[#0B1221] hover:text-white transition-colors">
                                    Derse Devam Et
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
