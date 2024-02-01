import Canvas from "../component/canvas"
import '../app.css';
import { useEffect, useState, useRef, useLayoutEffect, MouseEvent } from 'react'
import useOutsideClick from '../hooks/useOutsideClick';
import ActionBar from "../component/actionBar"
import { Tools, ToolsType } from "../type"
import useHistory from "../hooks/useHistory"

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
    const [canvas, setCanvas] = useState<any>();
    const { undo, redo, update, history } = useHistory();
    const [pencilFlag, setPencilFlag] = useState<boolean>(false);
    const [pencilValue, setPencilValue] = useState<number>(5);
    const [pencilColor, setPencilColor] = useState<string>('black');
    const [eraserValue, setEraserValue] = useState<number>(7);
    const [eraserFlag, setEraserFlag] = useState<boolean>(false);
    const [strokeColor, setStrokeColor] = useState<string>('red');
    const [strokeValue, setStrokeValue] = useState<number>(3);
    const [eraser, setEraser] = useState<boolean>(false)
    const toolRef = useRef<any>(null);
    const pencilRef = useRef<HTMLDivElement>(null);
    const [tool, setTool] = useState<ToolsType>(initialTool);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [mode, setMode] = useState('pencil');
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });


    useOutsideClick(pencilRef, () => { setPencilFlag(false); setEraserFlag(false) })

    const getSvgPathFromStroke = (stroke: [number, number][]) => {
        if (!stroke.length) return "";

        const d = stroke.reduce(
            (
                acc: string[],
                [x0, y0]: [number, number],
                i: number,
                arr: [number, number][]
            ) => {
                const [x1, y1] = arr[(i + 1) % arr.length];
                acc.push(
                    x0.toString(),
                    y0.toString(),
                    ((x0 + x1) / 2).toString(),
                    ((y0 + y1) / 2).toString()
                );
                return acc;
            },
            ["M", ...stroke[0].map((num) => num.toString()), "Q"]
        );

        d.push("Z");
        return d.join(" ");
    };

    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        setCanvas(canvas)
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        toolRef.current = context;
    },[])

    useEffect(() => {
       
        if (toolRef.current && canvas) {
            let context = toolRef.current;
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            const scaledWidth = canvas.width * scale;
            const scaledHeight = canvas.height * scale;
            const scaleOffsetX = (scaledWidth - canvas.width) / 2;
            const scaleOffsetY = (scaledHeight - canvas.height) / 2;
            setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
            
            context.save();
            context.translate(
                panOffset.x * scale - scaleOffsetX,
                panOffset.y * scale - scaleOffsetY
            );
            context.scale(scale, scale);
            console.log(history)
            context.restore();
        }
    }, [panOffset, scale,canvas]);


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






    useEffect(() => {
        if (eraser) {
            setStrokeValue(eraserValue);
        } else {
            setStrokeColor(pencilColor);
            setStrokeValue(pencilValue);
        }
    }, [eraser, pencilColor, pencilValue, eraserValue])

    const handleClick = (title: string) => {
        switch (title) {
            case "pencil":
                setMode("pencil");
                setEraser(false)
                break;
            case 'eraser':
                setMode("eraser");
                setEraser(!eraser);
                break;
            case 'download':
                handleDownload()
                return;
            case 'photo':
                handleUpload();
                return;
            case 'notes':
                handleNotes();
                return;
        }
    }

    useEffect(() => {
        handleClick(tool)
    }, [tool])



    const handlePencilValue = (e: Event) => {
        let val = (e.target as HTMLInputElement).value
        setPencilValue(+val);
    }

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




    function undoRedoCanvas(url: any) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            toolRef.current.reset()
            toolRef?.current.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    const handleUndoredo = (e: KeyboardEvent) => {
        if (e.ctrlKey) {

            if (e.key == 'z') {
                const val = undo(history);
                undoRedoCanvas(val);
            }
            if (e.key == 'r') {
                const val = redo(history);
                undoRedoCanvas(val);
            }
        }
    }

    useEffect(() => {
        if (canvas) {
            canvas.addEventListener('keydown', handleUndoredo)

            return () => {
                canvas.removeEventListener('keydown', handleUndoredo)
            }
        }
    }, [canvas, history])
    const [mouse, setMouse] = useState(false);



    useEffect(() => {
        if (toolRef.current) {
            toolRef.current.lineWidth = +strokeValue;
            toolRef.current.strokeStyle = strokeColor;
        }
    }, [strokeValue, strokeColor]);



    const updateElement = (element: any) => {
        let copy = [...history.canvasState];
        const existingPoints = copy[element.id - 1].points || [];
        copy[element.id - 1].points = [...existingPoints, [...element.points[0]]];
        console.log(copy)
        update(copy[element.id - 1], true)
    }

    const getMouseCordinate = (event:MouseEvent) => {
        const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
        const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
        return { clientX, clientY };
    }
    const beginPath = (strokeObj: { x: number; y: number }) => {
        if (toolRef.current) {
            if (eraser) {
                toolRef.current.globalCompositeOperation = "destination-out";
                toolRef.current.beginPath();
                toolRef.current.moveTo(strokeObj.x, strokeObj.y);
            } else {
                toolRef.current.globalCompositeOperation = "source-over";
                toolRef.current.beginPath();
                toolRef.current.moveTo(strokeObj.x, strokeObj.y);
            }
        }
    };


    const handleMousedown = (e: MouseEvent<HTMLCanvasElement>) => {
        setMouse(true);
        const { clientX, clientY } = getMouseCordinate(e);
        beginPath({ x: clientX, y: clientY});
        if (e.shiftKey) {
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        };
        const id = history.canvasState.length;
        const element = { id, points: [[clientX, clientY ]] };
        console.log(element)
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
                // const element = { id, points: [[clientX,  clientY]] };
                // updateElement(element);
                toolRef.current.globalCompositeOperation = "source-over";
                toolRef.current.strokeStyle = "#000";
                toolRef.current.lineWidth = 4;
                toolRef.current.lineTo(clientX , clientY);
                toolRef.current.stroke();
            }
        }
    };

    const handleMouseup = () => {
        setMouse(false);
    };

    return (
        <div>
            <ActionBar tool={tool} setTool={setTool} />

            {/* <div className={`${pencilFlag ? "block" : "hidden"} absolute z-10 py-4 px-2 left-[25vw] top-32 bg-white w-36 rounded shadow-3xl`}>
                <div className="h-8 flex justify-center items-center">

                    <Slider
                        style={{ width: "80%" }}
                        min={2}
                        max={12}
                        value={pencilValue}
                        onChange={handlePencilValue}
                    />

                </div>
                <div className="h-[calc(100%-2rem)] flex flex-col justify-center items-center gap-4">
                    <div onClick={() => setPencilColor('#000')} className="bg-black w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
                    <div onClick={() => setPencilColor('red')} className="bg-red-500 w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
                    <div onClick={() => setPencilColor('blue')} className="bg-blue-500 w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
                </div>
            </div> */}

            {/* <div
                className={`${eraserFlag ? "flex" : "hidden"} h-8 w-[6%] p-2 justify-center z-10 items-center absolute top-32 left-[35vw] bg-white shadow-3xl`}>
                <Slider
                    style={{ width: "80%" }}
                    min={2}
                    max={16}
                    value={eraserValue}
                    onChange={(e) => setEraserValue(Number((e.target as HTMLInputElement).value))}
                />
            </div> */}

            <canvas
                id="canvas"
                onMouseDown={handleMousedown}
                onMouseMove={handleMousemove}
                onMouseUp={handleMouseup}
                width={window.innerWidth}
                height={window.innerHeight}
                className="cursor-pointer"
                // style={{ position: "absolute", zIndex: "1" }}
            ></canvas>
        </div>
    )
}

export default Draw
