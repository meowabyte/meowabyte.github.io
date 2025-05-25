import { ArrowLeftRight } from "lucide-preact"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js"
import { cn } from "../helpers/utils"


class SceneManager {
    fontLoader = new FontLoader()
    scene = new Scene();
    camera = new PerspectiveCamera();
    renderer: WebGLRenderer;
    text!: Mesh;

    manuallyRotated = false;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new WebGLRenderer({ alpha: true, canvas })
        this.init()
    }

    private async init() {
        await Promise.all([
            this.initCamera(),
            this.initText()
        ])

        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    private initCamera() {
        this.camera.position.z = 100;
    }

    private async initText() {
        const font = await this.fontLoader.loadAsync("/three-font.json")
        const geometry = new TextGeometry(":3", {
            font,
            size: 40,
            depth: 10,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5
        })
        const material = new MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        })

        // Center the text
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox!;
        const offsetX = -0.5 * (boundingBox.max.x - boundingBox.min.x);
        const offsetY = -0.5 * (boundingBox.max.y - boundingBox.min.y);
        const offsetZ = -0.5 * (boundingBox.max.z - boundingBox.min.z);
        geometry.translate(offsetX, offsetY, offsetZ);

        this.text = new Mesh(geometry, material);
        this.scene.add(this.text)
    }

    private animate() {
        if (!this.manuallyRotated) {
            this.text.rotateX(0.010)
            this.text.rotateY(0.02)
        }

        this.renderer.render(this.scene, this.camera)
    }
}



type Props = {
    height: number,
    width: number,
    className?: string
}

export default function SillyRenderer({ height, width, className }: Props) {
    const ref = useRef<HTMLCanvasElement>(null)
    const [sceneManager, setSceneManager] = useState<SceneManager | null>(null)
    const [supportsWebGL, setWebglSupport] = useState<boolean | null>(null)
    const [shouldShowTip, setShowTip] = useState(true)

    useEffect(() => {
        if (!ref.current) return;
        try {
            setSceneManager(new SceneManager(ref.current)) }
        catch (e) {
            console.error(`Could not show the silly render! `, e)
            setWebglSupport(false)
        }
    }, [ref])

    useEffect(() => {
        if (!sceneManager) return;
        const canvas = ref.current!;
        
        let isDragging = false;
        let previousX = 0;
        let previousY = 0;

        const handleMouseDown = (e: MouseEvent) => {
            startDragging()
            previousX = e.clientX;
            previousY = e.clientY;
        };

        const handleTouchStart = (e: TouchEvent) => {
            startDragging()
            previousX = e.touches[0].clientX;
            previousY = e.touches[0].clientY;
        };

        const startDragging = () => {
            isDragging = true;
            sceneManager.manuallyRotated = true;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - previousX;
            const deltaY = e.clientY - previousY;
            
            sceneManager.text.rotation.y += deltaX * 0.01;
            sceneManager.text.rotation.x += deltaY * 0.01;
            
            previousX = e.clientX;
            previousY = e.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - previousX;
            const deltaY = e.touches[0].clientY - previousY;
            
            sceneManager.text.rotation.y += deltaX * 0.01;
            sceneManager.text.rotation.x += deltaY * 0.01;
            
            previousX = e.touches[0].clientX;
            previousY = e.touches[0].clientY;
        };

        const stopDragging = () => {
            isDragging = false;
            sceneManager.manuallyRotated = false;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('touchstart', handleTouchStart);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove)

        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('mouseleave', stopDragging);
        document.addEventListener('touchend', stopDragging)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchstart', handleTouchStart)

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove)

            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('mouseleave', stopDragging);
            document.removeEventListener('touchend', stopDragging)
        };
    }, [sceneManager])

    const hideTip = useCallback(() => {
        if (!shouldShowTip) return;
        setShowTip(false)
    }, [shouldShowTip])

    const showTip = useCallback(() => {
        if (shouldShowTip) return;
        setShowTip(true)
    }, [shouldShowTip])

    if (supportsWebGL === false) return null;
    return <div class={cn(className, "group")} >
        <canvas
            onMouseDown={hideTip} onTouchStart={hideTip}
            onMouseUp={showTip} onTouchEnd={showTip}
            height={height} width={width} ref={ref}
        />
        {shouldShowTip && <ArrowLeftRight class="absolute left-1/2 bottom-5 scale-3d scale-y-75 transition-opacity duration-100 opacity-0 group-hover:!opacity-75" />}
    </div>
}