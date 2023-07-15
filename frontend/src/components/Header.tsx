import { NavLink } from "react-router-dom";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Header() {
  const { pathname } = useLocation();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({
      username: "",
      email: "",
      isLoggedIn: false,
      accessToken: "",
    });
    await api.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/");
  };

  return (
    <header className="w-full p-2 bg-slate-50 flex items-center justify-end">
      {pathname === "/" && <NavLink to={"/register"}>Register</NavLink>}
      {pathname === "/register" && <NavLink to={"/"}>Login</NavLink>}
      {["/home", "/dashboard"].includes(pathname) && (
        <nav className="space-x-6 > * + *">
          <NavLink to={"/home"}>Home</NavLink>
          <NavLink to={"/dashboard"}>Dashboard</NavLink>
          <button onClick={logout}>Logout</button>
        </nav>
      )}
    </header>
  );
}
