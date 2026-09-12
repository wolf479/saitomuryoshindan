"use client";

/**
 * 診断フォーム（no-print）。レポートのシートとは独立したブロックとして上に置く。
 * ヘッダー 1 カラムのレイアウトなので、ここが実質のヒーロー（最初に読む面）になる。
 * 範囲切替は segmented な 2 ボタン（role="radio"）。
 */
import type { FormEvent } from "react";
import { Button, Field, Input } from "@/components/ui";
import { BRAND } from "@/lib/brand";

export type Mode = "page" | "site";

const OPTIONS: { value: Mode; label: string; hint: string }[] = [
  { value: "page", label: "このページ", hint: "入力した URL 1 ページだけを診断します" },
  {
    value: "site",
    label: "サイト全体（全ページ）",
    hint: "sitemap と内部リンクから全ページを収集して診断します",
  },
];

/** 「何が返ってくるか」を先に示す 3 点。入力前の不安を減らすためのもの */
const PROMISES = ["総合スコアと A〜E グレード", "項目ごとの判定と改善提案", "報告書を PDF でダウンロード"];

export function DiagnosisForm({
  url,
  onUrlChange,
  mode,
  onModeChange,
  onSubmit,
  busy,
  error,
}: {
  url: string;
  onUrlChange: (value: string) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onSubmit: (e: FormEvent) => void;
  busy: boolean;
  error?: string | null;
}) {
  return (
    <section className="no-print mb-8">
      <div className="pt-8 pb-6 text-center sm:pt-12">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight text-ink sm:text-[34px]">
          サイトの健康状態を、
          <wbr />
          <span className="whitespace-nowrap text-accent">1 分で</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
          {BRAND.description}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-2 text-[12px] font-bold text-muted">
          {PROMISES.map((p) => (
            <li key={p} className="rounded-full border border-line bg-panel px-3 py-1">
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm sm:p-6">
        <form onSubmit={onSubmit} noValidate>
          <Field label="診断する URL" htmlFor="url" error={error}>
            <Input
              id="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com/"
              value={url}
              invalid={Boolean(error)}
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </Field>

          <div role="radiogroup" aria-label="診断の範囲" className="mt-3 grid gap-2 sm:grid-cols-2">
            {OPTIONS.map((opt) => {
              const selected = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onModeChange(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    selected
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line bg-panel text-ink hover:bg-surface"
                  }`}
                >
                  <span className="block text-[13px] font-bold">{opt.label}</span>
                  <span className={`mt-0.5 block text-[11px] leading-relaxed ${selected ? "text-accent" : "text-muted"}`}>
                    {opt.hint}
                  </span>
                </button>
              );
            })}
          </div>

          <Button type="submit" size="lg" loading={busy} className="mt-4 w-full">
            無料で診断する
          </Button>
        </form>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
          採点はルールベース（生成 AI 不使用）のため無料です。想定 FAQ の生成だけ AI を使います。
        </p>
      </div>

    </section>
  );
}
