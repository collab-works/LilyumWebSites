import type { Metadata } from "next";
import Image from "next/image";
import { BrandImage } from "@/components/BrandImage";
import Link from "next/link";
import { ProductCard, WorkshopCard } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getFeaturedWorkshops, getPublishedProducts, getSeoSettings } from "@/lib/firestore";
import { coverImage, formatPrice } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const page = seo.pages.home;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: "/" },
    openGraph: { title: page.title, description: page.description, url: "/" },
  };
}

export default async function HomePage() {
  const [workshops, allProducts] = await Promise.all([
    getFeaturedWorkshops(6),
    getPublishedProducts(),
  ]);
  const products = allProducts.slice(0, 6);

  return (
    <SiteShell>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,184,77,0.35),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(255,107,107,0.28),transparent_32%),linear-gradient(160deg,#FFF8F3_0%,#FFE8D6_45%,#FFF8F3_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(30,58,95,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="container-lilyum relative grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fadeUp">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Baskı Atölyesi
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-6xl lg:text-7xl">
              Lilyum
            </h1>
            <p className="mt-3 font-display text-2xl text-navy/80 sm:text-3xl">
              Düşle, Tasarla, Şekillendir
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg">
              Okullarda öğrenmeyi oyunla birleştiren 3D baskı atölyeleri ve isteğe özel
              ürünler.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/atolyeler" className="btn-primary">
                Atölyeleri İncele
              </Link>
              <Link href="/urunler" className="btn-secondary">
                Ürünlere Bak
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-float lg:max-w-none">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold/30 via-coral/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-soft backdrop-blur-sm sm:p-8">
              <BrandImage />
            </div>
          </div>
        </div>
      </section>

      <section className="container-lilyum py-20">
        <div className="max-w-2xl">
          <h2 className="section-title">Neden Lilyum?</h2>
          <p className="section-lead">
            Çocuklar üretiyor, deniyor, öğreniyor. Biz de her atölyeyi 3D baskı ve oyunla
            somut bir deneyime dönüştürüyoruz.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Okul Atölyeleri",
              text: "Enerji, elektrik, matematik, sanat ve kodlama temalı uygulamalı etkinlikler.",
            },
            {
              title: "3D Üretim",
              text: "Anahtarlık, rozet, figür, plaket ve dekorasyon gibi özel ürünler basıyoruz.",
            },
            {
              title: "Eve Giden Çıktı",
              text: "Her çocuk kendi ürettiği veya boyadığı nesneyi yanında götürür.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-navy/10 bg-white/70 p-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-coral to-gold" />
              <h3 className="font-display text-xl text-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-20 text-cream">
        <div className="container-lilyum">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Atölyeler</h2>
              <p className="mt-3 max-w-xl text-cream/70">
                Okullar için hazırladığımız 3D baskı destekli öğrenme deneyimleri.
              </p>
            </div>
            <Link href="/atolyeler" className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-soft">
              Tümünü Gör
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workshops.map((w) => (
              <WorkshopCard
                key={w.id}
                title={w.title}
                summary={w.summary}
                slug={w.slug}
                ageGroup={w.ageGroup}
                duration={w.duration}
                imageUrl={coverImage(w.images)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-lilyum py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Ürünler</h2>
            <p className="section-lead">
              3D yazıcıyla ürettiğimiz anahtarlık, rozet, figür ve özel ürünler.
            </p>
          </div>
          <Link href="/urunler" className="btn-secondary">
            Kataloğa Git
          </Link>
        </div>
        <div className="mt-10">
          {products.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-navy/20 bg-white/50 px-8 py-14 text-center">
              <p className="font-display text-2xl text-navy">Ürünler yakında</p>
              <p className="mx-auto mt-3 max-w-md text-navy/65">
                3D baskılı ürün kataloğumuz çok yakında burada olacak.
              </p>
              <Link href="/ozel-tasarim" className="btn-primary mt-6">
                Özel Tasarımı İncele
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  title={p.title}
                  description={p.description}
                  slug={p.slug}
                  category={p.category}
                  imageUrl={coverImage(p.images)}
                  priceLabel={formatPrice(p.price)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-lilyum pb-20">
        <div className="overflow-hidden rounded-[2rem] border border-navy/10 bg-[linear-gradient(120deg,#1E3A5F_0%,#2A4A73_45%,#FF6B6B_140%)] p-8 text-cream shadow-soft sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Özel üretim</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
            Anahtarlık, rozet, figür, plaket ve daha fazlası
          </h2>
          <p className="mt-4 max-w-2xl text-cream/75">
            Okul hatırası, doğum günü veya kurumsal hediye için isteğe özel 3D tasarımlar
            üretiyoruz. Minimum sipariş 10 adetten başlar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ozel-tasarim" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-soft">
              Özel Tasarımı İncele
            </Link>
            <Link href="/iletisim" className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream hover:bg-cream/10">
              Teklif İste
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
