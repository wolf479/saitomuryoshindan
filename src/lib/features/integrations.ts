/**
 * 外部連携の識別子。
 *
 * この版が実際に使うのは Anthropic だけだが、機能カタログ
 * （registry.ts の requires / optional）が本体サービスのツールの前提として
 * 参照するので、一覧はそのまま持っている。キーの値は一切含まない。
 */
export const INTEGRATION_KEYS = [
  "anthropic",
  "openai",
  "gemini",
  "perplexity",
  "serpapi",
  "pagespeed",
  "ga4",
  "supabase",
] as const;

export type IntegrationKey = (typeof INTEGRATION_KEYS)[number];
