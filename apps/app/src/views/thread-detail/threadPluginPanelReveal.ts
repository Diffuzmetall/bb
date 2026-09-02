/**
 * After a plugin thread panel is opened, reveal it on compact viewports and
 * optionally collapse the conversation so the panel becomes the thread's
 * primary surface (Ghostex-style chat ↔ terminal).
 */
export function revealOpenedThreadPluginPanel({
  experimental_primarySurface,
  openCompactDrawer,
  setConversationCollapsed,
}: {
  experimental_primarySurface?: boolean;
  openCompactDrawer: () => void;
  setConversationCollapsed: (collapsed: boolean) => void;
}): void {
  openCompactDrawer();
  if (experimental_primarySurface === true) {
    setConversationCollapsed(true);
  }
}
