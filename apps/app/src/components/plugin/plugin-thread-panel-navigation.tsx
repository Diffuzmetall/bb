import { createContext, type ReactNode, useContext } from "react";
import type { BbNavigate } from "@bb/plugin-sdk";

export type PluginThreadPanelOpenHandler = (
  options: Parameters<BbNavigate["openThreadPanel"]>[0] & {
    pluginId: string;
  },
) => boolean;

export type PluginFileOpenerOpenHandler = (
  options: Parameters<BbNavigate["experimental_openFileOpener"]>[0],
) => boolean;

interface PluginThreadPanelNavigationValue {
  openFileOpener: PluginFileOpenerOpenHandler;
  openThreadPanel: PluginThreadPanelOpenHandler;
}

const PluginThreadPanelNavigationContext =
  createContext<PluginThreadPanelNavigationValue | null>(null);

export function PluginThreadPanelNavigationProvider({
  children,
  openFileOpener,
  openThreadPanel,
}: {
  children: ReactNode;
  openFileOpener?: PluginFileOpenerOpenHandler;
  openThreadPanel: PluginThreadPanelOpenHandler;
}) {
  return (
    <PluginThreadPanelNavigationContext.Provider
      value={{ openFileOpener: openFileOpener ?? (() => false), openThreadPanel }}
    >
      {children}
    </PluginThreadPanelNavigationContext.Provider>
  );
}

export function usePluginThreadPanelOpenHandler(): PluginThreadPanelOpenHandler | null {
  return useContext(PluginThreadPanelNavigationContext)?.openThreadPanel ?? null;
}

export function usePluginFileOpenerOpenHandler(): PluginFileOpenerOpenHandler | null {
  return useContext(PluginThreadPanelNavigationContext)?.openFileOpener ?? null;
}
