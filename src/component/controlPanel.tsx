import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";
import { RxQuestionMarkCircled } from "react-icons/rx";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";


interface controlPanelProps{
  scale: number;
  setScale: (scale: number) => void;
  undo: () => void;
  redo: () => void;
  onZoom: (value: number) => void;
  onOpen: () => void;
}

const ControlPanel = ({ scale, setScale, onZoom,undo,redo }:controlPanelProps) => {


  return (
    <div className="fixed  z-10 top-[94%]   left-10 flex justify-between items-center gap-10">
      <div className="flex items-center gap-10">
      <div className="bg-[#e7e1fe] rounded-lg p-2 gap-6 flex justify-between items-center">
      <Tippy content="Zoom Out">
        <button onClick={() => onZoom(-0.1)}>
            <RiSubtractFill className="text-xl" />
        </button>
      </Tippy>

      <Tippy content="Set to 100%">
        <button onClick={() => setScale(1)}>
          {new Intl.NumberFormat("en-GB", { style: "percent" }).format(
            scale
          )}
        </button>
      </Tippy>
      <Tippy content="Zoom In">
        <button onClick={() => onZoom(0.1)}>
            <IoMdAdd className="text-xl" />
        </button>
      </Tippy>
      </div>

      <div className="bg-[#e7e1fe] rounded-lg p-[10px] gap-8 flex justify-between items-center">
        <Tippy content="Undo">
          <button onClick={() => undo()}>
            <GrUndo className="text-xl" />
          </button>
        </Tippy>
        <Tippy content="Redo">
          <button onClick={() => redo()}>
            <GrRedo className="text-xl" />
          </button>
        </Tippy>
      </div>
      </div>

     



      
    </div>
  )
}

export default ControlPanel