import { calcOneRepMax } from "./oneRepMax";

describe("oneRepMax", () => {
  it("should return correct one rep max according to formula", () => {
    expect(calcOneRepMax(53, 10)).toBe(70.66666666666667);
  });

  it("should return null if reps >= 37", () => {
    expect(calcOneRepMax(10, 37)).toBe(null);
  });
});
