import { RouterProvider } from "react-router-dom";
import "./pages/MainPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import root from "./router/root";

function App() {
  return <RouterProvider router={root} />;
}

export default App;
