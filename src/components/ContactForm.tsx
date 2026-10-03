"use client";

import { FormEvent, useState } from "react";
import { createMessage } from "@/lib/firestore";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || "") || null,
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      await createMessage(payload);
      setStatus("ok");
      formElement.reset();
    } catch (err) {
      console.error("İletişim formu gönderilemedi:", err);
      setStatus("error");
      setError("Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[1.75rem] border border-navy/10 bg-white/80 p-6 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad" name="name" required />
        <Field label="E-posta" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon" name="phone" />
        <Field label="Konu" name="subject" required placeholder="Okul atölyesi / özel ürün" />
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-navy/80">Mesaj</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-2xl border border-navy/15 bg-cream/60 px-4 py-3 text-sm outline-none transition focus:border-coral focus:bg-white"
          placeholder="Okulunuz, yaş grubu, tarih veya ürün talebinizi yazın..."
        />
      </label>
      <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-60">
        {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
      </button>
      {status === "ok" ? (
        <p className="text-sm font-medium text-navy">Mesajınız alındı. En kısa sürede dönüş yapacağız.</p>
      ) : null}
      {status === "error" ? <p className="text-sm font-medium text-coral-deep">{error}</p> : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-navy/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-navy/15 bg-cream/60 px-4 py-3 text-sm outline-none transition focus:border-coral focus:bg-white"
      />
    </label>
  );
}
