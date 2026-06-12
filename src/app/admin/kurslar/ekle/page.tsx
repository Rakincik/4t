import CourseForm from "../CourseForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EkleKursPage() {
    const rawCategories = await prisma.course.findMany({ select: { category: true }, distinct: ['category'] });
    const existingCategories = Array.from(new Set(rawCategories.map(c => c.category).filter(Boolean))) as string[];
    const dbCategories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    
    return <CourseForm mode="create" existingCategories={existingCategories} dbCategories={dbCategories} />;
}
