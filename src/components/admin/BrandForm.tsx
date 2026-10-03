"use client";

import { FormEvent, useState } from "react";
import { updateBrandSettings } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import type { BrandSettings } from "@/lib/site";

const imageFields = [
  { key: "logo", label: "Ana sayfa logosu" },
  { key: "logoMark", label: "Üst ve alt bölüm logosu" },
  { key: "favicon", label: "Favicon (PNG, ICO veya SVG)" },
] as const;

export function BrandForm({ initial }: { initial: BrandSettings }) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function upload(key: typeof imageFields[number]["key"], file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "image/x-icon") {
      setError("Görsel dosyası seçin.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setValue((current) => ({ ...current, [key]: url }));
      setSaved(false);
    } catch {
      setError("Görsel yüklenemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const instagramUrl = new URL(value.instagramUrl);
      if (!["https:", "http:"].includes(instagramUrl.protocol)) throw new Error("Instagram bağlantısı geçersiz.");
      await updateBrandSettings({
        ...value,
        email: value.email.trim(),
        instagramLabel: value.instagramLabel.trim(),
        instagramUrl: instagramUrl.toString(),
      });
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ayarlar kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-6 rounded-3xl border border-navy/10 bg-white/80 p-6">
      {imageFields.map(({ key, label }) => (
        <label key={key} className="block space-y-2">
          <span className="block text-sm font-medium text-navy">{label}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value[key]} alt={label} className="h-24 w-24 rounded-xl border border-navy/10 object-contain" />
          <input type="file" accept="image/*,.ico" disabled={busy} onChange={(event) => { void upload(key, event.target.files?.[0]); event.target.value = ""; }} className="block text-sm" />
        </label>
      ))}
      <label className="block space-y-2">
        <span className="block text-sm font-medium text-navy">Footer e-posta adresi</span>
        <input type="email" required value={value.email} onChange={(event) => setValue({ ...value, email: event.target.value })} className="w-full rounded-2xl border border-navy/15 px-4 py-3 text-sm" />
      </label>
      <label className="block space-y-2">
        <span className="block text-sm font-medium text-navy">Instagram görünen adı</span>
        <input required value={value.instagramLabel} onChange={(event) => setValue({ ...value, instagramLabel: event.target.value })} className="w-full rounded-2xl border border-navy/15 px-4 py-3 text-sm" />
      </label>
      <label className="block space-y-2">
        <span className="block text-sm font-medium text-navy">Instagram bağlantısı</span>
        <input type="url" required value={value.instagramUrl} onChange={(event) => setValue({ ...value, instagramUrl: event.target.value })} className="w-full rounded-2xl border border-navy/15 px-4 py-3 text-sm" />
      </label>
      {error && <p className="text-sm text-coral-deep">{error}</p>}
      {saved && <p className="text-sm text-navy">Kaydedildi. Siteyi yenileyince görünür.</p>}
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "İşleniyor..." : "Kaydet"}</button>
    </form>
  );
}
