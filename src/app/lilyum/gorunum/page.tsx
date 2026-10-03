"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { BrandForm } from "@/components/admin/BrandForm";
import { getBrandSettings } from "@/lib/firestore";
import type { BrandSettings } from "@/lib/site";

export default function AppearancePage() {
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getBrandSettings().then(setSettings).catch(() => setError("Ayarlar yüklenemedi."));
  }, []);
  return <AdminShell>
    <h1 className="font-display text-3xl text-navy">Görünüm ve iletişim</h1>
    <p className="mt-2 text-navy/60">Logo, favicon ve iletişim bağlantılarını yönetin.</p>
    {settings ? <BrandForm initial={settings} /> : <p className="mt-6 text-navy/60">{error || "Yükleniyor..."}</p>}
  </AdminShell>;
}
