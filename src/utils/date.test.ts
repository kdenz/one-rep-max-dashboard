import { formatDate } from "./date";

describe("formatDate", () => {
  it('should format date into "MM/DD/YY" for full date', () => {
    expect(formatDate(`2019-10-20T00:05:32.000Z`, true)).toBe("10/20/19");
  });

  it('should format date into "MMM D" for default date', () => {
    expect(formatDate(`2019-10-20T00:05:32.000Z`)).toBe("Oct 20");
  });

  it('should return "Invalid Date" for incorrectly formatted dates', () => {
    expect(formatDate(`2019-10-20T00:015:32.000Z`)).toBe("Invalid Date");
    expect(formatDate("")).toBe("Invalid Date");
  });
});
