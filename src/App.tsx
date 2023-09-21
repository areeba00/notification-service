import Applications from "./components/Applications/Application";
import Navbar from "./common/Navbar/Navbar";
import { useLocation } from "react-router-dom";

const App = () => {
  const { state } = useLocation();
  console.log("state", state);

  return (
    <div>
      <Navbar />
      <Applications locationState={state} />
    </div>
  );
};

export default App;
