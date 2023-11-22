import Pencil from "../assets/pencil.png"
import Eraser from "../assets/eraser.png"
import Download from "../assets/download.png"
import Photo from "../assets/photo.png"
import Undo from "../assets/undo.svg"
import Redo from "../assets/redo.svg"
import Menu from "../assets/menu.png"
import Notes from "../assets/notes.png";
import Cross from "../assets/cross.png";
import Canvas from "../component/canvas"
import '../app.css';
import { Slider } from '@mui/material';
import { useEffect, useState, useRef } from 'react'
import useOutsideClick from '../hooks/useOutsideClick'



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
    const icons = [
        { icon: Pencil, id: "Pencil" },
        { icon: Eraser, id: "Eraser" },
        { icon: Download, id: "Download" },
        { icon: Photo, id: "Photo" },
        { icon: Notes, id: "Notes" },
        { icon: Redo, id: "Redo" },
        { icon: Undo, id: "Undo" }
    ]

    const canvasRef = useRef<any>();
    const [pencilFlag, setPencilFlag] = useState<boolean>(false);
    const [pencilValue, setPencilValue] = useState<number>(3);
    const [pencilColor, setPencilColor] = useState<string>('red');
    const [eraserValue, setEraserValue] = useState<number>(3);
    const [eraserFlag, setEraserFlag] = useState<boolean>(false);
    const [strokeColor, setStrokeColor] = useState<string>('red');
    const [strokeValue, setStrokeValue] = useState<number>(3);
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [eraser, setEraser] = useState<boolean>(false)
    const toolRef = useRef<any>(null);
    const pencilRef = useRef<HTMLDivElement>(null)

    useOutsideClick(pencilRef, () => { setPencilFlag(false); setEraserFlag(false) })

    const historyRef = useRef({
        canvasState: [],
        currentStateIndex: -1,
        undoStatus: false,
        redoStatus: false,
        undoFinishedStatus: 1,
        redoFinishedStatus: 1,
    });

    const handleClick = (title: string) => {
        switch (title) {
            case "Pencil":
                setPencilFlag(!pencilFlag);
                setEraser(false)
                break;
            case 'Eraser':
                if (!eraser) {
                    setEraserFlag(!eraserFlag);
                }
                setEraser(!eraser);
                break;
            case 'Download':
                handleDownload()
                return;
            case 'Photo':
                handleUpload();
                return;
            case 'Notes':
                handleNotes();
                return;
            case 'Undo':
                handleUndo();
                return;
            case 'Redo':
                handleRedo();
                return;
        }
    }

    useEffect(() => {
        if (eraser) {
            setStrokeColor("#ffffff");
            setStrokeValue(eraserValue);
        } else {
            setStrokeColor(pencilColor);
            setStrokeValue(pencilValue);
        }
    }, [eraser, pencilColor, pencilValue, eraserValue])



    const handlePencilValue = (e: Event) => {
        let val = (e.target as HTMLInputElement).value
        setPencilValue(+val);
    }

    const handleDownload = (): void => {
        const url = canvasRef?.current?.toDataURL();
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




    const handleUndo = () => {
        if (historyRef.current.undoFinishedStatus) {
            console.log(historyRef.current)
            if (historyRef.current.currentStateIndex == -1) {
                historyRef.current.undoStatus = false;
            }
            else {
                if (historyRef.current.canvasState.length >= 1) {
                    historyRef.current.undoFinishedStatus = 0;
                    if (historyRef.current.currentStateIndex != 0) {
                        historyRef.current.undoStatus = true;
                        undoRedoCanvas(historyRef.current.canvasState[historyRef.current.currentStateIndex - 1])
                        historyRef.current.undoStatus = false;
                        historyRef.current.currentStateIndex -= 1;
                        historyRef.current.undoFinishedStatus = 1;
                    }
                    else if (historyRef.current.currentStateIndex == 0) {
                        toolRef.current.reset()
                    }
                }
            }
        }

    }


    const handleRedo = () => {
        if (historyRef.current.redoFinishedStatus) {
            if ((historyRef.current.currentStateIndex == (historyRef.current.canvasState.length - 1)) && historyRef.current.currentStateIndex != -1) {
                return;
            } else {
                if (historyRef.current.canvasState.length > historyRef.current.currentStateIndex && historyRef.current.canvasState.length != 0) {
                    historyRef.current.redoFinishedStatus = 0;
                    historyRef.current.redoStatus = true;
                    undoRedoCanvas(historyRef.current.canvasState[historyRef.current.currentStateIndex + 1])
                    historyRef.current.redoStatus = false;
                    historyRef.current.currentStateIndex += 1;
                    historyRef.current.redoFinishedStatus = 1;

                };
            }
        }
    }

    function undoRedoCanvas(url: any) {
        let img = new Image(); // new image reference element
        img.src = url;
        img.onload = () => {
            toolRef.current.reset()
            toolRef?.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }
    return (
        <>
            <div className='p-4 bg-gray-200 z-10 w-12 h-12 flex absolute top-10 left-8 justify-center items-center'>
                <img src={showMenu ? Cross : Menu} onClick={() => setShowMenu(!showMenu)} alt='icon' />
            </div>
            <div className=
                {showMenu ? 'hidden' : 'animate-scaleTools flex w-[55vw] py-4 z-10 bg-white absolute h-24 top-8 left-[25vw] justify-around  border border-[#f1f2f6] shadow-3xl'}
                ref={pencilRef}
            >
                {icons.map((icon) => <img key={icon.id} src={icon.icon} alt='icon' onMouseDown={() => handleClick(icon.id)}
                    className={`${icon.id} cursor-pointer ${icon.id == "Eraser" && eraser && "border-2 border-black "}   w-16`} />)}
            </div>
            <div className={`${pencilFlag ? "block" : "hidden"} absolute z-10 py-4 px-2 left-[25vw] top-32 bg-white w-36 rounded shadow-3xl`}>
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
            </div>

            <div
                className={`${eraserFlag ? "flex" : "hidden"} 
         h-8 w-[6%] p-2 justify-center z-10 items-center absolute top-32 left-[35vw] bg-white shadow-3xl`}>
                <Slider
                    style={{ width: "80%" }}
                    min={2}
                    max={16}
                    value={eraserValue}
                    onChange={(e) => setEraserValue(Number((e.target as HTMLInputElement).value))}
                />
            </div>

            <Canvas
                canvasRef={canvasRef}
                toolRef={toolRef}
                strokeValue={strokeValue}
                strokeColor={strokeColor}
                historyRef={historyRef}
            />
        </>
    )
}

export default Draw
