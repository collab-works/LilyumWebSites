const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret, defineString } = require("firebase-functions/params");

const resendApiKey = defineSecret("RESEND_API_KEY");
const mailFrom = defineString("CONTACT_MAIL_FROM");
const recipients = [
  "lilyumbaskiatolyesi@gmail.com",
  "sudekaraca4255@gmail.com",
  "iclall.inall@gmail.com",
];

function field(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

exports.notifyContactMessage = onDocumentCreated(
  {
    document: "contactMessages/{messageId}",
    secrets: [resendApiKey],
    retry: false,
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const name = field(data.name, 200);
    const email = field(data.email, 320);
    const phone = field(data.phone, 100);
    const subject = field(data.subject, 200);
    const message = field(data.message, 10000);
    const text = [
      `Yeni iletişim formu mesajı (${event.params.messageId})`,
      `Ad Soyad: ${name}`,
      `E-posta: ${email}`,
      `Telefon: ${phone || "Belirtilmedi"}`,
      `Konu: ${subject}`,
      "",
      "Mesaj:",
      message,
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey.value()}`,
        "Content-Type": "application/json",
        "Idempotency-Key": event.id,
      },
      body: JSON.stringify({
        from: mailFrom.value(),
        to: recipients,
        subject: `Yeni iletişim mesajı: ${subject || "Konusuz"}`,
        text,
        ...(email && { reply_to: email }),
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Resend gönderimi başarısız (${response.status}): ${details}`);
    }
  }
);
