import { useEffect, useRef, useState } from "preact/hooks";
import { cn, eventFlags, sleep } from "../../helpers/utils";

const UPDATE_DELAY = 500 as const;
const UPDATE_FADE_OPACITY = 0.2 as const;
const UPDATE_CHARACTERS = ["@", "#", "/", "\\", "&", "%"] as const;

const FONT_NAME = "Roboto Mono" as const;
const FONT_SIZE = 16 as const;
const FONT = `400 ${FONT_SIZE}px "${FONT_NAME}"` as const;
const FONT_PX = (() => {
    const c = document.createElement("canvas").getContext("2d")!;

    c.font = FONT;
    return c.measureText("@");
})();

const FONT_JUMP_SIZE = FONT_PX.actualBoundingBoxAscent + 10;
const UPDATE_FADE_SIZE = FONT_JUMP_SIZE * (Math.ceil(1 / UPDATE_FADE_OPACITY) * 4);

const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const lightness = Math.floor(Math.random() * 21) + 40;
    return `hsl(${hue}, 100%, ${lightness}%)`;
};

const BI_COLORS = ["#D60270", "#9B4F96", "#0038A8"] as const;
const getParticleEffect = () => {
    if (eventFlags.includes("BIRTHDAY")) return randomColor();
    if (eventFlags.includes("PRIDE")) return BI_COLORS[Math.floor(Math.random() * BI_COLORS.length)];
    return "white";
};

type BMAddToMatrixOptions = {
    /** Position of the element. Random by default */
    x?: number;
    /** fillStyle of the element. White by default */
    style?: string;
    /** Delay between ticks */
    delay?: number;
};

class BackgroundManager {
    target: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    updateInterval?: number;

    constructor(target: HTMLCanvasElement) {
        this.target = target;
        this.ctx = this.target.getContext("2d", { willReadFrequently: true })!;

        this.setupCanvas();
        this.setupEvents();
    }

    setupCanvas() {
        const canvasData =
            [this.target.width, this.target.height].includes(0) ? null : (
                this.ctx.getImageData(0, 0, this.target.width, this.target.height)
            );

        this.target.width = window.innerWidth;
        this.target.height = window.innerHeight;

        if (canvasData) this.ctx.putImageData(canvasData, 0, 0);
    }

    setupEvents() {
        window.addEventListener("resize", this.setupCanvas.bind(this));

        document.fonts.ready.then(() => {
            this.updateInterval = setInterval(this.addToMatrix.bind(this), UPDATE_DELAY) as unknown as number;
            this.addToMatrix();
        });
    }

    destroy() {
        window.removeEventListener("resize", this.setupCanvas.bind(this));
        if (this.updateInterval) clearInterval(this.updateInterval);
    }

    async addToMatrix(o?: BMAddToMatrixOptions) {
        const x = (() => {
            const x = o?.x ?? Math.floor(Math.random() * this.target.width);
            return x - (x % FONT_PX.width);
        })();
        const fillStyle = o?.style ?? getParticleEffect();

        for (let y = 0; y < this.target.height + UPDATE_FADE_SIZE; y += FONT_JUMP_SIZE) {
            if (x > this.target.width) break; // Resized - disable if outside of area

            // Char
            this.ctx.fillStyle = fillStyle;
            this.ctx.font = FONT;
            this.ctx.fillText(UPDATE_CHARACTERS[Math.floor(Math.random() * UPDATE_CHARACTERS.length)], x, y);

            // Fading
            this.ctx.fillStyle = `rgba(0,0,0,${UPDATE_FADE_OPACITY})`;
            this.ctx.fillRect(x, y, FONT_PX.width, -UPDATE_FADE_SIZE);

            await sleep(o?.delay ?? 100);
        }
    }
}

export default function MatrixBG({ className }: { className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [bg, setBg] = useState<BackgroundManager | null>(null);

    // BG add to matrix effect
    useEffect(() => {
        if (!bg) return;

        const addToMatrix = ({ x }: MouseEvent) => {
            bg.addToMatrix({ x, style: "red", delay: 30 });
        };

        window.addEventListener("click", addToMatrix);
        return () => {
            window.removeEventListener("click", addToMatrix);
        };
    }, [bg]);

    // Init BG
    useEffect(() => {
        if (!ref.current) return;

        const bg = new BackgroundManager(ref.current);
        setBg(bg);

        return () => {
            bg.destroy();
        };
    }, []);

    return <canvas class={cn(className, "fixed left-0 top-0 -z-[9999] pointer-events-none")} ref={ref} />;
}
