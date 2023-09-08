import Login from "./components/LoginPage/Login";
import Applications from "./components/Applications/Application";
import Navbar from "./common/Navbar/Navbar";
import TabBar from "./common/TabBar/TabBar";
import Grid from "./common/Grid/Grid";
import Events from "./components/Events/Events";

function App() {
  return (
    <div>
      <Navbar />
      <TabBar title={"APPLICATIONS"} />
      <Applications />
      {/* <Events /> */}
    </div>
  );
}

export default App;
