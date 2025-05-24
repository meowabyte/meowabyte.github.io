import type { JSX } from "preact/jsx-runtime"

import style from "../styles/menu.module.css"

import { cn, sleep } from "../helpers/utils"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import Silly from "./menu/silly"
import { Suspense } from "preact/compat"


type Props = {
    buttons: ({ text: string, body: () => JSX.Element })[]
}

export default function Menu({ buttons }: Props) {
    const [isBlinking, setBlinking] = useState(true)
    const [showButtons, setShowButtons] = useState(false)
    const [selectedButton, setSelectedButton] = useState<number | null>(null)
    const ref = useRef<HTMLSpanElement>(null)

    const closeModal = useCallback((e: MouseEvent) => {
        if (e.currentTarget === e.target) setActiveButton(null)
    }, [])

    const setActiveButton = useCallback((choice: number | null) => {
        if (choice && (choice > buttons.length || choice < 0)) return;
        setSelectedButton(choice)
    }, [])

    const startTyping = useCallback(async (text: string, delay: number = 30) => {
        if (!ref.current) return;

        const wasBlinking = isBlinking
        setBlinking(false)

        ref.current.textContent = ""
        for (const c of text.split("")) {
            ref.current.textContent += c
            await sleep(delay)
        }

        setBlinking(wasBlinking)
    }, [ref, isBlinking])

    useEffect(() => {
        (async () => {
            await sleep(500)
            await startTyping(`Welcome to meowpa.ws`)
            await sleep(200)
            setShowButtons(true)
        })()
    }, [])

    return <>
    <div className="select-none fixed left-1/2 top-1/2 -translate-1/2 text-center h-1/2 w-5/6 flex flex-col place-items-center *:absolute">
        <span ref={ref} className={cn("text-3xl", isBlinking ? style["blink"] : "")}></span>
        <div className={cn("transition-all duration-300 ease-in-out", showButtons ? "max-sm:translate-y-25 sm:translate-y-15" : "opacity-0 select-none pointer-events-none")}>
            <div className="flex flex-row gap-10 *:w-1/2 items-center *:cursor-pointer *:transition-transform *:hover:scale-105 *:active:scale-95">
                {buttons.map(({ text }, i) => <span onClick={() => setActiveButton(i)} key={`menu-button-${i}`}>{text}</span> )}
            </div>
            <div className={cn("transition-all delay-500 duration-300 ease-in-out place-items-center", showButtons ? "translate-y-10" : "opacity-0 select-none pointer-events-none")}>
                <Silly />
            </div>
        </div>
    </div>

    {/* Menu bodies */}
    <div onClick={closeModal} className={cn("fixed w-screen h-screen backdrop-blur-sm transition-all duration-200", selectedButton === null ? "opacity-0 pointer-events-none select-none scale-75" : "opacity-100")}>
        {buttons.map(({ body: Btn }, i) => selectedButton === i ? <Suspense fallback><Btn key={`modal-data-${i}`} /></Suspense> : null )}
    </div>
    </>
}