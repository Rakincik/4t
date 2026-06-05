import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PlusIcon, PencilIcon, TrashIcon, NewspaperIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function createPost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = title.toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    let imageUrl = formData.get("imageUrl") as string | null;
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const uploadPath = path.join(process.cwd(), "public/uploads", filename);
        await writeFile(uploadPath, buffer);
        imageUrl = `/uploads/${filename}`;
    }

    await prisma.blogPost.create({
        data: {
            title,
            slug,
            content: formData.get("content") as string,
            excerpt: formData.get("excerpt") as string || null,
            imageUrl: imageUrl,
            category: formData.get("category") as string || null,
            isPublished: formData.get("isPublished") === "on",
            publishedAt: formData.get("isPublished") === "on" ? new Date() : null,
        },
    });
    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

async function deletePost(formData: FormData) {
    "use server";
    await prisma.blogPost.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/blog");
}

async function togglePublish(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (post) {
        await prisma.blogPost.update({
            where: { id },
            data: {
                isPublished: !post.isPublished,
                publishedAt: !post.isPublished ? new Date() : null,
            },
        });
    }
    revalidatePath("/admin/blog");
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
                <p className="text-gray-500 text-sm">Blog içeriklerinizi yönetin.</p>
            </div>

            {/* Yeni Yazı Formu */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Yeni Yazı Oluştur</h2>
                <form action={createPost} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Yazı Başlığı *" required className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        <input name="category" placeholder="Kategori (örn: KPSS, Genel)" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div className="flex items-center gap-4 border border-gray-200 px-4 py-2 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-700 w-32 shrink-0">Kapak Görseli</label>
                        <div className="w-full">
                            <input type="file" name="imageFile" accept="image/*" className="text-sm focus:outline-none w-full" />
                            <p className="text-[10px] text-gray-400 mt-1">16:9 Oran • Maks 5MB (Önerilen 3MB)</p>
                        </div>
                    </div>
                    <input name="excerpt" placeholder="Kısa Açıklama (Özet)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <textarea name="content" placeholder="İçerik (Markdown destekli) *" required rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none font-mono" />
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" name="isPublished" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            Hemen Yayınla
                        </label>
                        <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                            <PlusIcon className="w-4 h-4" /> Yazı Oluştur
                        </button>
                    </div>
                </form>
            </div>

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
