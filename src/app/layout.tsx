// src/app/layout.tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";

import { CartProvider } from "@/app/components/cart/cartStore";
import MiniCartDrawer from "@/app/components/cart/MiniCartDrawer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import FloatingCartButton from "@/app/components/cart/FloatingCartButton";
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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-8B8NTNZDWH";
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || "xl2hf495wq";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;

  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <head>
        {/* Google Analytics (GA4) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${clarityId}");
            `}
          </Script>
        )}

        {/* Meta Pixel */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className={`${outfit.className} min-h-screen bg-[var(--c-bg)] text-[var(--c-ink)] antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <Providers>
          <CartProvider>
            {children}
            <MiniCartDrawer />
            <WhatsAppButton />
            <FloatingCartButton />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

