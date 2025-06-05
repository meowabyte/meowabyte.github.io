if (typeof window !== "undefined") throw new Error("PLEASE DO NOT IMPORT THIS OUTSIDE OF SERVER");

import { prerender as ssr } from "preact-iso";
import { App } from "./app";
import { getMetadata } from "../helpers/prerender/metadata";

const REQUIRED_PRERENDERS = ["/", "/404"] as const;

// WORKAROUND: Using pageCount to prevent "Prerendering" message showing up in the same line as "Rendering chunk"
let pageCount = 0;
export async function prerender(data: {
    ssr: boolean;
    url: string;
    route: { url: string; _discoveredBy?: { url: string } };
}) {
    const head = getMetadata(data.route.url);

    console.log(`${pageCount++ === 0 ? "\nPrerendering page...\n" : ""} -> ${data.route.url} "${head.title}"`);
    const { html, links: discovered = [] } = await ssr(<App />);

    return { html, data, head, links: new Set([...discovered, ...REQUIRED_PRERENDERS]) };
}
