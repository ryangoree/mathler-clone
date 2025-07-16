import { formatAddress } from "src/ui/base/utils/formatAddress";
import { describe, expect, it } from "vitest";

describe("formatAddress", () => {
  it("formats a wallet address correctly", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678";
    const formatted = formatAddress(address);
    expect(formatted).toBe("0x123…5678");
  });

  it("Returns short addresses as-is", () => {
    const address = "0x1234";
    const formatted = formatAddress(address);
    expect(formatted).toBe("0x1234");
  });
});
