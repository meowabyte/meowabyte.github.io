export type SocialTypes = "youtube" | "github" | "bluesky" | "discordServer";

export type SocialLink = `${"http" | "https"}://${string}`;
export type SocialValueType =
    | SocialLink /* Automatically uses as URL And id as last part of URL path */
    | {
          /** Link that will be used to redirect user on text click */
          url: SocialLink;
          /** Identifier of that URL (used instead of last part of URL path) */
          id: string;
      };

export type Socials = { [x in SocialTypes]: SocialValueType };

export const SOCIAL_TITLES: { [x in SocialTypes]: string } = {
    youtube: "YouTube",
    github: "GitHub",
    bluesky: "Bluesky",
    discordServer: "Discord"
};

export default {
    youtube: "https://youtube.com/@meowabyte",
    github: "https://github.com/meowabyte",
    bluesky: "https://bsky.app/profile/meowpa.ws",
    discordServer: { url: "https://discord.gg/tqssnTUxDR", id: ".gg/tqssnTUxDR" }
} as const satisfies Socials;
