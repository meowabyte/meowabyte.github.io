import { useCallback } from "preact/hooks";
import { useMenu } from "../menu";

import { lazy } from "preact-iso";
import type { JSX } from "preact/jsx-runtime";

type PropsLazy =
    | { lazy?: false; element: () => JSX.Element }
    | { lazy: true; element: ReturnType<typeof lazy<() => JSX.Element>> };

type Props = PropsLazy & { children: string; onHover?: () => void };

export default function MenuButton({ children, lazy, element, onHover }: Props) {
    const { showModal } = useMenu();
    const hoverCallback = useCallback(() => {
        if (lazy) element.preload();
        onHover?.();
    }, [lazy, element, onHover]);

    return (
        <span
            onTouchStart={hoverCallback}
            onMouseEnter={hoverCallback}
            onClick={() => showModal(() => element)}
            class="w-32 hover:duration-200 active:duration-100 hover:scale-105 active:scale-95 active:brightness-75"
        >
            {children}
        </span>
    );
}
