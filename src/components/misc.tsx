import { useLocation } from "preact-iso"
import { useLayoutEffect } from "preact/hooks"

type NavigateProps = {
    /** Route that this component should redirect to */
    to: string,
    /** Should replace the item in history? */
    replace?: boolean
}

/** Navigates user the moment component is mounted. */
export function Navigate({ to, replace }: NavigateProps) {
    const { route } = useLocation()

    useLayoutEffect(() => {
        route(to, replace)
    }, [])

    return null
}