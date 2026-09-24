import { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { ROLE_TEXT, useRoleStore, type Role } from "./stores/RoleStore";
import { DashboardPage } from "./pages/DashboardPage";
import { DevicesPage } from "./pages/DevicesPage";
import { TasksPage } from "./pages/TasksPage";
import { HazardsPage } from "./pages/HazardsPage";
import { ReportsPage } from "./pages/ReportsPage";
import "./styles.css";

function RoleSwitcher() {
  const role = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);
  return (
    <label className="role-switcher">
      当前角色
      <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
        {(Object.keys(ROLE_TEXT) as Role[]).map((value) => (
          <option key={value} value={value}>
            {ROLE_TEXT[value]}
          </option>
        ))}
      </select>
    </label>
  );
}

const PAGES: Record<string, () => JSX.Element> = {
  "/dashboard": DashboardPage,
  "/devices": DevicesPage,
  "/tasks": TasksPage,
  "/hazards": HazardsPage,
  "/reports": ReportsPage
};

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const Page = PAGES[active] ?? DashboardPage;
  return (
    <div className="shell">
      <aside>
        <div className="brand">消防设施巡检维保平台</div>
        <nav>
          {routes.map((route) => (
            <button
              key={route.route}
              className={active === route.route ? "active" : ""}
              onClick={() => setActive(route.route)}
            >
              {route.name}
            </button>
          ))}
        </nav>
        <RoleSwitcher />
      </aside>
      <main className="page">
        <Page />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
