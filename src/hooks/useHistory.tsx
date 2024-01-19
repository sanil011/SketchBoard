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


  const update = (url: string) => {
    setHistory((prev:historyProps) => {
      const newCanvasState = prev.canvasState.slice(0, prev.currentStateIndex + 1);
      newCanvasState.push(url);
      console.log({
        canvasState: newCanvasState,
        currentStateIndex: newCanvasState.length - 1,
      })
      return {
        canvasState: newCanvasState,
        currentStateIndex: newCanvasState.length - 1,
      };
    });
    console.log(history)
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