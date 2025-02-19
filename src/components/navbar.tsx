import { Link } from "react-router-dom";
import { logoutUser } from "../api/auth";

const Navbar = () => {
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login"; // Redirect to login after logout
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">GMDC</h1>
      <div>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register" className="mr-4">Register</Link>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
