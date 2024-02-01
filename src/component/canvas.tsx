import { useState, MouseEvent, useEffect } from "react";

interface CanvasProps {
    canvas: React.MutableRefObject<HTMLCanvasElement>;
    toolRef: any;
    strokeValue: number;
    strokeColor: string;
    eraser: any;
    update: any;
    history: any;
}

const Canvas: React.FC<CanvasProps> = ({ canvas, toolRef, strokeValue, strokeColor,eraser,update,history }) => {
    const [mouse, setMouse] = useState(false);

    // useEffect(() => {
    //     const data = canvas?.current?.getContext("2d");
    //     if (data) {
    //         toolRef.current = data;
    //     } else {
    //         toolRef.current = null;
    //     }

    // }, [canvas.current]);


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
                console.log("sanil")
            } else {
                toolRef.current.globalCompositeOperation = "source-over";
                toolRef.current.strokeStyle = strokeObj.color;
                toolRef.current.lineWidth = strokeObj.width;
                toolRef.current.lineTo(strokeObj.x, strokeObj.y);
                toolRef.current.stroke();
                console.log("sanil shreya")
            }
        }
    };

    const handleMousedown = (e: MouseEvent<HTMLCanvasElement>) => {
        setMouse(true);
        beginPath({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        const id = history.canvasState.length;
        const element = {id, url:canvas.toDataURL() };
        update(element)
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
            const id = history.canvasState.length;
            const element = { id, url: canvas.toDataURL() };
            update(element)
        }
    };

    const handleMouseup = () => {
        setMouse(false);
        // let url: string = canvas.current && canvas.current.toDataURL();
        // update(url);
    };
    // useEffect(() => {
    //     let url: string = canvas.current && canvas.current.toDataURL();
    //     update(url);
    // },[])

    return (
        <canvas
            id="canvas"
            onMouseDown={handleMousedown}
            onMouseMove={handleMousemove}
            onMouseUp={handleMouseup}
            width={window.innerWidth}
            height={window.innerHeight}
            className="cursor-pointer"
            style={{position:"absolute",zIndex:}}
        ></canvas>
    );
};


export default Canvas


