import { hydrate, prerender as ssr } from "preact-iso";
import { App } from "./app";

if (typeof window !== "undefined") hydrate(<App />, document.querySelector("#root")!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prerender(data: any) {
    return await ssr(<App {...data} />)
}