import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names in order", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves tailwind conflicts to the last class", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("ignores falsy conditional values", () => {
    expect(cn(false && "hidden", undefined, null, "block")).toBe("block");
  });
});
