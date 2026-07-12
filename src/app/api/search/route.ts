import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Turkish text normalization for fuzzy matching
function normalizeText(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .trim()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

// Levenshtein Distance calculation
function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ results: [], suggestion: null });
    }

    const trLower = query.toLocaleLowerCase("tr-TR");
    const enLower = query.toLowerCase();

    // Query database with case-insensitive contains for Turkish lower and English lower variations
    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { title: { contains: trLower, mode: "insensitive" } },
          { title: { contains: enLower, mode: "insensitive" } },
          { subtitle: { contains: query, mode: "insensitive" } },
          { subtitle: { contains: trLower, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        price: true,
        oldPrice: true,
        imageUrl: true,
        category: true,
        badge: true,
      },
      take: 8,
    });

    let suggestion = null;

    // If no direct results are found, find a smart suggestion (Did you mean... / Bunu mu demek istediniz?)
    if (courses.length === 0 && query.trim().length >= 3) {
      const allActiveCourses = await prisma.course.findMany({
        where: {
          isActive: true,
          isDeleted: false,
        },
        select: {
          title: true,
          slug: true,
          type: true,
        },
      });

      const normalizedQuery = normalizeText(query);
      let bestMatch = null;
      let minDistance = 999;

      for (const course of allActiveCourses) {
        const normalizedTitle = normalizeText(course.title);
        
        // 1. Direct Levenshtein distance on full normalized strings
        const fullDistance = getLevenshteinDistance(normalizedQuery, normalizedTitle);
        if (fullDistance < minDistance) {
          minDistance = fullDistance;
          bestMatch = course;
        }

        // 2. Token-based Levenshtein distance (checking individual words for spelling typos)
        const titleWords = normalizedTitle.split(/\s+/);
        for (const word of titleWords) {
          if (word.length >= 3) {
            const wordDistance = getLevenshteinDistance(normalizedQuery, word);
            if (wordDistance < minDistance) {
              minDistance = wordDistance;
              bestMatch = course;
            }
          }
        }
      }

      // Define thresholds based on query length to keep suggestions relevant
      const queryLength = normalizedQuery.length;
      let maxAllowedDistance = 2;
      if (queryLength <= 4) {
        maxAllowedDistance = 1;
      } else if (queryLength >= 8) {
        maxAllowedDistance = 3;
      }

      if (bestMatch && minDistance <= maxAllowedDistance) {
        suggestion = {
          title: bestMatch.title,
          slug: bestMatch.slug,
          type: bestMatch.type,
        };
      }
    }

    return NextResponse.json({ results: courses, suggestion });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
