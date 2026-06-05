import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuthPage = request.nextUrl.pathname.startsWith("/giris");
    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    const isApiRoute = request.nextUrl.pathname.startsWith("/api");

    // API rotaları için middleware uygulanmaz (kendi auth kontrolü var)
    if (isApiRoute) {
        return NextResponse.next();
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

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/giris"],
};
