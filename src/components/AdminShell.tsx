"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { logoutAdmin, watchAdminAuth } from "@/lib/auth";

const links = [
  { href: "/lilyum", label: "Özet" },
  { href: "/lilyum/urunler", label: "Ürünler" },
  { href: "/lilyum/atolyeler", label: "Atölyeler" },
  { href: "/lilyum/mesajlar", label: "Mesajlar" },
  { href: "/lilyum/seo", label: "SEO" },
  { href: "/lilyum/gorunum", label: "Görünüm ve iletişim" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = watchAdminAuth((user) => {
      if (!user) {
        router.replace("/lilyum/login");
        return;
      }
      setReady(true);
    });
    return unsubscribe;
  }, [router]);

  async function logout() {
    await logoutAdmin();
    router.push("/lilyum/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-navy/60">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF8F3_0%,#F8EDE3_100%)]">
      <div className="border-b border-navy/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-xl text-navy">Lilyum Admin</p>
            <p className="text-xs text-navy/50">İçerik ve ürün yönetimi</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/collab-works/LilyumWebSites/actions/workflows/deploy.yml"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral-soft"
              title="Değişiklikleri hemen siteye yansıtmak için GitHub Actions'ta 'Run workflow' butonuna basın"
            >
              Değişiklikleri Yayınla
            </a>
            <Link href="/" className="text-sm text-navy/60 hover:text-coral">
              Siteye dön
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-navy/15 px-4 py-2 text-sm text-navy hover:border-coral hover:text-coral"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-navy/10 bg-white/80 p-3">
          <nav className="space-y-1">
            {links.map((link) => {
              const active =
                link.href === "/lilyum"
                  ? pathname === "/lilyum"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-navy text-cream"
                      : "text-navy/70 hover:bg-cream-deep hover:text-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
