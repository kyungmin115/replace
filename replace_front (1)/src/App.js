import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import root from "./router/root";

function App() {
	return <RouterProvider router={root} />;
}

export default App;
