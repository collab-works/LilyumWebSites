export const SITE_URL = "https://lilyumbaskiatolyesi.com";

export type BrandSettings = {
  logo: string;
  logoMark: string;
  favicon: string;
  email: string;
  instagramLabel: string;
  instagramUrl: string;
};

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logo: "/images/logo.png",
  logoMark: "/images/logo-mark.png",
  favicon: "/favicon.ico",
  email: "info@lilyum.com",
  instagramLabel: "@lilyumbaskiatolyesi",
  instagramUrl: "https://www.instagram.com/lilyumbaskiatolyesi/",
};

export type SeoPageKey = "home" | "urunler" | "atolyeler" | "ozelTasarim" | "iletisim";

export type SeoPageSettings = {
  title: string;
  description: string;
};

export type SeoSettings = {
  siteName: string;
  siteDescription: string;
  ogImage: string;
  pages: Record<SeoPageKey, SeoPageSettings>;
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteName: "Lilyum Baskı Atölyesi",
  siteDescription:
    "Okullar için 3D baskı atölyeleri ve kişiye özel ürünler. Düşle, Tasarla, Şekillendir.",
  ogImage: `${SITE_URL}/images/logo.png`,
  pages: {
    home: {
      title: "Lilyum Baskı Atölyesi",
      description:
        "Okullar için 3D baskı atölyeleri ve kişiye özel ürünler. Düşle, Tasarla, Şekillendir.",
    },
    urunler: {
      title: "Ürünler",
      description:
        "Anahtarlık, rozet, figür ve daha fazlası — 3D baskılı ürün kataloğumuz.",
    },
    atolyeler: {
      title: "Atölyeler",
      description:
        "3D baskı ile desteklenen, çocukların üreterek öğrendiği okul atölyeleri.",
    },
    ozelTasarim: {
      title: "Özel Tasarım",
      description:
        "Doğum günü, okul etkinliği veya marka hediyesi için çocuk-uygun, renkli 3D baskılı ürünler.",
    },
    iletisim: {
      title: "İletişim",
      description: "Okul atölyesi talebi veya özel ürün siparişi için bize ulaşın.",
    },
  },
};

// Backwards-compatible individual exports
export const SITE_NAME = DEFAULT_SEO_SETTINGS.siteName;
export const SITE_DESCRIPTION = DEFAULT_SEO_SETTINGS.siteDescription;
export const DEFAULT_OG_IMAGE = DEFAULT_SEO_SETTINGS.ogImage;
