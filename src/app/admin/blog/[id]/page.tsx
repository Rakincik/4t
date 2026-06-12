import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogForm from "./EditBlogForm";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditBlogPage({ params }: PageProps) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
        notFound();
    }

    return <EditBlogForm post={post} />;
}
