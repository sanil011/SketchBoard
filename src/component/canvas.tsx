import { useRef, useState, MouseEvent, useEffect } from "react"

const Canvas = (
    { strokeValue, strokeColor,trigger  }:
        { strokeValue: string, strokeColor: string, trigger:number}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mouse, setMouse] = useState<boolean>(false);
    const toolRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const data = canvasRef?.current?.getContext("2d");
        if (data) {
            toolRef.current = data;
        } else {
            toolRef.current = null; 
        }
    }, [canvasRef]);

    useEffect(() => {
        handleDownload()
    },[trigger])

    const handleDownload = ():void => {
        const url = canvasRef?.current?.toDataURL();
        if (url) {
            const a = document.createElement("a");
            a.href = url;
            a.download = "board.jpg";
            a.click();
        }
    }


    useEffect(() => {
        if (toolRef?.current) {

            toolRef.current.lineWidth = +strokeValue;
            toolRef.current.strokeStyle = strokeColor;
        }
    },[strokeValue,strokeColor])


    useEffect(() => {
        if (toolRef.current) {
            toolRef.current.strokeStyle = strokeColor;
            toolRef.current.lineWidth = +strokeValue;
        }
    }, [toolRef.current])



    function beginPath(strokeObj: { x: number, y: number }) {
        if (toolRef?.current) {
            toolRef.current.beginPath();
            toolRef.current.moveTo(strokeObj.x, strokeObj.y);
        }
    }


    function drawStroke(strokeObj: {
        x: number;
        y: number;
        color: string;
        width: number;
    }) {
        if (toolRef?.current) {
            toolRef.current.strokeStyle = strokeObj?.color,
            toolRef.current.lineWidth = strokeObj.width,
            toolRef.current.lineTo(strokeObj.x, strokeObj.y);
            toolRef.current.stroke();
        }
    }


    const handleMousedown = (e: MouseEvent<HTMLCanvasElement>) => {
        setMouse(true);
        beginPath({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    }


    const handleMousemove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (mouse) {
            let data = {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
                color: strokeColor,
                width: +strokeValue,
            }
            drawStroke(data)
        }
    }


    const handleMouseup = () => {
        setMouse(false);
    }


    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMousedown}
            onMouseMove={handleMousemove}
            onMouseUp={handleMouseup}
            width={window.innerWidth}
            height={window.innerHeight}
            className="cursor-pointer"></canvas>
    )
}

export default Canvas