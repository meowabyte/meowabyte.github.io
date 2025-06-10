export type ContactMethods = "email" | "discord" | "telegram" | "keybase" | "signal";
export type ContactType = "url" | "username";
export type ContactValueType =
    | string /* Automatically determines type by this value */
    | {
          /**
           * Type of the contact method.
           *
           * **How types are handled on click:**
           * `url` - Redirects user to the provided in `value` link.
           * `username` - Copies `value` to user's clipboard.
           */
          type: ContactType;
          /**
           * Value of that contact method.
           * Look at `type` description to see how value is handled with different types.
           */
          value: string;
          /** Identifier of that URL (used instead of last part of URL path) */
          id?: string;
      };

export type Contact = { [x in ContactMethods]: ContactValueType };

export const CONTACT_TITLES: { [x in ContactMethods]: string } = {
    discord: "Discord",
    email: "E-Mail",
    keybase: "Keybase",
    signal: "Signal",
    telegram: "Telegram"
};

export default {
    email: { type: "url", value: "mailto:purr@meowpa.ws", id: "purr@meowpa.ws" },
    discord: { type: "url", value: "https://discord.com/users/105170831130234880", id: ".kb." },
    telegram: "https://t.me/meowabyte",
    keybase: "https://keybase.io/meowabyte",
    signal: "meowabyte.01"
} as const satisfies Contact;
