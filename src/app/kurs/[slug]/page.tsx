import prisma from "@/lib/prisma";
import KursDetailClient from "./KursDetailClient";
import { notFound } from "next/navigation";
import { stripHtml } from "@/lib/htmlUtils";

export const revalidate = 60; // 1 dakika cache

function parseJsonSafe(val: any, fallback: any) {
    if (Array.isArray(val) || (typeof val === "object" && val !== null)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return fallback; } }
    return fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug }
    });
    if (!course) return { title: "Kurs Bulunamadı" };
    return { title: `${stripHtml(course.title)} | 4T Akademi`, description: stripHtml(course.description?.slice(0, 150) || "") };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Gerçek veri çekme işlemi
    const dbCourse = await prisma.course.findUnique({
        where: { slug },
        include: {
            variants: true,
            addons: true,
        }
    });

    if (!dbCourse) {
        notFound();
    }

    const dbLearningOutcomes = parseJsonSafe(dbCourse.learningOutcomes, null);
    const finalLearningOutcomes = Array.isArray(dbLearningOutcomes) ? dbLearningOutcomes : [];

    const dbCurriculum = parseJsonSafe(dbCourse.curriculum, null);
    const finalCurriculum = Array.isArray(dbCurriculum) ? dbCurriculum : [];

    const dbInstructor = parseJsonSafe(dbCourse.instructor, []);
    let instructorsList = Array.isArray(dbInstructor) ? dbInstructor : (dbInstructor && typeof dbInstructor === 'object' ? [dbInstructor] : []);
    
    if (instructorsList.length === 0) {
        instructorsList.push({
            name: "4T Kadrosu",
            title: "Uzman Eğitmen",
            image: "",
            rating: 4.8,
            students: dbCourse.studentCount || "10K+",
            bio: "Yılların deneyimi ile sınav formatına en uygun eğitimi sunuyoruz."
        });
    } else {
        instructorsList = instructorsList.map((inst: any) => ({
            name: inst.name || "4T Kadrosu",
            title: inst.title || "Uzman Eğitmen",
            image: inst.image || "",
            rating: 4.8,
            students: dbCourse.studentCount || "10K+",
            bio: inst.bio || "Yılların deneyimi ile sınav formatına en uygun eğitimi sunuyoruz."
        }));
    }
    
    // Client componentin beklediği devasa formata (Adapter) dönüştürme:
    const course = {
        id: dbCourse.id,
        slug: dbCourse.slug,
        title: dbCourse.title,
        subtitle: dbCourse.subtitle || "Türkiye'nin en kapsamlı online hazırlık seti.",
        category: dbCourse.category || "Genel",
        rating: 4.8,
        reviewCount: 154,
        lastUpdated: new Date(dbCourse.updatedAt).toLocaleDateString("tr-TR"),
        language: "Türkçe",
        price: dbCourse.price,
        oldPrice: dbCourse.oldPrice,
        color: dbCourse.color || "#3B82F6",
        
        // Relational Data
        variants: dbCourse.variants.length > 0 ? dbCourse.variants : [{ id: `v-${dbCourse.id}`, title: "Standart Paket", price: dbCourse.price, oldPrice: dbCourse.oldPrice }],
        addons: dbCourse.addons || [],
        
        // Media
        image: dbCourse.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        video: dbCourse.videoUrl || "",
        gallery: parseJsonSafe(dbCourse.gallery, []),
        
        stats: {
            hours: dbCourse.hours || "",
            resources: dbCourse.resources || "",
        },
        description: dbCourse.description || "Kurs detayları yakında eklenecektir.",
        learningOutcomes: finalLearningOutcomes,
        bentoFeatures: parseJsonSafe(dbCourse.bentoFeatures, []),
        features: parseJsonSafe(dbCourse.features, []),
        curriculum: finalCurriculum,
        instructors: instructorsList,
        instructorList: dbCourse.instructorList || null,
        flixUpsellText: dbCourse.flixUpsellText || null,
        flixUpsellLink: dbCourse.flixUpsellLink || null
    };

    return <KursDetailClient course={course} />;
}
