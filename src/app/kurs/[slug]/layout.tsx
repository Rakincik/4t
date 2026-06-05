export function generateStaticParams() {
  return [
    { slug: "115-donem-kaymakamlik" },
    { slug: "kaymakamlik-soru-kampi" },
    { slug: "kpss-a-premium" },
    { slug: "kpss-a-iktisat-kampi" },
    { slug: "sayistay-soru-kampi" },
    { slug: "guy-hazirlik" },
  ];
}

export default function KursSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
