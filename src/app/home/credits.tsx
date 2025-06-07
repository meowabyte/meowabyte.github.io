import type { JSX } from "preact";
import { lazy } from "preact-iso";
import { useMemo, useRef, useState, useEffect } from "preact/hooks";
import type { HomeScreenProps } from "../home";
import credits from "../../credits.txt?raw";

const BeachBG = lazy(() => import("../../components/bg/beach"));

const HEADER_REGEX = /(^=+ .* =+$)/i;
const LINK_REGEX = /(\w+\.(?:org|dev|ws|com))/i;
const CREDITS_SPEED = 25 as const;

export function Credits({ screenIndex, setScreenIndex }: HomeScreenProps) {
    const creditsParts = useMemo(
        () =>
            credits
                .split(new RegExp(`${LINK_REGEX.source}|${HEADER_REGEX.source}`, "im"))
                .filter(p => p)
                .reduce<Array<JSX.Element | string>>((arr, s) => {
                    if (HEADER_REGEX.test(s)) arr.push(<b>{s}</b>);
                    else if (LINK_REGEX.test(s))
                        arr.push(
                            <a target="_blank" title={s} href={`https://${s}`}>
                                {s}
                            </a>
                        );
                    else arr.push(s);

                    return arr;
                }, []),
        []
    );

    const creditsRef = useRef<HTMLSpanElement>(null);
    const [creditsHeight, setCreditsHeight] = useState<number>(0);

    // Credits height calculation
    useEffect(() => {
        if (!creditsRef.current) return;

        const recalcHeight = () => {
            const size = creditsRef.current!.getBoundingClientRect();
            setCreditsHeight(size.height);
        };
        recalcHeight();

        creditsRef.current.addEventListener("resize", recalcHeight);
        return () => {
            creditsRef.current?.removeEventListener("resize", recalcHeight);
        };
    }, [creditsRef, screenIndex]);

    const creditsScrollSpeed = useMemo(() => (creditsHeight / CREDITS_SPEED).toFixed(1), [creditsHeight]);

    return (
        <div>
            <button
                class="z-10 absolute left-1/2 -translate-x-1/2 top-4 text-sm text-secondary"
                onClick={() => setScreenIndex(0)}
            >
                ^ Go back ^
            </button>
            <div class="absolute right-1/4 top-0 h-[37%] overflow-hidden w-1/3 max-md:w-1/2 flex justify-center">
                {screenIndex === 1 && (
                    <span
                        ref={creditsRef}
                        class="h-max whitespace-pre-wrap leading-10 text-center animate-[credits-scroll_var(--credits-scroll-speed)_linear_infinite]"
                        style={{
                            "--credits-height": `${creditsHeight}px`,
                            "--credits-scroll-speed": `${creditsScrollSpeed}s`
                        }}
                    >
                        {creditsParts}
                    </span>
                )}
            </div>
            <BeachBG />
        </div>
    );
}
