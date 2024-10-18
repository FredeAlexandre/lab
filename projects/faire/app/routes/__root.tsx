import { createRootRoute } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import type * as React from "react";

// @ts-ignore
import globals from "@/styles/globals.css?url";

import { ThemeProvider } from "@/components/ui/theme";
import { seo } from "@/lib/seo";

export const Route = createRootRoute({
	meta: () => [
		{
			charSet: "utf-8",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1",
		},
		...seo({
			title: "Faire - A Reminder App cross-platform",
			description:
				"Faire is a reminder app that works on all platforms. It's simple, fast, and easy to use.",
		}),
	],
	links: () => [{ rel: "stylesheet", href: globals }],
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<ThemeProvider>
				<Outlet />
			</ThemeProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				{children}
				<ScrollRestoration />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</Body>
		</Html>
	);
}
