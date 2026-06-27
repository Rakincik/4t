import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                imageUrl: true,
                price: true,
                category: true
            }
        });

        const baseUrl = process.env.NEXTAUTH_URL || "https://4takademi.com";

        // Build RSS 2.0 / Google XML Catalog format
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>4T Akademi Ürün Kataloğu</title>
    <link>${baseUrl}</link>
    <description>4T Akademi Güncel Kurs ve Kamp Kataloğu</description>\n`;

        courses.forEach(course => {
            const id = course.id;
            const title = stripHtml(course.title);
            const desc = stripHtml(course.description || title);
            const link = `${baseUrl}/kurs/${course.slug}`;
            
            // Convert to absolute image URL
            let imageLink = course.imageUrl || "";
            if (imageLink && !imageLink.startsWith("http")) {
                imageLink = `${baseUrl}${imageLink.startsWith("/") ? "" : "/"}${imageLink}`;
            } else if (!imageLink) {
                imageLink = `${baseUrl}/images/placeholder.jpg`; // Fallback image
            }

            const category = course.category || "Online Eğitim";
            const price = `${course.price.toFixed(2)} TRY`;

            xml += `    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${desc}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:brand>4T Akademi</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${price}</g:price>
      <g:product_type><![CDATA[${category}]]></g:product_type>
    </item>\n`;
        });

        xml += `  </channel>
</rss>`;

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59"
            }
        });
    } catch (error) {
        console.error("Facebook catalog feed error:", error);
        return new Response("<error>Katalog olusturulamadi</error>", {
            status: 500,
            headers: { "Content-Type": "application/xml" }
        });
    }
}
