if (typeof window !== "undefined") throw new Error("PLEASE DO NOT IMPORT THIS OUTSIDE OF SERVER");

const stubFunc = () => {};
const stubReturnFunc = (ret: unknown) => () => ret;

Object.defineProperty(globalThis, "document", {
    value: { createElement: stubReturnFunc({ getContext: () => ({ font: "", measureText: () => {} }) }) }
});
Object.defineProperty(globalThis, "localStorage", { value: { getItem: stubReturnFunc(null), setItem: stubFunc } });
Object.defineProperty(globalThis, "window", {
    value: {
        dispatchEvent: stubFunc,
        localStorage: globalThis.localStorage,
        document: globalThis.document,
        addEventListener: stubFunc,
        removeEventListener: stubFunc
    }
});
