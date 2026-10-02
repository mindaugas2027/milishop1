import { appBasePath, appPath } from "@agent-native/core/client/api-path";
import { useAgentRouteState } from "@agent-native/core/client/navigation";

import { TAB_ID } from "@/lib/tab-id";

export interface NavigationState {
  view: string;
  path?: string;
  threadId?: string;
  activeCategory?: string;
  activeTab?: string;
}

export function useNavigationState() {
  useAgentRouteState<NavigationState>({
    browserTabId: TAB_ID,
    requestSource: TAB_ID,
    getNavigationState: ({ pathname, searchParams }) => {
      const threadId = threadIdFromPath(pathname);
      const activeCategory = searchParams.get("category");
      const activeTab = searchParams.get("tab");
      return {
        view: viewForPath(pathname),
        path: appPath(pathname),
        ...(threadId ? { threadId } : {}),
        ...(activeCategory ? { activeCategory } : {}),
        ...(activeTab === "orders" ? { activeTab } : {}),
      };
    },
    getCommandPath: (command) =>
      routerPath(command.path || pathForCommand(command)),
  });
}

function threadIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/chat\/([^/]+)/);
  if (!match) return null;
  try {
    const value = decodeURIComponent(match[1]).trim();
    return value || null;
  } catch {
    return null;
  }
}

function viewForPath(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname === "/admin") return "admin";
  if (pathname === "/apie-mus") return "about";
  if (pathname === "/pristatymas") return "delivery";
  if (pathname === "/grazinimas") return "returns";
  return "home";
}

function pathForView(view?: string): string {
  switch (view) {
    case "home":
      return "/";
    case "about":
      return "/apie-mus";
    case "delivery":
      return "/pristatymas";
    case "returns":
      return "/grazinimas";
    default:
      return "/";
  }
}

function pathForCommand(command: any): string {
  const path = pathForView(command?.view);
  if (path !== "/") return path;
  const threadId =
    typeof command?.threadId === "string" ? command.threadId.trim() : "";
  return threadId ? `/chat/${encodeURIComponent(threadId)}` : "/";
}

function routerPath(path: string): string {
  const basePath = appBasePath();
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) {
    return path.slice(basePath.length) || "/";
  }
  return path;
}

