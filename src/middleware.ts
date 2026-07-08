import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    // OpenLiteSpeed proxy'sinin gönderdiği yinelenen (çift) header değerlerini temizle
    const host = request.headers.get("x-forwarded-host");
    if (host && host.includes(",")) {
        request.headers.set("x-forwarded-host", host.split(",")[0].trim());
    }
    const proto = request.headers.get("x-forwarded-proto");
    if (proto && proto.includes(",")) {
        request.headers.set("x-forwarded-proto", proto.split(",")[0].trim());
    }

    const token = await getToken({ req: request });
    const isAuthPage = request.nextUrl.pathname.startsWith("/giris");
    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    const isApiRoute = request.nextUrl.pathname.startsWith("/api");

    // API rotaları için middleware uygulanmaz (kendi auth kontrolü var)
    if (isApiRoute) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    // Giriş yapmış kullanıcı giriş sayfasına gitmeye çalışırsa
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Admin sayfasına erişim kontrolü
    if (isAdminPage) {
        if (!token) {
            return NextResponse.redirect(new URL("/giris", request.url));
        }

        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}

export const config = {
    matcher: ["/admin/:path*", "/giris"],
};
