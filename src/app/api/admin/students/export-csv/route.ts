import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export async function GET(req: Request) {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const courseId = searchParams.get("courseId") || "";

    const where: any = { role: "STUDENT" };
    const andConditions: any[] = [];

    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ]
        });
    }

    if (courseId) {
        andConditions.push({
            courseAccess: {
                some: { courseId }
            }
        });
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }

    const students = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { courseAccess: true, orders: true } },
            courseAccess: {
                include: { course: { select: { title: true } } }
            }
        }
    });

    // 2. Generate CSV Content with Semicolon Delimiter for Turkish Excel Compatibility
    const headers = [
        "Ad Soyad",
        "E-posta",
        "Telefon",
        "Kayıt Tarihi",
        "Kurs Sayısı",
        "Erişilen Kurslar",
        "Sipariş Sayısı",
        "TC Kimlik No",
        "Şehir",
        "Açık Adres"
    ];

    const rows = students.map((s) => {
        const formattedDate = new Intl.DateTimeFormat("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date(s.createdAt));

        const coursesList = s.courseAccess
            .map((ca) => stripHtml(ca.course.title))
            .join(", ");

        // Clean values to avoid CSV escaping breaks (remove semi-colons and newlines)
        const clean = (val: string | null) => {
            if (!val) return "";
            return val.replace(/;/g, " ").replace(/\r?\n|\r/g, " ").trim();
        };

        return [
            clean(s.name),
            clean(s.email),
            clean(s.phone),
            clean(formattedDate),
            s._count.courseAccess.toString(),
            `"${clean(coursesList)}"`,
            s._count.orders.toString(),
            clean(s.tcNo),
            clean(s.city),
            `"${clean(s.address)}"`
        ];
    });

    // UTF-8 BOM (\uFEFF) forces Excel to open the CSV in UTF-8 mode
    const csvContent = 
        "\uFEFF" + 
        [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

    const response = new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "attachment; filename=ogrenciler.csv"
        }
    });

    return response;
}
