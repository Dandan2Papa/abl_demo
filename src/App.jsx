import { useState } from "react";
import { C } from "./constants.js";
import { Header } from "./components/Header.jsx";
import { TabNav } from "./components/TabNav.jsx";
import { SettingsModal } from "./components/SettingsModal.jsx";
import { RiderDemo } from "./components/RiderDemo.jsx";
import { ChatbotDemo } from "./components/ChatbotDemo.jsx";
import { SalesScriptDemo } from "./components/SalesScriptDemo.jsx";
import { PlatformDemo } from "./components/PlatformDemo.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("rider");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    apiUrl: "https://api.anthropic.com/v1/messages",
    apiKey: "",
    model: "claude-sonnet-4-20250514",
  });

  return (
    <div style={{ fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,sans-serif", background: C.bg, minHeight: "100vh" }}>
      <Header onSettings={() => setShowSettings(true)} />
      <TabNav active={activeTab} setActive={setActiveTab} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 20px" }}>
        {activeTab === "rider"    && <RiderDemo      settings={settings} />}
        {activeTab === "chatbot"  && <ChatbotDemo    settings={settings} />}
        {activeTab === "script"   && <SalesScriptDemo settings={settings} />}
        {activeTab === "platform" && <PlatformDemo   settings={settings} />}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 24px", textAlign: "center", fontSize: 11, color: C.muted }}>
        AI Powered by 42Maru &nbsp;·&nbsp; 우리금융그룹 AI 영업지원 플랫폼 Demo v2.0
      </div>
      {showSettings && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
