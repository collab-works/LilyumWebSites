"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getBrandSettings } from "@/lib/firestore";
import { DEFAULT_BRAND_SETTINGS } from "@/lib/site";

export function BrandImage() {
  const [logo, setLogo] = useState(DEFAULT_BRAND_SETTINGS.logo);
  useEffect(() => { getBrandSettings().then((brand) => setLogo(brand.logo)).catch(() => {}); }, []);
  return <Image src={logo} alt="Lilyum Baskı Atölyesi logosu" width={900} height={900} priority className="h-auto w-full object-contain" />;
}
