import { afterEach, describe, expect, it, vi } from "vitest";
import { createTimeline } from "./timeline";

describe("createTimeline", () => {
  it("normalises phase durations to 0-1 ranges that tile the whole timeline", () => {
    const t = createTimeline([
      { id: "a", duration: 1 },
      { id: "b", duration: 3 },
    ]);
    expect(t.totalDuration).toBe(4);
    expect(t.getPhase("a")).toEqual([0, 0.25]);
    expect(t.getPhase("b")).toEqual([0.25, 1]);
  });

  it("never leaves a gap or overlap between neighbouring phases", () => {
    const t = createTimeline([
      { id: "a", duration: 0.5 },
      { id: "b", duration: 2 },
      { id: "c", duration: 1.5 },
    ]);
    expect(t.getPhase("a")[1]).toBeCloseTo(t.getPhase("b")[0]);
    expect(t.getPhase("b")[1]).toBeCloseTo(t.getPhase("c")[0]);
    expect(t.getPhase("c")[1]).toBeCloseTo(1);
  });

  describe("unknown phases", () => {
    afterEach(() => vi.restoreAllMocks());

    it("falls back to an empty range and warns instead of throwing", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const t = createTimeline([{ id: "a", duration: 1 }]);
      expect(t.getPhase("missing")).toEqual([0, 0]);
      expect(warn).toHaveBeenCalledOnce();
    });
  });
});
