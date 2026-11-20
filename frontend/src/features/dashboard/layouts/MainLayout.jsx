import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../authentication/context/AuthContext";
import { useTheme } from "../../../app/providers/ThemeProvider";
import NavbarCalendarPicker from "../components/NavbarCalendarPicker";
import "./MainLayout.css";

export function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Nutrition", path: "/nutrition" },
    { name: "Activity", path: "/activity" },
    { name: "AI Assistant", path: "/ai-assistant" },
    { name: "Community", path: "/community" },
    { name: "Chats", path: "/chats" }
  ];

  return (
    <div className="app-layout">
      <header className="top-navbar">
        {/* Actual FitCircle Logo placed cleanly without the FC square */}
        <NavLink to="/dashboard" className="brand" title="FitCircle Home">
          <img
            src="/images/fitcircle-logo.png"
            alt="FitCircle Logo"
            className="brand-logo-img"
          />
        </NavLink>

        {/* Main Navigation with Calendar placed right beside Chats */}
        <nav className="main-navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Calendar Picker right beside Chats */}
          <div className="nav-calendar-slot">
            <NavbarCalendarPicker />
          </div>
        </nav>

        {/* Right side actions */}
        <div className="navbar-actions">
          <button
            className="navbar-icon theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <NavLink
            to="/notifications"
            className="navbar-icon notification-btn"
            title="Notifications"
          >
            <span>🔔</span>
            <span className="notification-badge">3</span>
          </NavLink>

          <NavLink to="/settings" className="navbar-icon" title="Settings">
            <span>⚙️</span>
          </NavLink>

          <NavLink to="/profile" className="profile-pill" title="My Profile">
            <span className="user-name">{user?.displayName || "Member"}</span>
          </NavLink>

          <button className="logout-button" onClick={logout} title="Sign Out">
            Log Out
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
