type MetadataItem =
    | { kind: "element"; type: string; props?: Record<string, string> }
    | { kind: "title"; title: string }
    | { kind: "lang"; lang: string };

const title = (title: string): MetadataItem => ({ kind: "title", title });
const lang = (lang: string): MetadataItem => ({ kind: "lang", lang });
const element = (o: Omit<Extract<MetadataItem, { kind: "element" }>, "kind">): MetadataItem => ({
    kind: "element",
    ...o
});

const metadataMap: Map<string, MetadataItem[]> = new Map();

const GLOBAL_METADATA: MetadataItem[] = [
    title("meowpa.ws"),
    lang("en"),
    element({
        type: "meta",
        props: {
            name: "description",
            content:
                "Welcome on personal website of mine, here you will find various information about me, including projects, links to social media and more! I hope you'll stay for longer by following me on other platforms!"
        }
    }),
    element({ type: "meta", props: { name: "theme-color", content: "#000000" } })
] as const;

export function getMetadata(path: string) {
    if (!path.startsWith("/")) throw new Error("Path is invalid. It should start with /");

    const metaArr = [...GLOBAL_METADATA, ...(metadataMap.get(path) ?? [])];
    const title = metaArr?.find(m => m.kind === "title")?.title;
    const lang = metaArr?.find(m => m.kind === "lang")?.lang;
    const elements = new Set(metaArr.filter(m => m.kind === "element").map(({ type, props }) => ({ type, props })));

    return { title, lang, elements };
}
