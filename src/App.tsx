import  Pencil from "./assets/pencil.png"
import  Eraser from "./assets/eraser.png"
import  Download from "./assets/download.png"
import  Photo from "./assets/photo.png"
import  Undo from "./assets/undo.png"
import  Redo from "./assets/redo.png"
import  Menu from "./assets/menu.png"
import Canvas from "./component/canvas"
import {ChangeEvent, useEffect, useState} from 'react'
function App() {
  const icons = [
    { icon: Pencil, id:"Pencil" },
    { icon: Eraser, id: "Eraser" },
    { icon: Download, id: "Download" },
    { icon: Photo, id: "Photo" },
    { icon: Undo, id: "Undo" },
    { icon: Redo, id: "Redo" }
  ]

  const [pencilFlag, setPencilFlag] = useState<boolean>(false);
  const [pencilValue, setPencilValue] = useState<string>("3");
  const [pencilColor, setPencilColor] = useState<string>('red');
  const [eraserValue, setEraserValue] = useState<string>('3');
  const [eraserFlag, setEraserFlag] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>('red');
  const [strokeValue, setStrokeValue] = useState<string>('3');
  const [trigger, setTrigger] = useState<number>(0);

  const handleClick = (title: string) => {
    switch (title) {
      case "Pencil":
        setPencilFlag(!pencilFlag);
        break;
      case 'Eraser':
        setEraserFlag(!eraserFlag);
        break;
      case 'Download':
        setTrigger((prev)=> prev +1)
        return;
   }
  }
console.log(pencilFlag,eraserFlag)
  useEffect(() => {
    if (eraserFlag) {
      setStrokeColor("#ffffff");
      setStrokeValue(eraserValue);
    } else {
      setStrokeColor(pencilColor);
      setStrokeValue(pencilValue);
    }
  }, [eraserFlag, pencilColor, pencilValue, eraserValue])
  
  

  const handlePencilValue = (e:ChangeEvent<HTMLInputElement>) => {
    setPencilValue(e.target.value);
  }  
  return (
    <>
      <div className='p-4 bg-gray-200 z-10 w-12 h-12 flex absolute top-10 left-8 justify-center items-center'>
        <img src={Menu} alt='icon' />
      </div>
      <div className='flex w-[55vw] py-4 z-10 absolute h-24 top-8 left-[25vw] justify-around  border border-[#f1f2f6] shadow-3xl'>
        {icons.map((icon) => <img key={icon.id} src={icon.icon} alt='icon' onMouseDown={()=>handleClick(icon.id)} className={`${icon.id} cursor-pointer  w-16`}/> )}
      </div>
      <div className={`${pencilFlag ? "block" : "hidden"} absolute z-10 py-4 left-[25vw] top-32 bg-[#f1f2f6] w-32 rounded shadow-3xl`}>
        <div className="h-8 flex justify-center items-center">
          <input type="range" className="w-[80%]" min="2" max="10" value={pencilValue} onChange={(e)=>handlePencilValue(e)} />
        </div>
        <div className="h-[calc(100%-2rem)] flex flex-col justify-center items-center gap-4">
          <div onClick={()=>  setPencilColor('#000')} className="bg-black w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
          <div onClick={() => setPencilColor('red')} className="bg-red-500 w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
          <div onClick={() => setPencilColor('blue')} className="bg-blue-500 w-[1.5rem] h-8 rounded-[50%] cursor-pointer"></div>
        </div>
      </div>

      <div className={`${eraserFlag ? "flex" :"hidden"}  h-8 w-[7%] justify-center z-10 items-center absolute top-32 left-[35vw] bg-[#f1f2f6] shadow-3xl`}>
        <input className="w-[80%]" type="range" min="2" max="10" value={eraserValue} onChange={(e) => setEraserValue(e.target.value)} />
      </div>
      <Canvas
        strokeValue={strokeValue}
        strokeColor={strokeColor}
        trigger={trigger}
      />
    </>
  )
}

export default App
