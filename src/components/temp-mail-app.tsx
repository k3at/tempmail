"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Card, Badge } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";

type Message = {
  mail_id: number;
  mail_from: string;
  mail_subject: string;
  mail_date: string;
  mail_excerpt: string;
  mail_read: number;
};

type FullMessage = Message & {
  mail_body: string;
  mail_recipient?: string;
};

const API = "https://api.guerrillamail.com/ajax.php";
const STORAGE_SID = "tempmail_sid";
const STORAGE_EMAIL = "tempmail_email";

async function api(params: Record<string, string>) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${API}?${qs.toString()}`);
  if (!res.ok) throw new Error("network");
  return res.json();
}

export function TempMailApp() {
  const [sid, setSid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastSeq, setLastSeq] = useState(0);
  const lastSeqRef = useRef(0);
  const [selected, setSelected] = useState<FullMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUser, setCustomUser] = useState("");
  const [editing, setEditing] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    lastSeqRef.current = lastSeq;
  }, [lastSeq]);

  const poll = useCallback(
    async (sidToken: string, seq: number, replace: boolean) => {
      try {
        const data = await api({ f: "check_email", sid_token: sidToken, seq: String(seq) });
        if (data?.auth?.success === false) {
          setError("انتهت الجلسة. جارٍ إنشاء بريد جديد…");
          return;
        }
        const list: Message[] = data?.list ?? [];
        if (replace) {
          setMessages(list);
        } else {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.mail_id));
            const newOnes = list.filter((m) => !ids.has(m.mail_id));
            if (newOnes.length === 0) return prev;
            return [...newOnes, ...prev].sort((a, b) => b.mail_id - a.mail_id);
          });
        }
        if (list.length > 0) {
          const maxId = Math.max(...list.map((m) => m.mail_id));
          setLastSeq((prev) => Math.max(prev, maxId));
        }
        if (data?.email) setEmail(data.email);
      } catch {
        // ignore polling errors
      }
    },
    [],
  );

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const data = await api({ f: "get_email_address" });
      const newSid = data.sid_token as string;
      const newEmail = data.email_addr as string;
      setSid(newSid);
      setEmail(newEmail);
      setMessages([]);
      setLastSeq(0);
      localStorage.setItem(STORAGE_SID, newSid);
      localStorage.setItem(STORAGE_EMAIL, newEmail);
      await poll(newSid, 0, true);
    } catch {
      setError("تعذر الاتصال بخدمة البريد. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [poll]);

  // initial load
  useEffect(() => {
    const storedSid = localStorage.getItem(STORAGE_SID);
    const storedEmail = localStorage.getItem(STORAGE_EMAIL);
    const t = setTimeout(() => {
      if (storedSid) {
        setSid(storedSid);
        if (storedEmail) setEmail(storedEmail);
        (async () => {
          setLoading(true);
          await poll(storedSid, 0, true);
          setLoading(false);
        })();
      } else {
        generate();
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // polling
  useEffect(() => {
    if (!sid) return;
    const id = setInterval(() => {
      poll(sid, lastSeqRef.current, false);
    }, 6000);
    return () => clearInterval(id);
  }, [sid, poll]);

  const newAddress = useCallback(async () => {
    localStorage.removeItem(STORAGE_SID);
    localStorage.removeItem(STORAGE_EMAIL);
    await generate();
  }, [generate]);

  const applyCustom = useCallback(async () => {
    if (!sid || !customUser.trim()) return;
    setEditing(true);
    setError(null);
    try {
      const data = await api({
        f: "set_email_user",
        sid_token: sid,
        email_user: customUser.trim(),
      });
      const newEmail = data.email_addr as string;
      setEmail(newEmail);
      localStorage.setItem(STORAGE_EMAIL, newEmail);
      setMessages([]);
      setLastSeq(0);
      await poll(sid, 0, true);
      setCustomUser("");
    } catch {
      setError("تعذر تغيير اسم المستخدم.");
    } finally {
      setEditing(false);
    }
  }, [sid, customUser, poll]);

  const readMessage = useCallback(
    async (m: Message) => {
      if (!sid) return;
      try {
        const data = (await api({
          f: "fetch_email",
          sid_token: sid,
          email_id: String(m.mail_id),
        })) as FullMessage;
        setSelected(data);
      } catch {
        setError("تعذر فتح الرسالة.");
      }
    },
    [sid],
  );

  const deleteMessage = useCallback(
    async (id: number) => {
      if (!sid) return;
      setDeletingId(id);
      try {
        await api({ f: "del_email", sid_token: sid, email_ids: String(id) });
        setMessages((prev) => prev.filter((m) => m.mail_id !== id));
        if (selected?.mail_id === id) setSelected(null);
      } catch {
        setError("تعذر حذف الرسالة.");
      } finally {
        setDeletingId(null);
      }
    },
    [sid, selected],
  );

  const refresh = useCallback(async () => {
    if (!sid) return;
    setRefreshing(true);
    await poll(sid, 0, true);
    setLastSeq(0);
    setRefreshing(false);
  }, [sid, poll]);

  const copy = useCallback(async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 1500);
    }
  }, [email]);

  return (
    <section id="start" className="py-10 sm:py-14">
      <Container className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-muted text-sm font-medium">بريدك المؤقت</p>
              <p className="text-foreground text-xs">تُحذف الرسائل تلقائياً بعد ساعة تقريباً.</p>
            </div>
            <Badge>
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              نشط
            </Badge>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="bg-surface-raised border-border-subtle flex min-h-14 flex-1 items-center rounded-xl border px-4">
              {loading ? (
                <span className="text-muted text-sm">جارٍ إنشاء البريد…</span>
              ) : (
                <span className="font-mono text-base font-semibold tracking-wide break-all" dir="ltr">
                  {email}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={copy} disabled={!email || loading} variant="secondary" size="md">
                {copyDone ? "تم النسخ ✓" : "نسخ"}
              </Button>
              <Button onClick={newAddress} disabled={loading} size="md">
                بريد جديد
              </Button>
            </div>
          </div>

          <details className="group">
            <summary className="text-muted hover:text-foreground cursor-pointer text-sm font-medium">
              تخصيص اسم المستخدم
            </summary>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={customUser}
                onChange={(e) => setCustomUser(e.target.value)}
                placeholder="اسم_المستخدم"
                className="bg-surface-raised border-border-subtle text-foreground placeholder:text-muted focus:border-brand-500 focus:ring-brand-500/30 flex-1 rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                dir="ltr"
              />
              <Button
                onClick={applyCustom}
                disabled={editing || !customUser.trim()}
                variant="secondary"
                size="md"
              >
                {editing ? "جارٍ…" : "تطبيق"}
              </Button>
            </div>
            <p className="text-muted mt-2 text-xs">
              سيتم إنشاء بريد جديد بنفس الجلسة (الرسائل السابقة قد تُفقد).
            </p>
          </details>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-lg font-bold">الوارد</h2>
              <Badge>{messages.length}</Badge>
            </div>
            <Button onClick={refresh} disabled={refreshing || loading} variant="ghost" size="sm">
              {refreshing ? "جارٍ التحديث…" : "تحديث"}
            </Button>
          </div>

          {messages.length === 0 ? (
            <div className="text-muted flex flex-col items-center gap-2 py-10 text-center text-sm">
              <svg viewBox="0 0 24 24" className="size-10 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 8l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
              <p>لا توجد رسائل بعد. أرسل بريداً إلى العنوان أعلاه وستظهر هنا تلقائياً.</p>
              <p className="text-xs">يتم التحقق كل 6 ثوانٍ.</p>
            </div>
          ) : (
            <ul className="divide-border-subtle divide-y">
              {messages.map((m) => (
                <li key={m.mail_id} className="py-3">
                  <button
                    type="button"
                    onClick={() => readMessage(m)}
                    className="hover:bg-brand-50 dark:hover:bg-white/5 flex w-full items-start gap-3 rounded-lg p-2 text-start transition-colors"
                  >
                    <span className="from-brand-600 to-accent-500 mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-white">
                      {m.mail_from.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-foreground truncate text-sm font-semibold">{m.mail_subject || "(بدون موضوع)"}</p>
                        <span className="text-muted shrink-0 text-xs">{m.mail_date}</span>
                      </div>
                      <p className="text-muted truncate text-xs">{m.mail_from}</p>
                      <p className="text-muted mt-1 line-clamp-2 text-xs">{m.mail_excerpt}</p>
                    </div>
                  </button>
                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteMessage(m.mail_id)}
                      disabled={deletingId === m.mail_id}
                      className="text-muted hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === m.mail_id ? "جارٍ الحذف…" : "حذف"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-surface border-border-subtle flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-border-subtle flex items-start justify-between gap-3 border-b p-4">
                <div className="min-w-0">
                  <h3 className="text-foreground text-base font-bold">
                    {selected.mail_subject || "(بدون موضوع)"}
                  </h3>
                  <p className="text-muted mt-1 text-xs">
                    من: <span dir="ltr">{selected.mail_from}</span>
                  </p>
                  <p className="text-muted text-xs">{selected.mail_date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-muted hover:text-foreground rounded-lg p-1 text-xl leading-none"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <iframe
                  title="محتوى الرسالة"
                  srcDoc={selected.mail_body}
                  sandbox=""
                  className="border-border-subtle h-[50vh] w-full rounded-lg border bg-white"
                />
              </div>
              <div className="border-border-subtle flex justify-end gap-2 border-t p-3">
                <Button
                  onClick={() => deleteMessage(selected.mail_id)}
                  variant="secondary"
                  size="sm"
                >
                  حذف
                </Button>
                <Button onClick={() => setSelected(null)} size="sm">
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}