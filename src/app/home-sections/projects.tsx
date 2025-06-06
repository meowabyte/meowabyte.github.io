import { HardDrive, Link2, StarIcon } from "lucide-preact";
import ModalBody from "../../components/modal/modalbody";
import { SOCIALS } from "./social";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import type { RepoData } from "../../helpers/github";
import GitHubProjects from "../../helpers/github";

const MAX_TOPICS_VISIBLE = 2 as const;

const languageColors = new Map([
    ["CSS", "#663399"],
    ["HTML", "#e34c26"],
    ["JavaScript", "#f1e05a"],
    ["Rust", "#dea584"],
    ["TypeScript", "#3178c6"]
]);

function Project({ repo: { name, description, language, html_url, stargazers_count, topics } }: { repo: RepoData }) {
    const visitRepo = useCallback(() => window.open(html_url), []);
    const topicsToShow = useMemo(() => {
        const t = topics.slice(0, MAX_TOPICS_VISIBLE);
        if (topics.length > MAX_TOPICS_VISIBLE) t.push(`+${topics.length - MAX_TOPICS_VISIBLE}`);
        return t;
    }, [topics]);

    return (
        <div
            onClick={visitRepo}
            className="flex flex-col gap-1 min-w-52 border-2 border-foreground p-2 text-xs select-none cursor-pointer duration-100 hover:scale-105 active:scale-95"
        >
            <div className="flex flex-row justify-between">
                <span className="font-bold">
                    <HardDrive size="1.3em" className="inline" /> {name}
                </span>
                <Link2 size="1.3em" />
            </div>
            <span className="min-h-12 line-clamp-3">{description}</span>
            <div className="flex flex-row gap-1 *:border-[1px] *:p-1 *:h-max *:w-max text-[0.60rem]">
                {topicsToShow.map((t, i) => (
                    <span key={`topic-${i}`}>{t}</span>
                ))}
            </div>
            <div className="flex flex-row justify-between *:flex *:flex-row *:gap-1 *:items-center">
                <span>
                    <div
                        style={{ "--language-color": languageColors.get(language ?? "") ?? "#fff" }}
                        className="bg-[var(--language-color)] w-[1em] h-[1em] rounded-sm"
                    />{" "}
                    {language ?? "-"}
                </span>
                <span>
                    <StarIcon size="1.3em" className="inline" /> ±{stargazers_count}
                </span>
            </div>
        </div>
    );
}

function ProjectsList() {
    const [projects, setProjects] = useState<RepoData[] | null>(null);

    useEffect(() => {
        (async () => {
            const gh = new GitHubProjects(SOCIALS.github! as string);
            setProjects(await gh.getProjects());
        })();
    }, []);

    const projectsToShow = useMemo(
        () => (projects ?? []).toSorted(({ stargazers_count: a }, { stargazers_count: b }) => b - a).slice(0, 4),
        [projects]
    );

    if (!projects) return <div class="text-center">Loading...</div>;
    return (
        <div className="grid lg:grid-cols-2 max-lg:grid-cols-1 gap-5 max-lg:overflow-y-auto p-3">
            {projectsToShow.map((r, i) => (
                <Project repo={r} key={`featuredrepo-${i}`} />
            ))}
        </div>
    );
}

export default function Projects() {
    return (
        <ModalBody className="flex flex-col gap-3 max-sm:w-4/5">
            <h2 className="text-center">My popular projects!</h2>
            <ProjectsList />
            <a class="text-center" target="_blank" href="https://github.com/meowabyte?tab=repositories">
                See more projects!
            </a>
        </ModalBody>
    );
}
