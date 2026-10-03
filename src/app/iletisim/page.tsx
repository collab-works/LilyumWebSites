import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactLinks } from "@/components/ContactLinks";
import { PageHero, SiteShell } from "@/components/SiteShell";
import { getSeoSettings } from "@/lib/firestore";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const page = seo.pages.iletisim;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/iletisim" },
    openGraph: { title: page.title, description: page.description, url: "/iletisim" },
  };
}

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Bize ulaşın"
        title="İletişim"
        lead="Okul atölyesi talebi veya özel ürün siparişi için formu doldurun."
      />
      <section className="container-lilyum grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-navy/10 bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Lilyum
            </p>
            <h2 className="mt-3 font-display text-2xl text-navy">Hızlı iletişim</h2>
            <div className="mt-5 space-y-2 text-sm text-navy/70">
              <ContactLinks />
              <p>Okul atölyesi veya özel ürün için formu doldurmanız yeterli.</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
