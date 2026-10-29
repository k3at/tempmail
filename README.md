# بريد مؤقت — TempMail

موقع مجاني لتوليد بريد إلكتروني مؤقت ووهمي لتلقي رسائل التحقق والتسجيل دون كشف بريدك الحقيقي.

- **رابط الموقع:** https://tempmail-static.alssamer.workers.dev
- **المستودع:** https://github.com/k3at/tempmail

## المميزات
- توليد بريد مؤقت فوري بدون تسجيل
- صندوق وارد بتحديث تلقائي (كل 6 ثوانٍ)
- قراءة الرسائل (بما فيها HTML) في إطار آمن (sandbox)
- نسخ العنوان، حذف الرسائل، تخصيص اسم المستخدم
- وضع داكن/فاتح
- واجهة عربية RTL

## التشغيل محلياً
```bash
pnpm install
pnpm dev
```
ثم افتح http://localhost:3000

## الاختبارات
```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

## النشر
- **Cloudflare Workers (ثابت):** `pnpm cf:static`
- **GitHub Pages:** `pnpm build:static <repo-name>`

## التقنية
Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript. خدمة البريد: Guerrilla Mail API.

## الترخيص
MIT
