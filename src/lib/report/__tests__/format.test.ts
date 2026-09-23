import { describe, expect, it } from "vitest";
import { formatBytes } from "../format";

describe("formatBytes", () => {
  it("picks B / KB / MB by magnitude", () => {
    expect(formatBytes(820)).toBe("820 B");
    expect(formatBytes(9.5 * 1024)).toBe("9.5 KB");
    expect(formatBytes(12.3 * 1024)).toBe("12 KB");
    expect(formatBytes(512 * 1024)).toBe("512 KB");
    expect(formatBytes(1.4 * 1024 * 1024)).toBe("1.4 MB");
  });

  it("returns '-' for values that are not sizes", () => {
    expect(formatBytes(Number.NaN)).toBe("-");
    expect(formatBytes(-1)).toBe("-");
  });
});
