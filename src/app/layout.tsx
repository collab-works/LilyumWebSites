import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsInit } from "@/components/AnalyticsInit";
import { JsonLd } from "@/components/JsonLd";
import { getSeoSettings } from "@/lib/firestore";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.siteName,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.siteDescription,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: seo.siteName,
      title: seo.siteName,
      description: seo.siteDescription,
      url: SITE_URL,
      images: [{ url: seo.ogImage, width: 900, height: 900, alt: seo.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteName,
      description: seo.siteDescription,
      images: [seo.ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeoSettings();

  return (
    <html lang="tr">
      <body className="font-sans antialiased">
        <AnalyticsInit />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: seo.siteName,
            url: SITE_URL,
            logo: seo.ogImage,
            description: seo.siteDescription,
          }}
        />
        {children}
      </body>
    </html>
  );
}
