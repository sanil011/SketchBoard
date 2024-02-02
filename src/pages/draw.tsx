import '../app.css';
import { useEffect, useState, useRef, useLayoutEffect, MouseEvent } from 'react'
import ActionBar from "../component/actionBar"
import { Tools, ToolsType } from "../type"
import useHistory from "../hooks/useHistory"
import ControlPanel from '../component/controlPanel';

function dragAndDrop(element: HTMLElement | null, event: MouseEvent) {

    if (!element) return;

    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = '1000';

    moveAt(event.pageX, event.pageY);
    function moveAt(pageX: number, pageY: number) {
        if (!element) return
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event: MouseEvent) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}



function Draw() {
    const initialTool: ToolsType = Tools.pencil;
    const { undo, redo, update, history } = useHistory();
    const [pencilValue, setPencilValue] = useState<number>(5);
    const [pencilColor, setPencilColor] = useState<string>('black');
    const [eraserValue, setEraserValue] = useState<number>(7);
    const [strokeColor, setStrokeColor] = useState<string>('red');
    const [strokeValue, setStrokeValue] = useState<number>(3);
    const [eraser, setEraser] = useState<boolean>(false)
    const pencilRef = useRef<HTMLDivElement>(null);
    const [tool, setTool] = useState<ToolsType>(initialTool);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [mode, setMode] = useState('pencil');
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
    const [pencilHandle, setPencilHandle] = useState<HTMLElement | null>(null);


    useLayoutEffect(() => {
        const pencil = document.getElementById("pencil");
        setPencilHandle(pencil)
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        const scaleOffsetX = (scaledWidth - canvas.width) / 2;
        const scaleOffsetY = (scaledHeight - canvas.height) / 2;
        setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.translate(
            panOffset.x * scale - scaleOffsetX,
            panOffset.y * scale - scaleOffsetY
        );
        context.scale(scale, scale);
        console.log(history)
        history?.canvasState?.map((db) => {
            context.beginPath();
            context.moveTo(db.points[0].x, db.points[0].y);
            for (let i = 1; i < db.points.length; i++) {
                context.lineTo(db.points[i].x, db.points[i].y);
            }
            context.strokeStyle = db.color;
            context.lineWidth = pencilValue;
            context.stroke()
        })
        context.restore();

    }, [panOffset, scale, history]);


    const onZoom = (delta: number) => {
        setScale((prevState) => Math.min(Math.max(prevState + delta, 0.1), 20));
    };

    useEffect(() => {
        const panOrZoomFunction = (event: WheelEvent) => {
            if (event.ctrlKey) {
                onZoom(event.deltaY * -0.01);
            } else {
                setPanOffset((prevState) => ({
                    x: prevState.x - event.deltaX,
                    y: prevState.y - event.deltaY,
                }));
            }
        };

        document.addEventListener("wheel", panOrZoomFunction);
        return () => {
            document.removeEventListener("wheel", panOrZoomFunction);
        };
    }, []);


    const handleClick = (title: string) => {
        switch (title) {
            case "pencil":
                setMode("pencil");
                setEraser(false)
                break;
            case 'eraser':
                setEraser(true);
                break;
            case 'download':
                handleDownload();
                pencilHandle && pencilHandle?.click();
                return;
            case 'photo':
                handleUpload();
                pencilHandle && pencilHandle?.click();
                return;
            case 'notes':
                handleNotes();
                pencilHandle && pencilHandle?.click();
                return;
        }
    }

    useEffect(() => {
        handleClick(tool)
    }, [tool])


    const handleDownload = (): void => {
        const url = canvas?.toDataURL();
        if (url) {
            const a = document.createElement("a");
            a.href = url;
            a.download = "board.jpg";
            a.click();
        }
    };

    const handleNotes = (): void => {
        let stickyTemplateHTML = ` <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellCheck='false'></textarea>
        </div>`;

        createSticky(stickyTemplateHTML);
    }

    const handleUpload = (): void => {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.addEventListener("change", () => {
            if (input.files) {
                let file = input.files[0];
                let url = URL.createObjectURL(file);
                let stickyTemplayteHTML = ` <div class="header-cont">
              <div class="minimize"></div>
              <div class="remove"></div>
          </div>
          <div class="note-cont">
              <img src="${url}" className='h-full w-full'/>
          </div>`;

                createSticky(stickyTemplayteHTML);
            }

        })
    }


    const createSticky = (stickyTemplayteHTML: string) => {
        let stickyCont = document.createElement("div");
        stickyCont.setAttribute("class", "sticky-cont");
        stickyCont.innerHTML = stickyTemplayteHTML;
        document.body.appendChild(stickyCont);
        let minimize = stickyCont.querySelector(".minimize") as HTMLElement | null;
        let remove = stickyCont.querySelector(".remove") as HTMLElement | null;

        noteActions(minimize, remove, stickyCont);
        stickyCont.onmousedown = function (event) {
            dragAndDrop(stickyCont, event)
        }

        stickyCont.ondragstart = function () {
            return false;
        }
    }

    function noteActions(minimize: HTMLElement | null, remove: HTMLElement | null, stickyCont: HTMLElement | null) {
        remove?.addEventListener("click", () => {
            stickyCont?.remove();
        })
        minimize?.addEventListener("click", () => {
            let noteCont = stickyCont?.querySelector(".note-cont") as HTMLElement | null;

            if (noteCont && stickyCont) {
                let display = getComputedStyle(noteCont).getPropertyValue("display");
                if (display == "none") {
                    noteCont.style.display = "block";
                    noteCont.style.height = 'calc(100% - 2rem)'
                    stickyCont.style.height = '15rem';
                }
                else {
                    noteCont.style.display = "none";
                    noteCont.style.height = '0';
                    stickyCont.style.height = '2rem';
                }
            }
        })
    }

    const [mouse, setMouse] = useState(false);

    const updateElement = (element: any) => {
        let copy = [...history.canvasState];
        const existingPoints = copy[element.id - 1].points || [];
        copy[element.id - 1].points = [...existingPoints, element.points[0]];
        update(copy[element.id - 1], true)
    }

    const getMouseCordinate = (event: MouseEvent) => {
        const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
        const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
        return { clientX, clientY };
    }


    const handleMousedown = (e: MouseEvent<HTMLCanvasElement>) => {
        setMouse(true);
        const { clientX, clientY } = getMouseCordinate(e);
        if (e.shiftKey) {
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        };
        const id = history.canvasState.length;
        const element = eraser ? { id, points: [{ x: clientX, y: clientY }], color: "#ffffff" } : { id, points: [{ x: clientX, y: clientY }], color: pencilColor };
        update(element);
    };


    const handleMousemove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (mouse) {
            const { clientX, clientY } = getMouseCordinate(e);
            if (e.shiftKey) {
                const deltaX = clientX - startPanMousePosition.x;
                const deltaY = clientY - startPanMousePosition.y;
                setPanOffset({
                    x: panOffset.x + deltaX,
                    y: panOffset.y + deltaY,
                });
            } else {
                const id = history.canvasState.length;
                const element = eraser ? { id, points: [{ x: clientX, y: clientY }], color: "#ffffff" } : { id, points: [{ x: clientX, y: clientY }], color: pencilColor };
                updateElement(element);
            }
        }
    };

    const handleMouseup = () => {
        setMouse(false);
    };

    return (
        <div>
            <ActionBar tool={tool} setTool={setTool} />
            <ControlPanel />
            <canvas
                id="canvas"
                onMouseDown={handleMousedown}
                onMouseMove={handleMousemove}
                onMouseUp={handleMouseup}
                width={window.innerWidth}
                height={window.innerHeight}
                className="cursor-pointer bg-white"
            // style={{ position: "absolute", zIndex: "1" }}
            ></canvas>
        </div>
    )
}

export default Draw
