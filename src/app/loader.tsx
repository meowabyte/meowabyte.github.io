import { hydrate } from "preact-iso";
import { App } from "./app";

hydrate(<App />, document.querySelector("#root")!)