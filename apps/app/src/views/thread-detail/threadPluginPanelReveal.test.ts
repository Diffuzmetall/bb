import { describe, expect, it, vi } from "vitest";
import { revealOpenedThreadPluginPanel } from "./threadPluginPanelReveal";

describe("revealOpenedThreadPluginPanel", () => {
  it("opens the compact drawer without collapsing chat by default", () => {
    const openCompactDrawer = vi.fn();
    const setConversationCollapsed = vi.fn();

    revealOpenedThreadPluginPanel({
      openCompactDrawer,
      setConversationCollapsed,
    });

    expect(openCompactDrawer).toHaveBeenCalledTimes(1);
    expect(setConversationCollapsed).not.toHaveBeenCalled();
  });

  it("collapses the conversation when the panel requests the primary surface", () => {
    const openCompactDrawer = vi.fn();
    const setConversationCollapsed = vi.fn();

    revealOpenedThreadPluginPanel({
      experimental_primarySurface: true,
      openCompactDrawer,
      setConversationCollapsed,
    });

    expect(openCompactDrawer).toHaveBeenCalledTimes(1);
    expect(setConversationCollapsed).toHaveBeenCalledWith(true);
  });
});
