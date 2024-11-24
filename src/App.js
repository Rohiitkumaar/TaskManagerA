
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"; 
import TaskManager from "./components/TaskManager";
import Header from "./components/Header";

function App() {
  return (

    <Router>
    
    <Header/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path = "/taskmanager" element={<TaskManager/>} />
      </Routes>
    </Router>
  );
}

export default App;
