import { NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { Compass, Heart, Map, UserCircle2 } from "lucide-react";

export function Shell({ children }: PropsWithChildren) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">H</span>
          <span>HopSpot</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/builder" className={navClass}>
            <Map size={16} /> Plan
          </NavLink>
          <NavLink to="/discover" className={navClass}>
            <Compass size={16} /> Discover
          </NavLink>
          <NavLink to="/wishlist" className={navClass}>
            <Heart size={16} /> Wishlist
          </NavLink>
          <NavLink to="/profile/charlene" className={navClass}>
            <UserCircle2 size={16} /> Profile
          </NavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}
