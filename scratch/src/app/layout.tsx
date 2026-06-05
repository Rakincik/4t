// src/app/layout.tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/app/globals.css";

import { CartProvider } from "@/app/components/cart/cartStore";
import MiniCartDrawer from "@/app/components/cart/MiniCartDrawer";
import Providers from "@/app/providers";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://4takademi.com"),
  title: {
    default: "4T Akademi",
    template: "%s | 4T Akademi",
  },
  description: "Geleceğin Bürokratlarını Yetiştiriyoruz.",
  applicationName: "4T Akademi",
  authors: [{ name: "4T Akademi" }],
  generator: "Next.js",
  keywords: ["4T Akademi", "KPSS", "KPPSA", "B Grubu", "4T Flix", "Online Eğitim"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://4takademi.com",
    siteName: "4T Akademi",
    title: "4T Akademi",
    description: "Geleceğin Bürokratlarını Yetiştiriyoruz.",
  },
  twitter: {
    card: "summary_large_image",
    title: "4T Akademi",
    description: "Geleceğin Bürokratlarını Yetiştiriyoruz.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-screen bg-[var(--c-bg)] text-[var(--c-ink)] antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <Providers>
          <CartProvider>
            {children}
            <MiniCartDrawer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

