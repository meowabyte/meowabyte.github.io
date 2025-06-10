import { useCallback } from "preact/hooks";
import ModalBody from "../../components/modal/modalbody";
import socials, { SOCIAL_TITLES, type SocialTypes, type SocialValueType } from "../../helpers/data/socials";
import type { ContactMethods, ContactType, ContactValueType } from "../../helpers/data/contact";
import contact, { CONTACT_TITLES } from "../../helpers/data/contact";

type SocialEntryAction = "copy" | "redirect";
const SOCIAL_ENTRY_TITLE = { copy: "Copy {} to clipboard!", redirect: "Visit {}!" } as const satisfies {
    [x in SocialEntryAction]: string;
};

type SocialEntryProps = { title: string; text: string; value: string; action: SocialEntryAction };
function SocialEntry({ title, text, value, action }: SocialEntryProps) {
    const handleClick = useCallback(() => {
        switch (action) {
            case "copy":
                navigator.clipboard.writeText(value);
                alert("Copied!");
                break;
            case "redirect":
                window.open(value, "_blank");
                break;
        }
    }, [value, action]);

    return (
        <div>
            <span className="font-bold text-left select-none">{title}</span>
            <span
                role="button"
                title={SOCIAL_ENTRY_TITLE[action].replaceAll("{}", text)}
                onClick={handleClick}
                className="text-right select-text"
            >
                {text}
            </span>
        </div>
    );
}

const urlToReadable = (url: string) => new URL(url).pathname.split("/").pop()!;

const socialToEntry = (t: SocialTypes, d: SocialValueType): SocialEntryProps => {
    const title = SOCIAL_TITLES[t];

    if (typeof d === "string") return { title, value: d, text: urlToReadable(d), action: "redirect" };

    return { title, value: d.url, action: "redirect", text: d.id };
};
function Socials() {
    return (
        <div>
            {Object.entries(socials).map(([type, data]) => {
                const props = socialToEntry(type as SocialTypes, data);
                return <SocialEntry key={`social-${type}`} {...props} />;
            })}
        </div>
    );
}

const contactTypeToAction = (type: ContactType): SocialEntryAction => (type === "url" ? "redirect" : "copy");
const contactToEntry = (t: ContactMethods, d: ContactValueType): SocialEntryProps => {
    const title = CONTACT_TITLES[t];

    if (typeof d === "string") {
        const type: ContactType = URL.canParse(d) ? "url" : "username";

        return { title, value: d, text: type === "url" ? urlToReadable(d) : d, action: contactTypeToAction(type) };
    }

    return {
        title,
        value: d.value,
        text: d.id ?? (d.type === "url" ? urlToReadable(d.value) : d.value),
        action: contactTypeToAction(d.type)
    };
};

function Contacts() {
    return (
        <div>
            {Object.entries(contact).map(([type, data]) => {
                const props = contactToEntry(type as ContactMethods, data);
                return <SocialEntry key={`contact-${type}`} {...props} />;
            })}
        </div>
    );
}

export default function Social() {
    return (
        <ModalBody className="grid max-lg:grid-rows-2 lg:grid-cols-2 max-sm:w-4/5 lg:justify-between gap-10 *:[&>h2]:text-center *:[&>h2]:mb-5 *:*:*:grid *:*:*:grid-cols-2 *:*:*:content-between">
            <div>
                <h2 class="select-none">Socials</h2>
                <Socials />
            </div>
            <div>
                <h2 class="select-none">Contact</h2>
                <Contacts />
            </div>
        </ModalBody>
    );
}
