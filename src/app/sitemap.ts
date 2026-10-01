import type { MetadataRoute } from "next";
import { getPublishedProducts, getPublishedWorkshops } from "@/lib/firestore";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, workshops] = await Promise.all([
    getPublishedProducts(),
    getPublishedWorkshops(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/urunler`, priority: 0.8 },
    { url: `${SITE_URL}/atolyeler`, priority: 0.8 },
    { url: `${SITE_URL}/ozel-tasarim`, priority: 0.6 },
    { url: `${SITE_URL}/iletisim`, priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/urunler/${product.slug}`,
    lastModified: product.updatedAt,
    priority: 0.5,
  }));

  const workshopRoutes: MetadataRoute.Sitemap = workshops.map((workshop) => ({
    url: `${SITE_URL}/atolyeler/${workshop.slug}`,
    lastModified: workshop.updatedAt,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...workshopRoutes];
}
