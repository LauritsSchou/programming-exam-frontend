import { NavLink } from "react-router-dom";
import "../styling/navbar.css";

export default function NavHeader() {
  return (
    <nav className="navbar navbar-style">
      <ul className="navbar-list">
        <li className="navbar-items">
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/athletes">Athletes</NavLink>
        </li>
        <li>
          <NavLink to="/results">Results</NavLink>
        </li>
      </ul>
    </nav>
  );
}
