import { useCallback, useMemo } from "preact/hooks";
import ModalBody from "../../components/modal/modalbody";

const LINKS = new Map([
    ["youtube", "youtube.com"],
    ["github", "github.com"],
    ["bluesky", "bsky.app/profile"],
    ["discordServer", "discord.gg"],
    ["telegram", "t.me"],
    ["keybase", "keybase.io"]
]);

const typeToReadable = (type: string) =>
    type.replace(/^[a-z]/, c => c.toUpperCase()).replace(/([a-z])([A-Z])/g, "$1 $2");

const formatEntry = (type: string, ...data: string[]): { text: string; onClick: (() => void) | string } => {
    switch (type) {
        case "discord":
            return { text: data[0], onClick: `https://discord.com/users/${data[1]}` };
        case "email":
            return { text: data[0], onClick: `mailto:${data[0]}` };
    }

    const link = LINKS.get(type);
    return {
        text: data[0],
        onClick:
            link ?
                `https://${link}/${data[0]}`
            :   () => {
                    navigator.clipboard.writeText(data[0]);
                    alert("Copied!");
                }
    };
};

export const SOCIALS: Record<string, string | string[]> = {
    youtube: "@meowabyte",
    github: "meowabyte",
    bluesky: "meowpa.ws",
    discordServer: "tqssnTUxDR"
};

const CONTACT: Record<string, string | string[]> = {
    email: "purr@meowpa.ws",
    discord: [".kb.", "105170831130234880"],
    telegram: "meowabyte",
    keybase: "meowabyte",
    signal: "meowabyte.01"
};

function SocialLink({ data: [type, data] }: { data: [string, string | string[]] }) {
    const { text, onClick } = formatEntry(type, ...(Array.isArray(data) ? data : [data]));
    const handleClick = useCallback(() => {
        if (typeof onClick === "string") return window.open(onClick, "_blank");
        onClick();
    }, []);
    const readableType = useMemo(() => typeToReadable(type), []);

    return (
        <div>
            <span className="font-bold text-left select-none">{readableType}</span>
            <span
                role="button"
                title={`${typeof onClick === "string" ? "Visit" : "Check out"} ${readableType}`}
                onClick={handleClick}
                className="text-right select-text"
            >
                {text}
            </span>
        </div>
    );
}

export default function Social() {
    return (
        <ModalBody className="grid max-lg:grid-rows-2 lg:grid-cols-2 max-sm:w-4/5 lg:justify-between gap-10 *:[&>h2]:text-center *:[&>h2]:mb-5 *:*:*:grid *:*:*:grid-cols-2 *:*:*:content-between">
            <div>
                <h2 class="select-none">Socials</h2>
                <div>
                    {Object.entries(SOCIALS).map((s, i) => (
                        <SocialLink data={s} key={`social-entry-${i}`} />
                    ))}
                </div>
            </div>
            <div>
                <h2 class="select-none">Contact</h2>
                <div>
                    {Object.entries(CONTACT).map((c, i) => (
                        <SocialLink data={c} key={`contact-entry-${i}`} />
                    ))}
                </div>
            </div>
        </ModalBody>
    );
}
