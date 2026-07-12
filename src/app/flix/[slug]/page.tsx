import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import FlixDetailClient from "./FlixDetailClient";
import { Metadata } from "next";
import { stripHtml } from "@/lib/htmlUtils";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug: slug },
    });

    if (!course || course.type !== "FLIX") {
        return { title: "4T FLIX | Sayfa Bulunamadı" };
    }

    return {
        title: `${stripHtml(course.title)} | 4T FLIX`,
        description: stripHtml(course.description || course.subtitle || "4T FLIX Eğitim Paketi"),
        openGraph: {
            images: course.imageUrl ? [course.imageUrl] : [],
        }
    };
}

export default async function FlixDetailPageServer({ params }: PageProps) {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug: slug, isDeleted: false },
        include: {
            variants: true
        }
    });

    if (!course || course.type !== "FLIX" || !course.isActive) {
        notFound();
    }

    // Arka planda görüntüleme sayısını 1 artırıyoruz
    prisma.course.update({
        where: { id: course.id },
        data: { viewsCount: { increment: 1 } }
    }).catch(err => console.error("Prisma flix views increment error:", err));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        "name": course.title,
                        "description": stripHtml(course.description || course.subtitle || ""),
                        "provider": {
                            "@type": "Organization",
                            "name": "4T Akademi",
                            "sameAs": "https://www.4takademi.com"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": course.price,
                            "priceCurrency": "TRY",
                            "availability": "https://schema.org/InStock",
                            "url": `https://www.4takademi.com/flix/${course.slug}`
                        },
                        "image": course.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80"
                    })
                }}
            />
            <FlixDetailClient key={course.id} course={course} />
        </>
    );
}
