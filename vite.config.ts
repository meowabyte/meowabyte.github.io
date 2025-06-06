import type { UserConfig } from "vite";

import { join } from "path";

// Plugins
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { adapter, analyzer } from "vite-bundle-analyzer";
import cleanUnusedFiles from "./plugins/cleanUnusedFiles";

export default {
    plugins: [
        preact({
            prerender: {
                enabled: true,
                renderTarget: "#root",
                previewMiddlewareEnabled: true,
                previewMiddlewareFallback: "/404",
                prerenderScript: join(import.meta.dirname, "src", "app", "__prerender.tsx")
            }
        }),
        tailwindcss(),
        ViteImageOptimizer({
            webp: { lossless: false, quality: 50, alphaQuality: 90 },
            png: { quality: 70, compressionLevel: 9 },
            jpeg: { quality: 70 },
            jpg: { quality: 70 },
            gif: {},
            includePublic: true
        }),
        cleanUnusedFiles({ files: ["__prerender"] }),
        adapter(analyzer({ enabled: false }))
    ],
    css: { transformer: "lightningcss" },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 600,
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) return "vendor";
                }
            },
            onLog(l, d, handle) {
                // https://github.com/tailwindlabs/tailwindcss/issues/13694
                if (d.code === "SOURCEMAP_BROKEN" && d.plugin === "@tailwindcss/vite:generate:build") return;
                return handle(l, d);
            }
        }
    },
    optimizeDeps: { include: ["lucide-preact", "three", "preact-iso", "preact"] }
} satisfies UserConfig;
