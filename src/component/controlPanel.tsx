import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

const ControlPanel = () => {
  return (
      <div className="fixed  z-10 top-[94%] left-10 flex justify-center  rounded-lg p-2 gap-5 bg-[#e7e1fe]">
          <RiSubtractFill />
          <IoMdAdd/>
    </div>
  )
}

export default ControlPanel