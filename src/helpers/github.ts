import { str as crc } from "crc-32";
import socials from "./data/socials";

const CACHE_VERSION = "2" as const;
const CACHE_KEY = "github_cache" as const;
const CACHE_SEPARATOR = "\x01\x01" as const;
const EXPIRE_TIME = 24 * 60 * 60 * 1000;

const NEEDED_KEYS: Array<keyof RepoData> = [
    "name",
    "description",
    "html_url",
    "stargazers_count",
    "language",
    "topics"
];
export type RepoData = {
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language?: string;
    topics: string[];
};

/** @param toCache Should fetched projects be cached? */
const fetchProjects = async (toCache: boolean): Promise<RepoData[] | null> => {
    const r = await fetch(`https://api.github.com/users/${socials.github.split("/").pop()!}/repos?per_page=100`, {
        headers: { accept: "application/json" }
    });
    if (!r.ok) {
        console.error(`Error when fetching projects! (${r.status} ${r.statusText})\n\n`, await r.text());
        return null;
    }

    try {
        const d: RepoData[] = await r.json();
        const projects = d
            .toSorted(({ stargazers_count: a }, { stargazers_count: b }) => b - a)
            .slice(0, 4)
            .map(p => {
                Object.keys(p)
                    .filter(k => !NEEDED_KEYS.includes(k as keyof typeof p))
                    .forEach(k => delete p[k as keyof typeof p]);
                return p;
            });

        if (toCache) {
            const expires = Date.now() + EXPIRE_TIME,
                cacheData = JSON.stringify(projects),
                cacheChecksum = crc(cacheData);

            const cacheFormatted = [CACHE_VERSION, expires, cacheChecksum, cacheData].join(CACHE_SEPARATOR);
            localStorage.setItem(CACHE_KEY, btoa(cacheFormatted));
        }

        return projects;
    } catch (e) {
        console.error("Error when preparing projects!\n\n", e);
        return null;
    }
};

const invalidateCache = (reason?: string) => {
    if (reason) console.warn(`Cache has been invalidated!\n\nReason:\n${reason}`);
    localStorage.removeItem(CACHE_KEY);
    return null;
};

const getCached = (): RepoData[] | null => {
    const d = localStorage.getItem(CACHE_KEY);
    if (!d) return null;

    try {
        const c = atob(d).split(CACHE_SEPARATOR),
            ver = c.shift() ?? "",
            expires = parseInt(c.shift() ?? "");

        if (ver !== CACHE_VERSION) return invalidateCache("Cache version doesn't match current version");
        if (isNaN(expires) || expires < Date.now())
            return invalidateCache("Cache expiry is invalid or it's out of date");

        const cacheChecksum = parseInt(c.shift() ?? "") ?? 0,
            data = c.shift() ?? "",
            dataChecksum = crc(data);

        if (cacheChecksum !== dataChecksum) return invalidateCache("Safety measure: Cache doesn't match (CRC)");

        return JSON.parse(data);
    } catch (e) {
        console.error("There was an error while checking cache. Invalidating...");
        if (import.meta.env.MODE === "development") console.error(e);

        invalidateCache();
        return null;
    }
};

// When cache has been already checked and loaded, do not check it again and serve loaded one instead
let loadedCache: RepoData[] | null | undefined = undefined;

export default async function getProjects() {
    if (typeof loadedCache !== "undefined") return loadedCache;
    return (loadedCache = getCached() ?? (await fetchProjects(true)));
}
