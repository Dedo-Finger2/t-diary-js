import { BookOpen } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { Cog } from "lucide-react";
import { NavLink } from "react-router";
import { formatDateYYYYMMDD } from "../utils/format-date";

export function Sidebar() {
  const todayDate = formatDateYYYYMMDD(new Date().toLocaleDateString());
  const todayPage = todayDate + ".md";

  return (
    <div className="sidebar">
      <img
        src="https://i.pinimg.com/564x/05/6d/dc/056ddcd5f1938895ba991ea4ac5b4fc4.jpg"
        alt="yuta"
      />
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        <NotebookPen size={30} />
      </NavLink>{" "}
      <NavLink
        to={`/page/${todayPage}`}
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
