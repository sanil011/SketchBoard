import { useState } from 'react'

const useHistory = () => {

  const [history, setHistory] = useState([[]]);
  const [index, setIndex] = useState(0);
  
  const setUpdate = (element:any, overwrite=false) => {
    const newElement = typeof element == "function" ? element(history[index]) : element;

    if (overwrite) {
      const historyCopy = [...history].slice(0, index + 1);
      historyCopy[index] = newElement;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newElement]);
      setIndex((prevState) => prevState + 1);
    }
  }

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);


  return {
    history:history[index],
    setUpdate,
    undo,
    redo
  }
}

export default useHistory