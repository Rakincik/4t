"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";

export async function createPost(formData: FormData) {
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

export async function deletePost(formData: FormData) {
    await prisma.blogPost.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/blog");
}

export async function togglePublish(formData: FormData) {
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

export async function updatePost(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    
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
