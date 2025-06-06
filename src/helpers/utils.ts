export const BIRTHDATE = new Date(2005, 4, 27);
export const age = (() => {
    const diff = Date.now() - BIRTHDATE.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
})();

export const cn = (...classnames: (string | false | undefined)[]) =>
    classnames
        .filter(c => typeof c === "string")
        .join(" ")
        .trim();

export const sleep = async (time: number) => new Promise(r => setTimeout(r, time));

export let isFocused = true;
window.addEventListener("focus", () => (isFocused = true));
window.addEventListener("blur", () => (isFocused = false));
