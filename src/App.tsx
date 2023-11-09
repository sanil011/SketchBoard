
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home";
import Draw from "./pages/draw";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<Home/> ,
    },
    {
      path: "/draw",
      element:<Draw/> ,
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
