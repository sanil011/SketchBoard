import { useState, MouseEvent, useEffect } from "react";

interface CanvasProps {
    canvasRef: React.MutableRefObject<HTMLCanvasElement>;
    toolRef: any;
    strokeValue: number;
    strokeColor: string;
    historyRef: any;
}

const Canvas: React.FC<CanvasProps> = ({ canvasRef, toolRef, strokeValue, strokeColor, historyRef }) => {


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
            toolRef.current.beginPath();
            toolRef.current.moveTo(strokeObj.x, strokeObj.y);
        }
    };

    const drawStroke = (strokeObj: {
        x: number;
        y: number;
        color: string;
        width: number;
    }) => {
        if (toolRef.current) {
            toolRef.current.strokeStyle = strokeObj.color;
            toolRef.current.lineWidth = strokeObj.width;
            toolRef.current.lineTo(strokeObj.x, strokeObj.y);
            toolRef.current.stroke();
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

        if ((historyRef.current.undoStatus == false && historyRef.current.redoStatus == false)) {
            let url: any = canvasRef.current && canvasRef.current.toDataURL();
            if (historyRef.current.currentStateIndex < historyRef.current.canvasState.length - 1) {
                if (historyRef.current.currentStateIndex < 20) {
                    return;
                }
                var indexToBeInserted = historyRef.current.currentStateIndex + 1;
                historyRef.current.canvasState[indexToBeInserted] = url;
                var numberOfElementsToRetain = indexToBeInserted + 1;
                historyRef.current.canvasState = historyRef.current.canvasState.splice(0, numberOfElementsToRetain);
            }
            else {
                if (historyRef.current.currentStateIndex >= 19) {
                    historyRef.current.currentStateIndex -= 1;
                    historyRef.current.canvasState.shift();
                }
                historyRef.current.canvasState.push(url);
            }
            historyRef.current.currentStateIndex = historyRef.current.canvasState.length - 1;
        }
    };

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


