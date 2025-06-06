const CACHE_KEY = "github_cache" as const;
const EXPIRE_TIME = 24 * 60 * 60 * 1000;

export type RepoData = {
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language?: string;
    topics: string[];
};
type ProjectsData = { username: string; lastFetch: number; data: RepoData[] };

export default class GitHubProjects {
    username: string;
    data?: ProjectsData;

    constructor(username: string) {
        this.username = username;

        const cache = localStorage.getItem(CACHE_KEY);
        try {
            if (cache) this.data = JSON.parse(cache);
        } catch (e) {
            console.error("Could not read github projects cache! ", e);
            localStorage.removeItem(CACHE_KEY);
        }
    }

    async fetchData() {
        const r = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100`, {
            headers: { accept: "application/json" }
        });
        if (!r.ok) return;

        const data: RepoData[] = await r.json();

        this.data = { username: this.username, lastFetch: Date.now(), data };

        localStorage.setItem(CACHE_KEY, JSON.stringify(this.data));
        return this.data;
    }

    async getProjects(): Promise<RepoData[]> {
        if (!this.data || this.username !== this.data.username || this.data.lastFetch + EXPIRE_TIME < Date.now())
            await this.fetchData();
        return this.data?.data ?? [];
    }
}
