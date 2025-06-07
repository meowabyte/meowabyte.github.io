import { useEffect, useRef } from "preact/hooks";
import { cn } from "../../helpers/utils";

import bgMask from "../../img/beach-mask.webp";

const UPDATE_CHARACTERS = ["@", "#", "/", "\\", "&", "%"] as const;

const FONT_NAME = "Roboto Mono" as const;
const FONT_SIZE = 16 as const;
const FONT = `400 ${FONT_SIZE}px "${FONT_NAME}"` as const;
const FONT_PX = (() => {
    const c = document.createElement("canvas").getContext("2d")!;

    c.font = FONT;
    return c.measureText("@");
})();

class BackgroundManager {
    private maskImage: HTMLImageElement;
    private maskLoaded = false;

    target: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    updateInterval?: number;

    constructor(target: HTMLCanvasElement) {
        this.target = target;
        this.ctx = this.target.getContext("2d", { willReadFrequently: true })!;

        this.maskImage = new Image();
        this.maskImage.src = bgMask;
        this.maskImage.onload = () => {
            this.maskLoaded = true;
            this.applyMask();
        };

        this.setupCanvas();
        this.setupEvents();
    }

    setupCanvas() {
        this.target.width = window.innerWidth;
        this.target.height = window.innerHeight;
    }

    setupEvents() {
        window.addEventListener("resize", this.setupCanvas.bind(this));

        document.fonts.ready.then(() => {
            this.updateInterval = setInterval(this.updateCharacters.bind(this), 2000) as unknown as number;
            this.updateCharacters();
        });
    }

    destroy() {
        window.removeEventListener("resize", this.setupCanvas.bind(this));
        if (this.updateInterval) clearInterval(this.updateInterval);
    }

    updateCharacters() {
        this.ctx.reset();

        for (let x = 0; x < this.target.width; x += FONT_PX.width + 5)
            for (let y = 0; y < this.target.height; y += FONT_PX.actualBoundingBoxAscent + 5) {
                this.ctx.font = FONT;
                this.ctx.fillStyle = "white";
                this.ctx.fillText(UPDATE_CHARACTERS[Math.floor(Math.random() * UPDATE_CHARACTERS.length)], x, y);
            }

        this.applyMask();
    }

    private applyMask() {
        if (!this.maskImage || !this.maskLoaded) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.target.width;
        tempCanvas.height = this.target.height;
        const tempCtx = tempCanvas.getContext("2d")!;
        tempCtx.drawImage(this.maskImage, 0, 0, this.target.width, this.target.height);

        tempCtx.globalCompositeOperation = "destination-in";
        tempCtx.drawImage(this.target, 0, 0);
        this.ctx.reset();
        this.ctx.drawImage(tempCanvas, 0, 0);
    }
}

export default function BeachBG({ className }: { className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null);

    // Init BG
    useEffect(() => {
        if (!ref.current) return;

        const bg = new BackgroundManager(ref.current);

        return () => {
            bg.destroy();
        };
    }, []);

    return (
        <canvas
            class={cn("absolute *:absolute left-0 top-0 w-screen h-screen -z-[9999] pointer-events-none", className)}
            ref={ref}
        />
    );
}
