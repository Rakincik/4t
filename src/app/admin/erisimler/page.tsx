"use client";

import { useState, useEffect, useTransition } from "react";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

type User = { id: string; name: string; email: string };
type Course = { id: string; title: string };
type Access = {
    id: string;
    grantedAt: string;
    expiresAt: string | null;
    user: User;
    course: Course;
};

export default function ErisimlerPage() {
    const [accesses, setAccesses] = useState<Access[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Form state
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    // Fetch data
    useEffect(() => {
        async function fetchData() {
            try {
                const [accessRes, userRes, courseRes] = await Promise.all([
                    fetch("/api/admin/access"),
                    fetch("/api/admin/users?role=STUDENT"),
                    fetch("/api/admin/courses"),
                ]);
                const [accessData, userData, courseData] = await Promise.all([
                    accessRes.json(),
                    userRes.json(),
                    courseRes.json(),
                ]);
                setAccesses(accessData);
                setUsers(userData);
                setCourses(courseData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Grant access
    async function handleGrant(e: React.FormEvent) {
        e.preventDefault();

        startTransition(async () => {
            try {
                const res = await fetch("/api/admin/access", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: selectedUser,
                        courseId: selectedCourse,
                        expiresAt: expiresAt || null,
                    }),
                });

                if (res.ok) {
                    const newAccess = await res.json();
                    setAccesses((prev) => [newAccess, ...prev]);
                    setShowModal(false);
                    setSelectedUser("");
                    setSelectedCourse("");
                    setExpiresAt("");
                }
            } catch (error) {
                console.error("Error granting access:", error);
            }
        });
    }

    // Remove access
    async function handleRemove(id: string) {
        if (!confirm("Bu erişimi kaldırmak istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/admin/access?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setAccesses((prev) => prev.filter((a) => a.id !== id));
            }
        } catch (error) {
            console.error("Error removing access:", error);
        }
    }

    function formatDate(date: string) {
        return new Intl.DateTimeFormat("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kurs Erişimleri</h1>
                    <p className="text-gray-500">
                        Öğrencilere manuel kurs erişimi verin veya kaldırın.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5" />
                    Erişim Ver
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Öğrenci
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Kurs
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Durum
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Verilme Tarihi
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Bitiş Tarihi
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {accesses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Henüz kurs erişimi tanımlanmamış.
                                    </td>
                                </tr>
                            ) : (
                                accesses.map((a) => {
                                    const isExpired = a.expiresAt && new Date(a.expiresAt) < new Date();
                                    const isSoon = a.expiresAt && !isExpired && (new Date(a.expiresAt).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
                                    return (
                                    <tr key={a.id} className={`hover:bg-gray-50 ${isExpired ? 'opacity-60 bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{a.user.name}</p>
                                            <p className="text-sm text-gray-500">{a.user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{a.course.title}</td>
                                        <td className="px-6 py-4">
                                            {isExpired ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    Süresi Dolmuş
                                                </span>
                                            ) : isSoon ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                    Az Kaldı
                                                </span>
                                            ) : a.expiresAt ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                    Süresiz
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {formatDate(a.grantedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {a.expiresAt ? (
                                                <span className={isExpired ? 'text-red-500 line-through' : isSoon ? 'text-amber-600 font-bold' : 'text-gray-600'}>
                                                    {formatDate(a.expiresAt)}
                                                </span>
                                            ) : (
                                                <span className="text-blue-600 font-medium">Süresiz ∞</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(a.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );})
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Kurs Erişimi Ver</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGrant} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Öğrenci
                                </label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="">Öğrenci seçin...</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kurs
                                </label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="">Kurs seçin...</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bitiş Tarihi (Opsiyonel)
                                </label>
                                <input
                                    type="date"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Boş bırakılırsa süresiz erişim verilir.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {isPending ? "Kaydediliyor..." : "Erişim Ver"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
