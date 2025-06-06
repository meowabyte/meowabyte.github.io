import { BIRTHDATE } from "./utils";

export const EVENT_FLAGS = ["BIRTHDAY", "PRIDE"] as const;
type EventFlagsType = (typeof EVENT_FLAGS)[number];

/** List of flags that can be disabled using boring mode */
export const EVENT_FLAGS_BLACKLIST: EventFlagsType[] = ["BIRTHDAY", "PRIDE"] as const;

export const boringMode = {
    KEY: "boring_mode",
    toggle(value?: boolean) {
        return localStorage.setItem(this.KEY, String(value ?? !this.getState()));
    },
    getState() {
        return localStorage.getItem(this.KEY) === "true";
    }
} as const;

export const eventFlags: EventFlagsType[] = (() => {
    const flags: EventFlagsType[] = [];
    const now = new Date();

    if (now.getMonth() === BIRTHDATE.getMonth() && now.getDate() === BIRTHDATE.getDate()) flags.push("BIRTHDAY");
    if (new Date().getMonth() === 5) flags.push("PRIDE");

    if (boringMode.getState()) return flags.filter(f => !EVENT_FLAGS_BLACKLIST.includes(f));
    return flags;
})();
