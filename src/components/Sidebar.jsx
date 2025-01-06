import { BookOpen } from "lucide-react";
import { Cog } from "lucide-react";
import { Home, NotebookPenIcon } from "lucide-react";
import { NavLink } from "react-router";

export function Sidebar() {
  return (
    <div className="sidebar">
      <img
        src="https://i.pinimg.com/564x/05/6d/dc/056ddcd5f1938895ba991ea4ac5b4fc4.jpg"
        alt="yuta"
      />
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        <Home size={30} />
      </NavLink>{" "}
      <NavLink
        to="/today"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <NotebookPenIcon size={30} />
      </NavLink>{" "}
      <NavLink
        to="/pages"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <BookOpen size={30} />
      </NavLink>{" "}
      <NavLink
        to="/config"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <Cog size={30} />
      </NavLink>
    </div>
  );
}
