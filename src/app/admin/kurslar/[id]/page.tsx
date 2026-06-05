import { getCourse } from "../actions";
import CourseForm from "../CourseForm";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
    const { id } = await params;
    const course = await getCourse(id);

    if (!course) {
        notFound();
    }

    const rawCategories = await prisma.course.findMany({ select: { category: true }, distinct: ['category'] });
    const existingCategories = Array.from(new Set(rawCategories.map(c => c.category).filter(Boolean))) as string[];

    return <CourseForm mode="edit" course={course as any} existingCategories={existingCategories} />;
}
