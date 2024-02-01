import { useState } from 'react'

interface historyProps{
  canvasState: string[];
  currentStateIndex:number
}
const useHistory = () => {

  const [history, setHistory] = useState<historyProps>({
    canvasState: [],
    currentStateIndex: -1,
  });

  
  const update = (element:any, overwrite = false) => {
    if (overwrite) {
      const copy = [...history.canvasState];
      copy[element.id - 1] = element;
      const copyState = history.currentStateIndex;
      setHistory({
        canvasState: copy,
        currentStateIndex:copyState
      })
    } else {   
      setHistory((prev:historyProps) => {
        const newCanvasState = prev.canvasState.slice(0, prev.currentStateIndex + 1);
        newCanvasState.push(element);
        return {
          canvasState: newCanvasState,
          currentStateIndex: newCanvasState.length - 1,
        };
      });
    }
  }

  const undo = (history:historyProps) => {
      if (history.currentStateIndex <= 0) {
        return null;
      }

      const newIndex = history.currentStateIndex - 1;
      const url = history.canvasState[newIndex];

      setHistory(prev => ({
        ...prev, // This line preserves the existing canvasState
        currentStateIndex: newIndex,
      }));

      return url;
  };

  const redo = (history:historyProps) => {
    if (history.currentStateIndex >= history.canvasState.length - 1) {
      return null;
    }

    const newIndex = history.currentStateIndex + 1;
    const url = history.canvasState[newIndex];

    setHistory(prev => ({
      ...prev,
      currentStateIndex: newIndex,
    }));

    return url;
  };


  return {
    history,
    update,
    undo,
    redo
  }
}

export default useHistory