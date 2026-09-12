/**
 * 機能カタログの整合性テスト。
 * この版に画面があるのは無料診断だけで、カタログはサービス資料の PDF
 * （ServiceGuide）を組み立てるためのデータ。崩れると資料の中身が壊れる。
 */
import { describe, expect, it } from "vitest";
import { FEATURE_GROUPS, FREE_FEATURE, type Feature } from "../registry";

const features: Feature[] = FEATURE_GROUPS.flatMap((g) => [...g.features]);

describe("機能カタログ", () => {
  it("id とパスが重複しない", () => {
    expect(new Set(features.map((f) => f.id)).size).toBe(features.length);
    expect(new Set(features.map((f) => f.path)).size).toBe(features.length);
  });

  it("どの機能もラベル・説明・できることを持つ", () => {
    for (const f of features) {
      expect(f.label, f.id).not.toBe("");
      expect(f.shortLabel, f.id).not.toBe("");
      expect(f.description, f.id).not.toBe("");
      expect(f.details.length, f.id).toBeGreaterThan(0);
    }
  });

  it("無料診断のグループは無料診断 1 本だけ", () => {
    const free = FEATURE_GROUPS.find((g) => g.id === "free");
    expect(free?.features).toEqual([FREE_FEATURE]);
    expect(FREE_FEATURE.path).toBe("/");
  });

  it("MEO（Google マップ・店舗情報）は扱わない", () => {
    expect(features.map((f) => f.id)).not.toContain("maps");
    for (const f of features) {
      expect(f.requires, f.id).not.toContain("places");
      expect(f.optional ?? [], f.id).not.toContain("places");
    }
  });

  it("どのグループも空でない", () => {
    for (const g of FEATURE_GROUPS) expect(g.features.length, g.id).toBeGreaterThan(0);
  });
});
