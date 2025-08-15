import { lazy } from "preact-iso";
import { useState, useRef, useCallback, useEffect, useMemo } from "preact/hooks";
import Menu, { MenuProvider } from "../../components/menu";
import MenuButton from "../../components/menu/menubutton";
import SillyRenderer from "../../components/silly";
import { boringMode, EVENT_FLAGS_BLACKLIST, eventFlags } from "../../helpers/events";
import { cn, sleep } from "../../helpers/utils";
import type { HomeScreenProps } from "../home";
import Typer from "../../components/menu/typer";
import socials from "../../helpers/data/socials";

const MatrixBG = lazy(() => import("../../components/bg/matrix"));

const TITLE_TEXT = (() => {
    if (eventFlags.includes("BIRTHDAY")) return "Happy Birhday Kuba!";
    if (eventFlags.includes("PRIDE")) return "Happy Pride Month!";
    return "Welcome to meowpa.ws!";
})();

const GLITCH_CHARACTERS = ["@", "#", "/", "\\", "&", "%"] as const;

function CodebergNotification() {
    const [aknowledged, setAknowledged] = useState(false);

    if (aknowledged) return;
    return (
        <span class="fixed w-screen bg-yellow-400 text-black text-center text-xs px-3 py-1 not-hover:opacity-20">
            All projects are slowly being migrated to <a href={socials.codeberg}>Codeberg</a>! Sorry for possible
            outages!
            <span
                onClick={() => setAknowledged(true)}
                role="button"
                class="absolute right-3 font-bold top-1/2 -translate-y-1/2"
            >
                X
            </span>
        </span>
    );
}

export function Home({ setScreenIndex }: HomeScreenProps) {
    const [animationState, setAnimationState] = useState(0);
    const titleRef = useRef<HTMLSpanElement>(null);

    const nextAnimationState = useCallback(() => setAnimationState(v => v + 1), []);

    // Intro
    useEffect(() => {
        const showOtherComponents = async () => {
            for (let i = 0; i < 3; i++) await sleep(400).then(() => setAnimationState(s => s + 1));
        };

        switch (animationState) {
            case 0:
                sleep(800).then(() => nextAnimationState());
                break;
            case 2:
                showOtherComponents();
                break;
        }
    }, [animationState]);

    // Title glitch effect
    useEffect(() => {
        if (animationState < 4 || !titleRef.current) return;

        console.log(titleRef);
        const validChars = titleRef.current!.textContent!.split("").reduce<number[]>((arr, c, i) => {
            if (c !== " ") arr.push(i);
            return arr;
        }, []);

        const i = setInterval(async () => {
            const charIndex = validChars[Math.floor(Math.random() * validChars.length)];
            const replChar = GLITCH_CHARACTERS[Math.floor(Math.random() * GLITCH_CHARACTERS.length)];

            const oldTitle = titleRef.current!.textContent!;
            const newTitle = oldTitle.slice(0, charIndex) + replChar + oldTitle.slice(charIndex + 1);

            titleRef.current!.textContent! = newTitle;
            await sleep(100).then(() => (titleRef.current!.textContent! = oldTitle));
        }, 1500);

        return () => {
            clearInterval(i);
        };
    }, [animationState, titleRef]);

    const animationSlide = useCallback(
        (id: number) => cn("transition duration-200", animationState < id && "opacity-0 -translate-y-5"),
        [animationState]
    );

    const boringModeState = useMemo(() => boringMode.getState(), []);
    const toggleBoringMode = useCallback(() => {
        boringMode.toggle();
        location.reload();
    }, []);

    return (
        <div>
            {animationState >= 3 && (
                <>
                    <CodebergNotification />
                    {(boringModeState || EVENT_FLAGS_BLACKLIST.some(f => eventFlags.includes(f))) && (
                        <button
                            class="absolute left-1/2 -translate-x-1/2 top-4 text-sm text-secondary"
                            onClick={toggleBoringMode}
                        >
                            [ Boring Mode - {boringModeState ? "ON" : "OFF"} ]
                        </button>
                    )}
                </>
            )}

            <MenuProvider>
                <div class="select-none absolute left-1/2 top-1/2 -translate-1/2 text-center h-1/2 w-5/6 flex flex-col items-center">
                    <Typer
                        className="text-3xl"
                        text={TITLE_TEXT}
                        isPaused={animationState < 1}
                        onFinish={() => animationState === 1 && nextAnimationState()}
                        innerRef={titleRef}
                    />

                    <Menu className={animationSlide(2)}>
                        <MenuButton lazy element={lazy(() => import("../home-sections/aboutme"))}>
                            About Me
                        </MenuButton>
                        <MenuButton lazy element={lazy(() => import("../home-sections/projects"))}>
                            My Projects
                        </MenuButton>
                        <MenuButton lazy element={lazy(() => import("../home-sections/social"))}>
                            My Social Media
                        </MenuButton>
                    </Menu>

                    <SillyRenderer className={animationSlide(3)} height={250} width={250} />
                </div>
            </MenuProvider>
            {animationState >= 4 && (
                <>
                    <button
                        class="absolute left-1/2 -translate-x-1/2 bottom-4 text-sm text-secondary"
                        onClick={() => setScreenIndex(1)}
                    >
                        v Go to credits v
                    </button>
                    <MatrixBG className="brightness-90" />
                </>
            )}
        </div>
    );
}
