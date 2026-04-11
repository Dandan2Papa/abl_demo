import React, { useEffect, useState } from "react";
import { C } from "../../constants.js";

const PortalHome = ({ onNavigate }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#FAFBFC",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Animated Gradient Background Bar */}
      <div
        style={{
          height: "4px",
          background: `linear-gradient(90deg, ${C.navy} 0%, ${C.dong} 100%)`,
          animation: "slideIn 1s ease-out",
        }}
      />

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 40px 60px",
          textAlign: "center",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: C.navy,
            margin: "0 0 20px 0",
            letterSpacing: "-0.5px",
          }}
        >
          우리금융그룹 생성형 AI 플랫폼
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#5A6B7A",
            margin: "0",
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          동양생명 · ABL생명의 업무 혁신을 위한 통합 AI 서비스
        </p>

        {/* FC의 하루 CTA 버튼 */}
        <div style={{ marginTop: "36px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => onNavigate("scenario")}
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
              color: "white",
              border: "2px solid #1D4ED8",
              borderRadius: "12px",
              padding: "16px 32px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 30px rgba(29,78,216,0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(29,78,216,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(29,78,216,0.25)"; }}
          >
            <span style={{ fontSize: "20px" }}>▶</span>
            <div style={{ textAlign: "left" }}>
              <div>FC의 하루 데모 시나리오 보기</div>
              <div style={{ fontSize: "11px", fontWeight: 400, color: "#93C5FD", marginTop: "2px" }}>
                현장의 3가지 Pain Point · AI 솔루션 실시간 시연
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Company Cards */}
      <section
        style={{
          padding: "40px 40px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          maxWidth: "1200px",
          margin: "0 auto",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.2s",
        }}
      >
        {/* 동양생명 Card */}
        <div
          onClick={() => onNavigate("dongyang")}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            cursor: "pointer",
            border: `3px solid ${C.dong}`,
            transition: "all 0.3s ease-out",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 102, 179, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "32px", fontWeight: 700, color: C.dong, margin: "0 0 8px 0" }}>
              동양생명
            </h3>
            <p style={{ fontSize: "14px", color: "#8A95A3", margin: 0, fontWeight: 500 }}>
              7개 AI 서비스
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["상품약관 Q&A", "보험금청구 Q&A", "언더라이팅 Q&A", "고객대응 Q&A", "AI Playground", "보장분석 스크립트"].map((service, idx) => (
                <span key={idx} style={{ display: "inline-block", padding: "6px 12px", background: `${C.dong}15`, color: C.dong, borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#8A95A3", margin: "24px 0", lineHeight: 1.6, fontWeight: 500 }}>
            사용자 1,190명 · 내부업무용 On-Premise · 외부업무용 Cloud
          </p>

          <button
            onClick={() => onNavigate("dongyang")}
            style={{ width: "100%", padding: "14px", background: C.dong, color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "background 0.3s ease-out" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0052A3"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.dong; }}
          >
            시작하기 →
          </button>
        </div>

        {/* ABL생명 Card */}
        <div
          onClick={() => onNavigate("abl")}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            cursor: "pointer",
            border: `3px solid ${C.abl}`,
            transition: "all 0.3s ease-out",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(200, 0, 28, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "32px", fontWeight: 700, color: C.abl, margin: "0 0 8px 0" }}>
              ABL
            </h3>
            <p style={{ fontSize: "14px", color: "#8A95A3", margin: 0, fontWeight: 500 }}>
              4개 AI 서비스 + 6개 AI Agent
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["보험상품 지식 Agent", "영업지원 스크립트", "업무지원 AI Assistant", "API Hub"].map((service, idx) => (
                <span key={idx} style={{ display: "inline-block", padding: "6px 12px", background: `${C.abl}15`, color: C.abl, borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#8A95A3", margin: "24px 0", lineHeight: 1.6, fontWeight: 500 }}>
            생성형 AI 플랫폼 · On-Premise · API Hub 구축
          </p>

          <button
            onClick={() => onNavigate("abl")}
            style={{ width: "100%", padding: "14px", background: C.abl, color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "background 0.3s ease-out" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#A90019"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.abl; }}
          >
            시작하기 →
          </button>
        </div>
      </section>

      {/* Platform Features */}
      <section
        style={{
          padding: "60px 40px",
          background: "#F5F7FA",
          marginTop: "40px",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.4s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: C.navy, textAlign: "center", margin: "0 0 48px 0" }}>
            우리금융 AI 플랫폼의 핵심 기능
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
            {[
              { title: "멀티 LLM 지원", desc: "GPT-4o, Claude, HyperCLOVA X 등 최신 언어모델 통합 지원" },
              { title: "통합 RAG 엔진", desc: "42Maru 자체 RAG, 문서 구조화, 정확한 답변 하이라이트" },
              { title: "AI 가드레일", desc: "보험업 특화 필터링, 개인정보 자동 마스킹, 할루시네이션 방지" },
            ].map((feature, idx) => (
              <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.navy, margin: "0 0 16px 0" }}>{feature.title}</h3>
                <p style={{ fontSize: "14px", color: "#6B7A8A", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          padding: "60px 40px",
          background: "white",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.6s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "32px", textAlign: "center" }}>
          {[
            { label: "총 AI 에이전트", value: "17개" },
            { label: "활성 사용자", value: "1,440명+" },
            { label: "처리 문서", value: "10,000건+" },
            { label: "평균 응답시간", value: "2.3초" },
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{ fontSize: "36px", fontWeight: 700, color: C.navy, marginBottom: "8px" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#8A95A3", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Link & Footer */}
      <section
        style={{
          padding: "40px 40px 60px",
          background: "#FAFBFC",
          textAlign: "center",
          borderTop: "1px solid #E6EAEF",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.8s",
        }}
      >
        <button
          onClick={() => onNavigate("admin")}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            color: "#5A6B7A",
            cursor: "pointer",
            textDecoration: "none",
            fontWeight: 500,
            marginBottom: "24px",
            transition: "color 0.3s ease-out",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.navy; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#5A6B7A"; }}
        >
          관리자 대시보드 →
        </button>

        <footer style={{ fontSize: "12px", color: "#A5B3BE", fontWeight: 400, margin: 0 }}>
          AI Powered by 42Maru · 우리금융그룹 AI 플랫폼 v3.0
        </footer>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PortalHome;
