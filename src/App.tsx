import Applications from "./components/Applications/Application";
import Navbar from "./common/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import Footer from "./common/Footer/Footer";

const App = () => {
  const { state } = useLocation();
  console.log("state", state);

  return (
    <div>
      <Navbar />
      <Applications />
      <Footer />
    </div>
  );
};

export default App;
