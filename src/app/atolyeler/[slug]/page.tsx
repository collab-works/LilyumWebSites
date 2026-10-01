import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/ImageGallery";
import { PageHero, SiteShell } from "@/components/SiteShell";
import { getAllWorkshopSlugs, getWorkshop } from "@/lib/firestore";
import { parseImages } from "@/lib/utils";

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllWorkshopSlugs();
  // output: "export" requires at least one static path per dynamic route,
  // so fall back to a placeholder that resolves to notFound() below.
  if (slugs.length === 0) return [{ slug: "__yok__" }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) {
    return { title: "Atölye" };
  }
  return {
    title: workshop.title,
    alternates: { canonical: `/atolyeler/${slug}` },
    openGraph: { title: workshop.title, url: `/atolyeler/${slug}` },
  };
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop || !workshop.published) notFound();

  const steps = parseList(workshop.steps);
  const learnings = parseList(workshop.learnings);
  const images = parseImages(workshop.images);

  return (
    <SiteShell>
      <PageHero eyebrow="Atölye" title={workshop.title} lead={workshop.summary} />
      <section className="container-lilyum grid gap-10 py-16 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          {images.length > 0 ? <ImageGallery images={images} alt={workshop.title} /> : null}

          <div>
            <h2 className="font-display text-2xl text-navy">Ne yapıyoruz?</h2>
            <p className="mt-3 leading-relaxed text-navy/70">{workshop.description}</p>
          </div>

          {steps.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl text-navy">Adım adım</h2>
              <ol className="mt-4 space-y-3">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-navy/75">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {learnings.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl text-navy">Çocuk ne öğreniyor?</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {learnings.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-navy/10 bg-white/70 px-4 py-3 text-sm text-navy/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-[1.75rem] border border-navy/10 bg-white/80 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
            Bilgiler
          </p>
          <div className="mt-4 space-y-3 text-sm text-navy/75">
            {workshop.ageGroup ? <p>Yaş grubu: {workshop.ageGroup}</p> : null}
            {workshop.duration ? <p>Süre: {workshop.duration}</p> : null}
            {workshop.output ? <p>Çıktı: {workshop.output}</p> : null}
          </div>
          <Link href="/iletisim" className="btn-primary mt-6 w-full">
            Bu atölyeyi talep et
          </Link>
        </aside>
      </section>
    </SiteShell>
  );
}
