import { useState, MouseEvent, useEffect } from "react";

interface CanvasProps {
    canvasRef: React.MutableRefObject<HTMLCanvasElement>;
    toolRef: any;
    strokeValue: number;
    strokeColor: string;
    eraser: any;
    update: any;
}

const Canvas: React.FC<CanvasProps> = ({ canvasRef, toolRef, strokeValue, strokeColor,eraser,update }) => {
    const [mouse, setMouse] = useState(false);

    useEffect(() => {
        const data = canvasRef?.current?.getContext("2d");
        if (data) {
            toolRef.current = data;
        } else {
            toolRef.current = null;
        }

    }, [canvasRef.current]);


    useEffect(() => {
        if (toolRef.current) {
            toolRef.current.lineWidth = +strokeValue;
            toolRef.current.strokeStyle = strokeColor;
        }
    }, [strokeValue, strokeColor]);

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

    const drawStroke = (strokeObj: {
        x: number;
        y: number;
        color: string;
        width: number;
    }) => {
        if (toolRef.current) {
            if (eraser) {
                toolRef.current.globalCompositeOperation = "destination-out";
                toolRef.current.lineWidth = strokeObj.width;
                toolRef.current.lineTo(strokeObj.x, strokeObj.y);
                toolRef.current.stroke();
            } else {
                toolRef.current.globalCompositeOperation = "source-over";
                toolRef.current.strokeStyle = strokeObj.color;
                toolRef.current.lineWidth = strokeObj.width;
                toolRef.current.lineTo(strokeObj.x, strokeObj.y);
                toolRef.current.stroke();
            }
        }
    };

    const handleMousedown = (e: MouseEvent<HTMLCanvasElement>) => {
        setMouse(true);
        beginPath({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const handleMousemove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (mouse) {
            const data = {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
                color: strokeColor,
                width: +strokeValue,
            };
            drawStroke(data);
        }
    };

    const handleMouseup = () => {
        setMouse(false);
        let url: string = canvasRef.current && canvasRef.current.toDataURL();
        update(url);
    };
    useEffect(() => {
        let url: string = canvasRef.current && canvasRef.current.toDataURL();
        update(url);
    },[])

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMousedown}
            onMouseMove={handleMousemove}
            onMouseUp={handleMouseup}
            width={window.innerWidth}
            height={window.innerHeight}
            className="cursor-pointer"
        ></canvas>
    );
};


export default Canvas


