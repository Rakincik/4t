import prisma from "@/lib/prisma";
import { NewspaperIcon, EyeIcon, PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { deletePost, togglePublish, toggleFeatured } from "./actions";
import CreateBlogForm from "./CreateBlogForm";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

type PageProps = {
    searchParams: Promise<{ error?: string }>;
};

export default async function AdminBlogPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const error = resolvedParams?.error;
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="space-y-6">
            {error === "limit" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm">
                    <span>⚠️ En fazla 3 adet blog yazısını öne çıkarabilirsiniz. Lütfen yenisini eklemeden önce mevcutlardan birinin yıldızını kaldırın.</span>
                    <Link href="/admin/blog" className="text-red-900 font-bold hover:underline ml-4 shrink-0">Kapat</Link>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
                <p className="text-gray-500 text-sm">
                    Blog içeriklerinizi yönetin. En fazla 3 adet blog yazısını yıldızlayarak ana sayfada öne çıkarabilirsiniz.
                </p>
            </div>

            {/* Yeni Yazı Formu */}
            <CreateBlogForm />

            {/* Yazı Listesi */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {posts.length === 0 ? (
                    <div className="p-12 text-center">
                        <NewspaperIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Henüz yazı yok</h3>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="text-left px-5 py-3 font-medium">Yazı</th>
                                <th className="text-left px-5 py-3 font-medium">Kategori</th>
                                <th className="text-left px-5 py-3 font-medium">Durum</th>
                                <th className="text-left px-5 py-3 font-medium">Öne Çıkar</th>
                                <th className="text-left px-5 py-3 font-medium">Tarih</th>
                                <th className="text-right px-5 py-3 font-medium">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                                        <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-600">{post.category || "—"}</td>
                                    <td className="px-5 py-3">
                                        <form action={togglePublish} className="inline">
                                            <input type="hidden" name="id" value={post.id} />
                                            <button type="submit" className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                                {post.isPublished ? "Yayında" : "Taslak"}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-5 py-3">
                                        <form action={toggleFeatured} className="inline">
                                            <input type="hidden" name="id" value={post.id} />
                                            <button type="submit" className="p-1 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors" title={post.isFeatured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}>
                                                {post.isFeatured ? (
                                                    <StarIconSolid className="w-5 h-5 text-amber-500" />
                                                ) : (
                                                    <StarIcon className="w-5 h-5 text-gray-300 hover:text-amber-500" />
                                                )}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-gray-400">{formatDate(post.createdAt)}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="Görüntüle">
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Düzenle">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <form action={deletePost} className="inline">
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
