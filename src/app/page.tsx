import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge, Card, Container, SectionHeading } from "@/components/ui/layout";
import { buttonClass } from "@/components/ui/button";
import { TempMailApp } from "@/components/temp-mail-app";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} - ${site.tagline}`,
  description: site.description,
};

const features = [
  {
    title: "مجاني تماماً",
    body: "لا تسجيل، لا اشتراك، لا كلفة. أنشئ بريداً مؤقتاً في ثوانٍ واستخدمه فوراً.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "حماية الخصوصية",
    body: "لا تكشف بريدك الحقيقي. استخدم بريداً وهمياً للتسجيل والتحقق ثم تخلَّ عنه.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "تحديث تلقائي",
    body: "يتم فحص الوارد كل 6 ثوانٍ تلقائياً. لا حاجة لتحديث الصفحة.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "قراءة HTML",
    body: "اعرض محتوى الرسائل (بما فيها HTML) في إطار آمن (sandbox) لحماية جهازك.",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "تخصيص الاسم",
    body: "اختر اسم المستخدم الذي تريده بدلاً من العنوان العشوائي.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    title: "حذف وتحكم",
    body: "احذف الرسائل غير المرغوب فيها وأنشئ بريداً جديداً متى شئت.",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  },
] as const;

const steps = [
  {
    title: "أنشئ بريدك",
    body: "اضغط «بريد جديد» أو خصّص اسم المستخدم. سيتم إنشاء عنوان مؤقت فوراً.",
  },
  {
    title: "استخدمه للتسجيل",
    body: "انسخ العنوان واستخدمه في أي موقع يتطلب تحقق بريد إلكتروني.",
  },
  {
    title: "اقرأ الرسائل",
    body: "ستظهر الرسائل الواردة تلقائياً. افتحها لقراءة المحتوى أو حذفها.",
  },
] as const;

const faqs = [
  {
    q: "كم مدة بقاء البريد؟",
    a: "الرسائل تُحذف تلقائياً بعد około ساعة. البريد (الجلسة) يبقى في متصفحك حتى تنشئ بريداً جديداً أو تمسح بيانات المتصفح.",
  },
  {
    q: "هل الخدمة مجانية؟",
    a: "نعم، مجانية تماماً بدون تسجيل. مدعومة بخدمة Guerrilla Mail (CORS مفتوح).",
  },
  {
    q: "هل يمكنني اختيار النطاق (domain)؟",
    a: "النطاق يُحدد تلقائياً من الخدمة (guerrillamailblock.com). يمكنك تخصيص اسم المستخدم فقط.",
  },
  {
    q: "هل الرسائل آمنة؟",
    a: "محتوى الرسائل يُعرض في إطار sandbox (بدون scripts) لحماية جهازك. لا تشارك معلومات حساسة.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden">
          <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="from-brand-200/40 to-accent-400/30 pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br blur-3xl"
            aria-hidden="true"
          />

          <Container className="relative py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <Badge>
                <span className="bg-accent-500 size-2 rounded-full" aria-hidden="true" />
                مجاني · بدون تسجيل · فوري
              </Badge>

              <h1 className="text-foreground mt-6 text-4xl leading-tight font-extrabold text-balance sm:text-5xl lg:text-6xl">
                بريد إلكتروني مؤقت
                <span className="from-brand-600 to-accent-500 block bg-gradient-to-l bg-clip-text text-transparent">
                  في ثوانٍ، مجاناً
                </span>
              </h1>

              <p className="text-muted mx-auto mt-6 max-w-2xl text-lg leading-8">
                أنشئ بريداً إلكترونياً مؤقتاً ووهمياً لتلقي رسائل التحقق والتسجيل دون كشف
                بريدك الحقيقي. بدون تسجيل، بدون كلفة، مع تحديث تلقائي للوارد.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#start" className={buttonClass("primary", "lg")}>
                  ابدأ الآن
                </a>
                <a href="#how" className={buttonClass("secondary", "lg")}>
                  كيف يعمل؟
                </a>
              </div>
            </div>
          </Container>
        </section>

        <TempMailApp />

        <section id="features" className="scroll-mt-24 py-20">
          <Container>
            <SectionHeading
              eyebrow="المميزات"
              title="كل ما تحتاجه في مكان واحد"
              description="خدمة بسيطة وسريعة لحماية خصوصيتك عند التسجيل في المواقع."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-colors hover:border-brand-300">
                  <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 grid size-11 place-items-center rounded-xl">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path
                        d={feature.icon}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="text-foreground mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-7">{feature.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section id="how" className="border-border-subtle scroll-mt-24 border-y py-20">
          <Container>
            <SectionHeading
              eyebrow="كيف يعمل"
              title="ثلاث خطوات بسيطة"
              description="أنشئ، استخدم، اقرأ. كل ذلك في بضع ثوانٍ."
            />

            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <span className="text-brand-600 dark:text-brand-300 text-sm font-extrabold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-foreground mt-3 text-lg font-bold">{step.title}</h3>
                    <p className="text-muted mt-2 text-sm leading-7">{step.body}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="أسئلة شائعة"
              title="لديك أسئلة؟"
              description="إجابات على أكثر الاستفسارات شيوعاً."
            />

            <div className="divide-border-subtle card-surface mt-10 divide-y overflow-hidden">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-6 py-4">
                  <summary className="text-foreground flex cursor-pointer items-center justify-between gap-4 font-semibold">
                    {faq.q}
                    <span className="text-brand-600 transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="text-muted mt-3 text-sm leading-7">{faq.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}