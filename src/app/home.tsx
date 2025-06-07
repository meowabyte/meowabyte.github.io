import "../styles/home.css";

import { useState, type Dispatch, type StateUpdater } from "preact/hooks";
import { Home } from "./home/home";
import { Credits } from "./home/credits";

export type HomeScreenProps = { screenIndex: number; setScreenIndex: Dispatch<StateUpdater<number>> };

export default function HomeScreens() {
    const [screenIndex, setScreenIndex] = useState(0);

    // TODO: rewrite current screen style to providers in future
    return (
        <div
            class="fixed -translate-y-[calc(100vh_*_var(--screenIndex,0))] *:w-screen *:h-screen *:relative transition-transform duration-500 ease-[cubic-bezier(0.28,0.13,0.06,0.92)]"
            style={{ "--screenIndex": screenIndex }}
        >
            <Home screenIndex={screenIndex} setScreenIndex={setScreenIndex} />
            <Credits screenIndex={screenIndex} setScreenIndex={setScreenIndex} />
        </div>
    );
}
