import { useState } from "react";
import { C } from "./constants.js";
import PortalHome from "./components/portal/PortalHome.jsx";
import ABLHub from "./components/abl/ABLHub.jsx";
import DongyangHub from "./components/dongyang/DongyangHub.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import FCDayScenario from "./components/portal/FCDayScenario.jsx";

export default function App() {
  const [page, setPage] = useState("portal");
  const [settings, setSettings] = useState({
    apiUrl: "https://api.anthropic.com/v1/messages",
    apiKey: "",
    model: "claude-sonnet-4-20250514",
  });

  return (
    <div style={{ fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,sans-serif", background: C.bg, minHeight: "100vh" }}>
      {page === "portal"   && <PortalHome onNavigate={setPage} />}
      {page === "scenario" && <FCDayScenario onBack={() => setPage("portal")} />}
      {page === "abl"      && <ABLHub settings={settings} onBack={() => setPage("portal")} />}
      {page === "dongyang" && <DongyangHub settings={settings} onBack={() => setPage("portal")} />}
      {page === "admin"    && <AdminDashboard onBack={() => setPage("portal")} />}
    </div>
  );
}
