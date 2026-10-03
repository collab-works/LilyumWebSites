import Image from "next/image";
import Link from "next/link";
import type { BrandSettings } from "@/lib/site";

const links = [
  { href: "/atolyeler", label: "Atölyeler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/ozel-tasarim", label: "Özel Tasarım" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteHeader({ brand }: { brand: BrandSettings }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-lilyum flex items-center justify-between gap-4 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={brand.logoMark}
            alt="Lilyum"
            width={48}
            height={48}
            className="h-11 w-11 object-contain transition group-hover:scale-105"
            priority
          />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-wide text-navy">
              Lilyum
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-coral">
              Baskı Atölyesi
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/75 transition hover:text-coral"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/atolyeler"
            className="rounded-full px-3 py-2 text-xs font-medium text-navy/70 md:hidden"
          >
            Atölyeler
          </Link>
          <Link href="/iletisim" className="btn-primary !py-2.5 !text-xs sm:!text-sm">
            Atölye Talep Et
          </Link>
        </div>
      </div>
    </header>
  );
}
