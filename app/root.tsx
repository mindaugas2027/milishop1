import { appPath } from "@agent-native/core/client/api-path";
import { useDbSync } from "@agent-native/core/client/hooks";
import {
  AppProviders,
  createAgentNativeQueryClient,
} from "@agent-native/core/client/hooks";
import { getThemeInitScript } from "@agent-native/core/client/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { LinksFunction } from "react-router";
import { ClientOnly } from "@agent-native/core/client/ui";

import { Layout as AppLayout } from "@/components/layout/Layout";
import { CookieConsentManager } from "@/components/CookieConsentManager";
import { AppToolkitProvider } from "@/components/ui/toolkit-provider";
import { useNavigationState } from "@/hooks/use-navigation-state";
import { APP_TITLE } from "@/lib/app-config";
import { TAB_ID } from "@/lib/tab-id";

import stylesheet from "./global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const THEME_INIT_SCRIPT = getThemeInitScript();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <meta name="theme-color" content="#18181B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={APP_TITLE} />
        <link rel="icon" type="image/svg+xml" href={appPath("/favicon.svg")} />
        <link rel="apple-touch-icon" href={appPath("/icon-180.svg")} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function DbSyncSetup() {
  const qc = useQueryClient();
  useNavigationState();
  useDbSync({
    queryClient: qc,
    ignoreSource: TAB_ID,
  });
  return null;
}

export default function Root() {
  const [queryClient] = useState(() => createAgentNativeQueryClient());
  const location = useLocation();
  const isPublicPath = location.pathname === "/" || !location.pathname.startsWith("/admin");
  return (
    <AppToolkitProvider>
      <AppProviders queryClient={queryClient} isPublicPath={isPublicPath}>
        <ClientOnly>
          <DbSyncSetup />
        </ClientOnly>
        <AppLayout>
          <Outlet />
        </AppLayout>
        {isPublicPath && <CookieConsentManager />}
      </AppProviders>
    </AppToolkitProvider>
  );
}

export { ErrorBoundary } from "@agent-native/core/client/ui";
