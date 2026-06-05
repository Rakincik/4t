import CourseForm from "../CourseForm";

export default function EkleKursPage() {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Yeni Kurs Ekle</h1>
                <p className="text-gray-500 mt-1">Yeni bir kurs oluşturun.</p>
            </div>
            <CourseForm mode="create" />
        </div>
    );
}
