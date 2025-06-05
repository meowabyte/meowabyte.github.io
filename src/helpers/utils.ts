const BIRTHDATE = new Date(2005, 4, 27);
export const age = (() => {
    const diff = Date.now() - BIRTHDATE.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
})();

export const EVENT_FLAGS = ["BIRTHDAY", "PRIDE"] as const;
type EventFlagsType = (typeof EVENT_FLAGS)[number];

export const eventFlags: EventFlagsType[] = (() => {
    const flags: EventFlagsType[] = [];
    const now = new Date();

    if (now.getMonth() === BIRTHDATE.getMonth() && now.getDate() === BIRTHDATE.getDate()) flags.push("BIRTHDAY");
    if (new Date().getMonth() === 5) flags.push("PRIDE");

    return flags;
})();

export const cn = (...classnames: (string | false | undefined)[]) =>
    classnames
        .filter(c => typeof c === "string")
        .join(" ")
        .trim();

export const sleep = async (time: number) => new Promise(r => setTimeout(r, time));
