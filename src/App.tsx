import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import GujaratMap from "./components/map";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<GujaratMap/>}/>
      </Routes>
    </Router>
  );
};

export default App;
