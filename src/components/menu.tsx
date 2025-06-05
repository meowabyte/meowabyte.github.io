import type { JSX } from "preact/compat";

import { useContext, useMemo, useState, type Dispatch, type StateUpdater } from "preact/hooks";
import MenuButton from "./menu/menubutton";
import { createContext, type VNode } from "preact";
import Modal from "./modal";
import { cn } from "../helpers/utils";

type ModalBodyType = (() => JSX.Element) | null;

type MenuContextValue = { showModal: Dispatch<StateUpdater<ModalBodyType>>; readonly isModalSet: boolean };
const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: VNode }) {
    const [CurrentModal, setModal] = useState<ModalBodyType>(null);

    const contextValue = useMemo<MenuContextValue>(
        () => ({
            showModal: setModal,
            get isModalSet() {
                return CurrentModal !== null;
            }
        }),
        [CurrentModal]
    );

    return (
        <MenuContext.Provider value={contextValue}>
            {children}

            <Modal>{CurrentModal && <CurrentModal />}</Modal>
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const ctx = useContext(MenuContext);
    if (!ctx) throw new Error("Please use this hook inside of MenuProvider component!");
    return ctx;
}

export default function Menu({ children, className }: { children: VNode<typeof MenuButton>[]; className?: string }) {
    return <div class={cn(className, "flex flex-row gap-5 h-32 items-center")}>{children}</div>;
}
