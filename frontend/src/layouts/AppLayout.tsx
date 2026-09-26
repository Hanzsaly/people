import { Outlet } from "react-router-dom";
import RadialMenu from "../components/RadialMenu";
import "../styles/app-shell.scss";

function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-content">
        <Outlet />
      </div>
      <RadialMenu />
    </div>
  );
}

export default AppLayout;