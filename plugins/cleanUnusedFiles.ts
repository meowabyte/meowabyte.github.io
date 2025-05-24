import type { Plugin } from "vite"

import { existsSync, unlinkSync } from "fs";
import { join } from "path";

type PluginOptions = {
    /**
     * List of files to remove.
     * Only file name without extension. (unless it's css)
     */
    files: string[],
}

// @ts-ignore
export default function cleanUnusedFiles({ files }: PluginOptions): Plugin {
    let outPath!: string;
    const toRemove: string[] = []

    return {
        name: "cleanUnusedFiles",
        apply: "build",
        config(c) {
            outPath = join(import.meta.dirname, "..", c.build?.outDir ?? "dist")
        },
        generateBundle(_, b) {
            Object.keys(b)
                .forEach(k => {
                    const originalName = b[k].name?.toLowerCase()
                    if (originalName && files.includes(originalName)) toRemove.push(k)
                })
        },
        writeBundle(_, b) {
            Object.entries(b)
                .forEach(([ chunkId, { name, type } ]) => {
                    const originalName = name?.toLowerCase()

                    if (originalName && files.includes(originalName)) {
                        const path = join(outPath, chunkId)

                        unlinkSync(path)
                        if (type === "chunk" && existsSync(`${path}.map`))
                            unlinkSync(`${path}.map`) // Remove file's sourcemap if exists
                    }
                })
            
        },
    }
}