import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

async function updatePost(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    // We optionally update slug? Or keep it same. Let's keep it same unless title changes radically, but maybe better not to auto-change slug to prevent broken links.
    // However, if we do keep it the same, it's safer. Let's just update the content.
    
    let imageUrl = formData.get("currentImageUrl") as string | null;
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const uploadPath = path.join(process.cwd(), "public/uploads", filename);
        await writeFile(uploadPath, buffer);
        imageUrl = `/uploads/${filename}`;
    }

    await prisma.blogPost.update({
        where: { id },
        data: {
            title,
            content: formData.get("content") as string,
            excerpt: formData.get("excerpt") as string || null,
            imageUrl: imageUrl,
            category: formData.get("category") as string || null,
        },
    });

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export default async function EditBlogPage({ params }: PageProps) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yazıyı Düzenle</h1>
                    <p className="text-gray-500 text-sm">{post.title}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <form action={updatePost} className="space-y-4">
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="currentImageUrl" value={post.imageUrl || ""} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" defaultValue={post.title} placeholder="Yazı Başlığı *" required className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        <input name="category" defaultValue={post.category || ""} placeholder="Kategori (örn: KPSS, Genel)" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    
                    <div className="flex items-center gap-4 border border-gray-200 px-4 py-2 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-700 shrink-0">Yeni Kapak Görseli (Opsiyonel)</label>
                        <div className="w-full">
                            <input type="file" name="imageFile" accept="image/*" className="text-sm focus:outline-none w-full" />
                            <p className="text-[10px] text-gray-400 mt-1">16:9 Oran • Maks 5MB (Önerilen 3MB)</p>
                        </div>
                        {post.imageUrl && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded whitespace-nowrap">Mevcut görsel yüklü</span>
                        )}
                    </div>
                    
                    <input name="excerpt" defaultValue={post.excerpt || ""} placeholder="Kısa Açıklama (Özet)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    
                    <textarea name="content" defaultValue={post.content} placeholder="İçerik (Markdown destekli) *" required rows={12} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y font-mono" />
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
                            <CheckIcon className="w-5 h-5" /> Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
