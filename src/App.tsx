import Login from "./components/LoginPage/Login";
import Applications from "./components/Applications/Application";
import Navbar from "./common/Navbar/Navbar";
import TabBar from "./common/TabBar/TabBar";

function App() {
  return (
    <div>
      <Navbar />
      <TabBar title={"APPLICATIONS"} />
      <Applications />
      {/* <TabBar title={"EVENTS"} /> */}
    </div>
  );
}

export default App;
