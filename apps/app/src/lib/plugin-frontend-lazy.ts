/**
 * The boot-path-safe door into `plugin-frontend`.
 *
 * `plugin-frontend` holds the plugin runtime shim (plugin design §5.1): it
 * imports every library a plugin may resolve at runtime — React, the portal
 * Radix families, sonner, vaul, `@pierre/diffs` (and Shiki behind it) — plus
 * `plugin-sdk-app-impl`, which reaches the promptbox editor and the markdown
 * renderer. Statically importing it from `App` put roughly 1.9 MB of
 * JavaScript in front of first paint even when the page had no plugins.
 *
 * Nothing here may import `plugin-frontend` statically. Routes that render
 * plugin management UI are already lazy and import it directly; they share
 * this module instance, so the reconcile state stays single-owner.
 */
type PluginFrontendModule = typeof import("./plugin-frontend");

let modulePromise: Promise<PluginFrontendModule> | null = null;

function loadPluginFrontend(): Promise<PluginFrontendModule> {
  modulePromise ??= import("./plugin-frontend");
  return modulePromise;
}

/** Loads the plugin runtime chunk, then boots the plugin frontends. */
export async function bootPluginFrontends(): Promise<void> {
  const pluginFrontend = await loadPluginFrontend();
  await pluginFrontend.bootPluginFrontends();
}

/**
 * Mirrors `schedulePluginFrontendReconcile`'s own "boot never started, nothing
 * to reconcile" guard. Realtime `plugins-changed` broadcasts arrive on every
 * page, so without this check the first broadcast would pull the runtime chunk
 * back onto the critical path.
 */
export function schedulePluginFrontendReconcile(): void {
  if (modulePromise === null) return;
  void loadPluginFrontend().then((pluginFrontend) => {
    pluginFrontend.schedulePluginFrontendReconcile();
  });
}
