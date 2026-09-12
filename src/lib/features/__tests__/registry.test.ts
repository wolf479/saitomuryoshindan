/**
 * タブ（SEO / AIO）の定義を固定するテスト。
 * ツールがどのタブにも出ない（category の付け忘れ）と利用者から見えなくなる。
 */
import { describe, expect, it } from "vitest";
import {
  categoryForPath,
  FEATURE_CATEGORIES,
  findCategory,
  groupsForSidebar,
  TOOL_FEATURES,
} from "../registry";

describe("タブの定義", () => {
  it("SEO / AIO の 2 つ", () => {
    expect(FEATURE_CATEGORIES.map((c) => c.id)).toEqual(["seo", "aio"]);
    expect(findCategory("seo").label).toBe("SEO");
  });

  it("MEO（Google マップ・店舗情報）は扱わない", () => {
    expect(FEATURE_CATEGORIES.map((c) => c.id)).not.toContain("meo");
    for (const f of TOOL_FEATURES) {
      expect(f.requires, f.id).not.toContain("places");
      expect(f.optional ?? [], f.id).not.toContain("places");
    }
    expect(TOOL_FEATURES.map((f) => f.id)).not.toContain("maps");
  });

  it("設定・料金以外のツールは必ずどれかのタブに属する", () => {
    for (const f of TOOL_FEATURES) {
      if (f.group === "settings") {
        expect(f.category, f.id).toBeUndefined();
      } else {
        expect(["seo", "aio"], f.id).toContain(f.category);
      }
    }
  });

  it("どのタブも空でなく、共通の機能（設定）はすべてのタブに出る", () => {
    for (const c of FEATURE_CATEGORIES) {
      const { tools } = groupsForSidebar(c.id);
      const ids = tools.flatMap((g) => g.features.map((f) => f.id));
      expect(ids.length, c.id).toBeGreaterThan(2);
      expect(ids).toContain("settings");
      expect(ids).toContain("plans");
      // 他のタブの機能は混ざらない
      for (const g of tools) for (const f of g.features) expect(f.category ?? c.id, f.id).toBe(c.id);
    }
  });

  it("AIO タブに LLMO、SEO タブにサイト診断", () => {
    const ids = (c: "seo" | "aio") => groupsForSidebar(c).tools.flatMap((g) => g.features.map((f) => f.id));
    expect(ids("aio")).toContain("llmo");
    expect(ids("aio")).toContain("page-report");
    expect(ids("aio")).not.toContain("site-audit");
    expect(ids("seo")).toContain("site-audit");
    expect(ids("seo")).toContain("rank");
  });

  it("パスからタブを引く。共通の画面と無料診断は null", () => {
    expect(categoryForPath("/tools/llmo")).toBe("aio");
    expect(categoryForPath("/tools/site-audit")).toBe("seo");
    expect(categoryForPath("/tools/site-audit/")).toBe("seo");
    expect(categoryForPath("/settings")).toBeNull();
    expect(categoryForPath("/")).toBeNull();
    expect(categoryForPath("/nowhere")).toBeNull();
  });

  it("category を渡さなければ従来どおり全グループ", () => {
    const all = groupsForSidebar().tools.flatMap((g) => g.features.map((f) => f.id));
    expect(all).toEqual(TOOL_FEATURES.map((f) => f.id));
  });
});
