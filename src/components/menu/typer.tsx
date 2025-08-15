import { useEffect, useRef, useState } from "preact/hooks";
import { cn, sleep } from "../../helpers/utils";
import type { RefObject } from "preact/compat";

const TYPER_DELAY = 30 as const;

type Props = {
    text: string;
    className?: string;
    onFinish?: () => void;
    isPaused?: boolean;
    innerRef?: RefObject<HTMLSpanElement>;
};
export default function Typer({ text, className, onFinish, isPaused, innerRef }: Props) {
    const [isBlinking, setBlinking] = useState(true);
    const ref = innerRef ?? useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (isPaused) return;
        if (text === ref.current.textContent) return;

        const addToText = async (str: string, clear: boolean = false) => {
            if (clear) await goBackText();

            setBlinking(false);
            for (const char of str) {
                ref.current!.textContent += char;
                await sleep(TYPER_DELAY);
            }
            setBlinking(true);
        };

        const goBackText = async () => {
            setBlinking(false);
            while (text === ref.current!.textContent || ref.current!.textContent.length === 0) {
                ref.current!.textContent = ref.current!.textContent.slice(1);
                await sleep(TYPER_DELAY);
            }
            setBlinking(true);
        };

        const animate = async () => {
            if (ref.current!.textContent.length === 0) return addToText(text, ref.current!.textContent.length > 0);
            if (text.length < ref.current!.textContent.length && ref.current!.textContent.startsWith(text))
                return addToText(text.slice(ref.current!.textContent.length));
            if (text.length > ref.current!.textContent.length && text.includes(ref.current!.textContent))
                return goBackText();
            return addToText(text, true);
        };

        animate().then(() => onFinish?.());
    }, [ref, text, isPaused]);

    return (
        <span
            ref={ref}
            className={cn(
                className,
                'after:content-["▊"] after:ml-1',
                isBlinking && "after:animate-[blink_0.5s_alternate_infinite]"
            )}
        ></span>
    );
}
