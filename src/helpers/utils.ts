export const calculateAge = (birthDate: Date): number => {
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const cn = (...classnames: (string | undefined)[]) => classnames.filter(c => c).join(" ").trim()

export const sleep = async (time: number) => new Promise(r => setTimeout(r, time))