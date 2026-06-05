export function generateStaticParams() {
  return [
    { slug: "kaymakamlik-flix" },
    { slug: "adli-hakimlik-flix" },
    { slug: "idari-hakimlik-flix" },
    { slug: "kpss-a-grubu-flix" },
    { slug: "kpss-gygk-flix" },
    { slug: "sayistay-flix" },
    { slug: "icra-mudurlugu-flix" },
    { slug: "kurum-sinavlari-flix" },
  ];
}

export default function FlixSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
