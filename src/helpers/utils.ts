export const cn = (...classnames: (string | false | undefined)[]) => classnames.filter(c => typeof c === "string").join(" ").trim()

export const sleep = async (time: number) => new Promise(r => setTimeout(r, time))