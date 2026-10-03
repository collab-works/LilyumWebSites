"use client";

import { useEffect, useState } from "react";
import { getBrandSettings } from "@/lib/firestore";
import { DEFAULT_BRAND_SETTINGS } from "@/lib/site";

export function ContactLinks() {
  const [brand, setBrand] = useState(DEFAULT_BRAND_SETTINGS);
  useEffect(() => { getBrandSettings().then(setBrand).catch(() => {}); }, []);
  return <>
    <a className="block hover:text-coral" href={`mailto:${brand.email}`}>E-posta: {brand.email}</a>
    <a className="block hover:text-coral" href={brand.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram: {brand.instagramLabel}</a>
  </>;
}
