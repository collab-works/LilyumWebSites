import Image from "next/image";
import Link from "next/link";
import type { BrandSettings } from "@/lib/site";

export function SiteFooter({ brand }: { brand: BrandSettings }) {
  return (
    <footer className="relative overflow-hidden border-t border-navy/10 bg-navy text-cream">
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-coral/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />

      <div className="container-lilyum grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={brand.logoMark}
              alt="Lilyum"
              width={52}
              height={52}
              className="h-12 w-12 rounded-xl bg-cream/95 object-contain p-1"
            />
            <div>
              <p className="font-display text-xl font-semibold">Lilyum Baskı Atölyesi</p>
              <p className="text-sm text-cream/70">Düşle, Tasarla, Şekillendir</p>
            </div>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/75">
            Okullarda öğrenmeyi oyunla birleştiren 3D baskı atölyeleri ve isteğe özel
            ürünler üretiyoruz.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Keşfet
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-cream/80">
            <Link href="/atolyeler" className="hover:text-white">
              Atölyeler
            </Link>
            <Link href="/urunler" className="hover:text-white">
              Ürünler
            </Link>
            <Link href="/ozel-tasarim" className="hover:text-white">
              Özel Tasarım
            </Link>
            <Link href="/iletisim" className="hover:text-white">
              İletişim
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            İletişim
          </p>
          <div className="mt-4 space-y-2 text-sm text-cream/80">
            <a href={`mailto:${brand.email}`} className="block hover:text-white">{brand.email}</a>
            <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram: ${brand.instagramLabel}`} className="inline-flex items-center gap-2 hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>{brand.instagramLabel}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/55">
        Lilyum Baskı Atölyesi © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
