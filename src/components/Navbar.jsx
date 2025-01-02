import { NavLink } from "react-router";

export function Navbar() {
  return (
    <div>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>{" "}
      <NavLink
        to="/today"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Today&apos;s Diary
      </NavLink>{" "}
      <NavLink
        to="/pages"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Pages
      </NavLink>{" "}
      <NavLink
        to="/config"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Config
      </NavLink>
    </div>
  );
}
