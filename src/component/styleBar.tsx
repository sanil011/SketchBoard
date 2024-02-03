import { Slider } from "@nextui-org/react";

interface styleBarProps {
    strokeColor: string;
    setStrokeColor: (value:string)=>void;
    strokeValue: number;
    setStrokeValue: (value: number | number[]) => void;
    eraserValue: number;
    setEraserValue: (value: number | number[]) => void;
}
const StyleBar = ({ strokeColor,setStrokeColor, setStrokeValue, strokeValue,eraserValue,setEraserValue }: styleBarProps) => {
    const colors = ["#E03132", "#000000", "#2F9E44", "#1A71C2", "#F08C01"]
  return (
      <div className="fixed  z-10 top-[15%] w-[180px] left-10 p-2 border-2 rounded-lg bg-white">
          <h1 className="text-sm text-opacity-80">Stroke Color</h1>
          <div className="flex items-center justify-between">
          <div className="flex gap-2 my-2">     
                  {colors?.map((color) => 
                      <div className={`w-5 h-5 flex justify-center items-center rounded-sm  ${strokeColor == color ? "border border-blue-500  " : "border"}`}>            
              <button onClick={() => setStrokeColor(color)} key={color} style={{ backgroundColor: color }} className={`w-4 h-4 rounded-sm`}>
                  </button>
              </div>
              )
                  }
          </div>
              <hr className="h-7 bg-[#F1F2F6] w-[2px]"/>
              <div style={{ backgroundColor: strokeColor }} className={`w-4 h-4 rounded-sm`}>
                  
              </div>
          </div>
      
          <Slider
              label="Stroke Width"
              size='sm'
              step={2}
              hideValue={true}
              maxValue={30}
              minValue={4}
              defaultValue={strokeValue}
              className="max-w-md mt-3"
              disableThumbScale={true}
              onChange={(val)=>setStrokeValue(val)}
          />
          <Slider
              label="Eraser Width"
              step={2}
              size='sm'
              hideValue={true}
              maxValue={30}
              minValue={4}
              defaultValue={eraserValue}
              className="max-w-md mt-3"
              disableThumbScale={true}
              onChange={(val) => setEraserValue(val)}
          />
      </div>
  )
}

export default StyleBar