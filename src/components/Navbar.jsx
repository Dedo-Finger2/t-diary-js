import { NavLink } from "react-router";

export function Navbar() {
  return (
    <div>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
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
