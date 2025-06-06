import "../styles/main.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn, sleep } from "../helpers/utils";
import Menu, { MenuProvider } from "../components/menu";
import MenuButton from "../components/menu/menubutton";
import SillyRenderer from "../components/silly";
import { lazy } from "preact-iso";
import { boringMode, EVENT_FLAGS_BLACKLIST, eventFlags } from "../helpers/events";

const MatrixBG = lazy(() => import("../components/bg/matrix"));

const TITLE_TEXT = (() => {
    if (eventFlags.includes("BIRTHDAY")) return "Happy Birhday Kuba!";
    if (eventFlags.includes("PRIDE")) return "Happy Pride Month!";
    return "Welcome to meowpa.ws!";
})();
const TYPEWRITER_DELAY = 30 as const;

const GLITCH_CHARACTERS = ["@", "#", "/", "\\", "&", "%"] as const;

export default function Home() {
    const [isBlinking, setBlinking] = useState(true);
    const [avatarPreloaded, setAvatarPreloaded] = useState(false);
    const [animationState, setAnimationState] = useState(0);
    const titleRef = useRef<HTMLSpanElement>(null);

    const startTyping = useCallback(
        async (clear?: boolean) => {
            if (!titleRef.current) return;

            const lastBlinkingState = isBlinking;
            setBlinking(true);

            if (clear) titleRef.current.textContent = "";
            for (const c of TITLE_TEXT) {
                titleRef.current.textContent += c;
                await sleep(TYPEWRITER_DELAY);
            }

            setBlinking(lastBlinkingState);
        },
        [titleRef]
    );

    // Preloading actions
    useEffect(() => {
        if (animationState === 2) MatrixBG.preload(); // BG Preload
    }, [animationState]);

    // Intro Animation
    useEffect(() => {
        const animate = async () => {
            await sleep(800).then(() => startTyping(true));

            for (let i = 0; i < 3; i++) await sleep(400).then(() => setAnimationState(s => s + 1));
        };

        if (document.readyState !== "loading") animate();
        else document.addEventListener("DOMContentLoaded", animate, { once: true });

        return () => {
            document.removeEventListener("DOMContentLoaded", animate);
        };
    }, []);

    // Title glitch effect
    useEffect(() => {
        if (animationState < 2 || !titleRef.current) return;

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

    const preloadAvatar = useCallback(() => {
        if (avatarPreloaded) return;

        new Image().src = "https://github.com/meowabyte.png?size=400";
        setAvatarPreloaded(true);
    }, [avatarPreloaded]);

    return (
        <div class="roboto-mono">
            {animationState >= 3 && (EVENT_FLAGS_BLACKLIST.some(f => eventFlags.includes(f)) || boringModeState) && (
                <button class="fixed left-1/2 -translate-x-1/2 top-2 text-sm text-secondary" onClick={toggleBoringMode}>
                    [ Boring Mode - {boringModeState ? "ON" : "OFF"} ]
                </button>
            )}
            <MenuProvider>
                <div class="select-none fixed left-1/2 top-1/2 -translate-1/2 text-center h-1/2 w-5/6 flex flex-col items-center">
                    <span
                        ref={titleRef}
                        className={cn(
                            'text-3xl after:content-["▊"] after:ml-1',
                            isBlinking && "after:animate-[blink_0.5s_alternate_infinite]"
                        )}
                    ></span>

                    <Menu className={animationSlide(1)}>
                        <MenuButton
                            onHover={preloadAvatar}
                            lazy
                            element={lazy(() => import("./home-sections/aboutme"))}
                        >
                            About Me
                        </MenuButton>
                        <MenuButton lazy element={lazy(() => import("./home-sections/projects"))}>
                            My Projects
                        </MenuButton>
                        <MenuButton lazy element={lazy(() => import("./home-sections/social"))}>
                            My Social Media
                        </MenuButton>
                    </Menu>

                    <SillyRenderer className={animationSlide(2)} height={250} width={250} />
                </div>
            </MenuProvider>
            {animationState >= 3 && <MatrixBG className="brightness-90" />}
        </div>
    );
}
