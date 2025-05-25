import type { ComponentChildren } from "preact";

import { cn } from "../helpers/utils";
import { useMenu } from "./menu";
import { useCallback, useRef } from "preact/hooks";


export default function Modal({ children }: { children: ComponentChildren }) {
    const { showModal, isModalSet } = useMenu()
    const backdropRef = useRef<HTMLDivElement>(null)

    const onClose = useCallback((e: MouseEvent) => e.target === backdropRef.current && showModal(null), [backdropRef])

    return <div
        ref={backdropRef}
        onClickCapture={onClose}
        class={cn(
            "fixed w-full h-full backdrop-blur-xs backdrop-brightness-50 transition duration-150",
            !isModalSet && "pointer-events-none opacity-0 scale-90"
        )}
    >
        {children}
    </div>
}