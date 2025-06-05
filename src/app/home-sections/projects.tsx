import { HardDrive, Link2, StarIcon } from "lucide-preact";
import ModalBody from "../../components/modal/modalbody";
import { SOCIALS } from "./social";
import { useCallback } from "preact/hooks";

type RepoData = { name: string; description: string; stars: number; language: string };

const FEATURED_REPOS: RepoData[] = [
    {
        name: "VencordPlugins",
        description: 'My plugins made for the cutest Discord client mod called "Vencord"',
        language: "TypeScript",
        stars: 20
    },
    {
        name: "gif-validator",
        description: "Clean your favorite Discord GIFs from dead and broken links with this simple utility tool!",
        language: "TypeScript",
        stars: 4
    },
    {
        name: "gm-runtime-browser",
        description: "Website for browsing through huge list of runners for GameMaker engine",
        language: "TypeScript",
        stars: 1
    },
    {
        name: "meowabyte",
        description: "My Github's README + animation generating script",
        language: "TypeScript",
        stars: 1
    }
] as const;

const languageColors = new Map([
    ["CSS", "#663399"],
    ["HTML", "#e34c26"],
    ["JavaScript", "#f1e05a"],
    ["Rust", "#dea584"],
    ["TypeScript", "#3178c6"]
]);

function Project({ repo: { name, description, stars, language } }: { repo: RepoData }) {
    const visitRepo = useCallback(() => window.open(`https://github.com/${SOCIALS.github}/${name}`), []);

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
            <span className="min-h-12">{description}</span>
            <div className="flex flex-row justify-between *:flex *:flex-row *:gap-1 *:items-center">
                <span>
                    <div
                        style={{ "--language-color": languageColors.get(language) ?? "#fff" }}
                        className="bg-[var(--language-color)] w-[1em] h-[1em] rounded-sm"
                    />{" "}
                    {language}
                </span>
                <span>
                    <StarIcon size="1.3em" className="inline" /> ±{stars}
                </span>
            </div>
        </div>
    );
}

function ProjectsList() {
    return (
        <div className="grid lg:grid-cols-2 max-lg:grid-cols-1 gap-5 max-lg:overflow-y-auto p-3">
            {FEATURED_REPOS.map((r, i) => (
                <Project repo={r} key={`featuredrepo-${i}`} />
            ))}
        </div>
    );
}

export default function Projects() {
    return (
        <ModalBody className="flex flex-col gap-3 max-sm:w-4/5">
            <h2 className="text-center">My featured projects!</h2>
            <ProjectsList />
        </ModalBody>
    );
}
