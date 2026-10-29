export const site = {
  name: "بريد مؤقت",
  nameEn: "TempMail",
  tagline: "بريد إلكتروني مؤقت ومجاني في ثوانٍ",
  description:
    "أنشئ بريداً إلكترونياً مؤقتاً ووهمياً مجاناً لتلقي رسائل التحقق والتسجيل دون كشف بريدك الحقيقي. بدون تسجيل، بدون كلفة.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "بريد مؤقت",
  nav: [
    { label: "كيف يعمل", href: "#how" },
    { label: "المميزات", href: "#features" },
    { label: "الأسئلة", href: "#faq" },
  ],
  links: {
    github: "https://github.com",
    docs: "https://nextjs.org/docs",
  },
} as const;

export type Site = typeof site;