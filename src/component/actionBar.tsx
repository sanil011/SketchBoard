import { LuEraser } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import { LuImagePlus } from "react-icons/lu";
import { FaRegNoteSticky } from "react-icons/fa6";
import { Tools, ToolsType } from '../type';

type ActionBarProps = {
    tool: ToolsType;
    setTool: (tool: ToolsType) => void;
};

const ActionBar = ({ tool, setTool }: ActionBarProps) => {
  return (
      <div className="fixed left-[50%] z-10 top-5 flex justify-center translate-x-[-50%] border-2 rounded-lg p-2 gap-5 bg-white">
          {Object.values(Tools).map((t, index) => (
              <div
                  className={`relative cursor-pointer p-3 rounded-md transition-[background] hover:bg-[#e7e1fe] ${tool === t ? "bg-[#b3a1fc]" : "bg-white"}`}
                  key={t}
                  onClick={() => setTool(t)}
              >
                  <input
                      type="radio"
                      className="cursor-pointer hidden"
                      id={t}
                      checked={tool === t}
                      onChange={() => setTool(t)}
                      readOnly
                  />
                  <label style={{clip:"rect(0,0,0,0)"}} className="cursor-pointer absolute -w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden  border-0" htmlFor={t}>{t}</label>
                  {t === "download" && <LuDownload className='w-6 h-6 flex ' />}
                  {t === "pencil" && <LuPencil className='w-6 h-6 flex ' />}
                  {t === "photo" && <LuImagePlus className='w-6 h-6 flex ' />}
                  {t === "notes" && <FaRegNoteSticky className='w-6 h-6 flex ' />}
                  {t === "eraser" && <LuEraser className='w-6 h-6 flex ' />}
              </div>
          ))}
      </div>
  )
}

export default ActionBar
