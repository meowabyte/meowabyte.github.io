import "../styles/globals.css";

import { lazy, ErrorBoundary, LocationProvider, Route, Router } from "preact-iso"
import { Navigate } from "../components/misc";


export function App() {
    return <LocationProvider>
        <ErrorBoundary>
            <Router>
                <Route path="/" component={lazy(() => import("./home"))} />
                <Route path="/404" component={lazy(() => import("./not-found"))} />
                <Route default component={() => <Navigate to="/404" />} />
            </Router>
        </ErrorBoundary>
    </LocationProvider>
}