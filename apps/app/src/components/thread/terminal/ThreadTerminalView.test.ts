import { describe, expect, it, vi } from "vitest";
import { TERMINAL_DATA_MAX_BYTES } from "@bb/domain";
import {
  buildTerminalThemeFromCssColors,
  decodeTerminalOutputBytes,
  encodeTerminalInputChunks,
  TERMINAL_ALLOW_PROPOSED_API,
  TERMINAL_FONT_FAMILY,
  TERMINAL_UNICODE_VERSION,
} from "./ThreadTerminalView";

describe("terminal output encoding", () => {
  it("splits large paste input at the wire limit without losing UTF-8 bytes", () => {
    const input = `${"a".repeat(TERMINAL_DATA_MAX_BYTES - 1)}🙂tail`;
    const chunks = encodeTerminalInputChunks(input);
    const decoded = Buffer.concat(
      chunks.map((chunk) => Buffer.from(chunk, "base64")),
    );

    expect(chunks).toHaveLength(2);
    expect(
      chunks.every(
        (chunk) =>
          Buffer.from(chunk, "base64").byteLength <= TERMINAL_DATA_MAX_BYTES,
      ),
    ).toBe(true);
    expect(decoded.toString("utf8")).toBe(input);
  });

  it("keeps UTF-8 bytes intact when a glyph spans output chunks", () => {
    const encoded = new TextEncoder().encode("🙂");
    const first = decodeTerminalOutputBytes(
      Buffer.from(encoded.subarray(0, 2)).toString("base64"),
    );
    const second = decodeTerminalOutputBytes(
      Buffer.from(encoded.subarray(2)).toString("base64"),
    );
    const decoder = new TextDecoder();

    expect(
      decoder.decode(first, { stream: true }) + decoder.decode(second),
    ).toBe("🙂");
  });

  it("enables the proposed xterm API required by the Unicode addon", () => {
    expect(TERMINAL_ALLOW_PROPOSED_API).toBe(true);
    expect(TERMINAL_UNICODE_VERSION).toBe("11");
  });

  it("prefers installed Nerd Font families before system monospace fallbacks", () => {
    expect(TERMINAL_FONT_FAMILY).toContain("Nerd Font");
    expect(TERMINAL_FONT_FAMILY).toContain("ui-monospace");
  });
});

describe("buildTerminalThemeFromCssColors", () => {
  it("paints the terminal canvas and cursor cutout with the sidebar surface", () => {
    const get = vi.fn((name: string) => name);

    const theme = buildTerminalThemeFromCssColors(get);

    expect(theme.background).toBe("--sidebar");
    expect(theme.cursorAccent).toBe("--sidebar");
  });
});
