import { getCourse } from "../actions";
import CourseForm from "../CourseForm";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
    const { id } = await params;
    const course = await getCourse(id);

    if (!course) {
        notFound();
    }

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kurs Düzenle</h1>
                <p className="text-gray-500 mt-1">{course.title}</p>
            </div>
            <CourseForm mode="edit" course={course} />
        </div>
    );
}
