import React, { useState } from "react";
import { C } from "../../constants.js";

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("서비스 현황");
  const [guardRails, setGuardRails] = useState({
    piiMasking: true,
    hallucination: true,
    hallucinationThreshold: 85,
    forbiddenWords: ["경쟁사명", "비하표현", "기밀정보"],
    auditLog: true,
    sensitivityLevel: 2,
  });

  // Stat cards data
  const stats = [
    { label: "총 에이전트", value: "17개", trend: "+3" },
    { label: "활성 사용자", value: "1,440명", subtext: "(DAU 892)" },
    { label: "일 평균 질의", value: "3,200건", trend: "→" },
    { label: "평균 만족도", value: "4.2/5.0", trend: "↑" },
  ];

  // Service status table data
  const services = [
    {
      company: "동양생명",
      name: "동양생명 AI 상담사",
      status: "운영중",
      statusColor: "🟢",
      users: 720,
      queries: 1850,
      satisfaction: 4.3,
    },
    {
      company: "ABL생명",
      name: "ABL 고객 지원 AI",
      status: "운영중",
      statusColor: "🟢",
      users: 580,
      queries: 1120,
      satisfaction: 4.1,
    },
    {
      company: "우리금융그룹",
      name: "내부 업무 지원 AI",
      status: "테스트중",
      statusColor: "🟡",
      users: 140,
      queries: 230,
      satisfaction: 3.9,
    },
  ];

  // User management table data
  const users = [
    {
      id: 1,
      name: "김관리",
      company: "우리금융그룹",
      department: "AI전략팀",
      role: "관리자",
      status: "활성",
      lastAccess: "2026-04-11 09:30",
    },
    {
      id: 2,
      name: "이운영",
      company: "동양생명",
      department: "고객서비스",
      role: "일반",
      status: "활성",
      lastAccess: "2026-04-11 08:15",
    },
    {
      id: 3,
      name: "박개발",
      company: "ABL생명",
      department: "IT개발팀",
      role: "개발자",
      status: "활성",
      lastAccess: "2026-04-10 17:45",
    },
    {
      id: 4,
      name: "최팀장",
      company: "동양생명",
      department: "경영진",
      role: "관리자",
      status: "활성",
      lastAccess: "2026-04-11 10:00",
    },
    {
      id: 5,
      name: "정사원",
      company: "ABL생명",
      department: "업무지원",
      role: "일반",
      status: "활성",
      lastAccess: "2026-04-09 14:20",
    },
    {
      id: 6,
      name: "장개발",
      company: "우리금융그룹",
      department: "기술팀",
      role: "개발자",
      status: "휴면",
      lastAccess: "2026-03-25 11:00",
    },
    {
      id: 7,
      name: "신담당",
      company: "동양생명",
      department: "상품개발",
      role: "일반",
      status: "활성",
      lastAccess: "2026-04-11 09:00",
    },
    {
      id: 8,
      name: "임전문가",
      company: "ABL생명",
      department: "고객접점",
      role: "일반",
      status: "활성",
      lastAccess: "2026-04-11 15:30",
    },
    {
      id: 9,
      name: "오엔지니어",
      company: "우리금융그룹",
      department: "인프라팀",
      role: "개발자",
      status: "활성",
      lastAccess: "2026-04-10 16:45",
    },
    {
      id: 10,
      name: "유운영자",
      company: "동양생명",
      department: "운영팀",
      role: "관리자",
      status: "활성",
      lastAccess: "2026-04-11 08:30",
    },
  ];

  // LLM Models data
  const models = [
    {
      name: "GPT-4o",
      provider: "Azure OpenAI",
      deployment: "50 PTU",
      type: "외부업무용",
      status: "운영중",
      usage: "1,250/일",
    },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      deployment: "API",
      type: "내부 테스트",
      status: "테스트중",
      usage: "420/일",
    },
    {
      name: "HyperCLOVA X",
      provider: "Naver",
      deployment: "On-Premise",
      type: "보안업무",
      status: "운영중",
      usage: "880/일",
    },
    {
      name: "Llama 3.1 70B",
      provider: "Meta",
      deployment: "오픈소스",
      type: "개발/테스트",
      status: "개발중",
      usage: "150/일",
    },
  ];

  // Violation log
  const violations = [
    {
      id: 1,
      time: "2026-04-11 14:23",
      type: "개인정보 감지",
      user: "이운영",
      company: "동양생명",
      detail: "주민번호 형식 패턴 감지",
      action: "마스킹 처리됨",
    },
    {
      id: 2,
      time: "2026-04-11 11:05",
      type: "금지어 필터",
      user: "박개발",
      company: "ABL생명",
      detail: "경쟁사명 언급 시도",
      action: "필터링됨",
    },
    {
      id: 3,
      time: "2026-04-10 16:42",
      type: "신뢰도 낮음",
      user: "정사원",
      company: "ABL생명",
      detail: "응답 신뢰도 65% (임계값 미만)",
      action: "경고 전송",
    },
    {
      id: 4,
      time: "2026-04-10 13:18",
      type: "접근 제한",
      user: "신담당",
      company: "동양생명",
      detail: "Level 3 민감정보 접근 시도",
      action: "접근 거부됨",
    },
    {
      id: 5,
      time: "2026-04-09 10:55",
      type: "개인정보 감지",
      user: "임전문가",
      company: "ABL생명",
      detail: "전화번호 형식 패턴 감지",
      action: "마스킹 처리됨",
    },
  ];

  const renderServiceStatus = () => (
    <div style={styles.tabContent}>
      {/* Stat Cards */}
      <div style={styles.statCardsContainer}>
        {stats.map((stat, idx) => (
          <div key={idx} style={styles.statCard}>
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={styles.statValue}>{stat.value}</div>
            {stat.subtext && <div style={styles.statSubtext}>{stat.subtext}</div>}
            {stat.trend && <div style={styles.statTrend}>{stat.trend}</div>}
          </div>
        ))}
      </div>

      {/* Service Status Table */}
      <div style={styles.tableContainer}>
        <h3 style={styles.sectionTitle}>서비스별 현황</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>회사</th>
              <th style={styles.tableCell}>서비스명</th>
              <th style={styles.tableCell}>상태</th>
              <th style={styles.tableCell}>사용자</th>
              <th style={styles.tableCell}>일 질의</th>
              <th style={styles.tableCell}>만족도</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc, idx) => (
              <tr key={idx} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={styles.tableCell}>{svc.company}</td>
                <td style={styles.tableCell}>{svc.name}</td>
                <td style={styles.tableCell}>
                  <span style={styles.statusBadge}>
                    {svc.statusColor} {svc.status}
                  </span>
                </td>
                <td style={styles.tableCell}>{svc.users}</td>
                <td style={styles.tableCell}>{svc.queries}</td>
                <td style={styles.tableCell}>{svc.satisfaction.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div style={styles.tabContent}>
      <div style={styles.buttonBar}>
        <button style={styles.primaryButton}>+ 사용자 추가</button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>이름</th>
              <th style={styles.tableCell}>회사</th>
              <th style={styles.tableCell}>부서</th>
              <th style={styles.tableCell}>역할</th>
              <th style={styles.tableCell}>상태</th>
              <th style={styles.tableCell}>마지막 접속</th>
              <th style={styles.tableCell}>권한 설정</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={styles.tableCell}>{user.name}</td>
                <td style={styles.tableCell}>{user.company}</td>
                <td style={styles.tableCell}>{user.department}</td>
                <td style={styles.tableCell}>{user.role}</td>
                <td style={styles.tableCell}>
                  <span style={{ ...styles.statusBadge, color: user.status === "활성" ? "#27ae60" : "#95a5a6" }}>
                    {user.status}
                  </span>
                </td>
                <td style={styles.tableCell}>{user.lastAccess}</td>
                <td style={styles.tableCell}>
                  <select style={styles.select} defaultValue={user.role}>
                    <option>관리자</option>
                    <option>일반</option>
                    <option>개발자</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModelManagement = () => (
    <div style={styles.tabContent}>
      <div style={styles.buttonBar}>
        <button style={styles.primaryButton}>+ 모델 추가</button>
      </div>

      <div style={styles.modelsGrid}>
        {models.map((model, idx) => (
          <div key={idx} style={styles.modelCard}>
            <h3 style={styles.modelName}>{model.name}</h3>
            <div style={styles.modelDetail}>
              <strong>Provider:</strong> {model.provider}
            </div>
            <div style={styles.modelDetail}>
              <strong>Deployment:</strong> {model.deployment}
            </div>
            <div style={styles.modelDetail}>
              <strong>Type:</strong> {model.type}
            </div>
            <div style={styles.modelDetail}>
              <strong>Status:</strong>{" "}
              <span style={styles.statusBadge}>
                {model.status === "운영중" ? "🟢" : model.status === "테스트중" ? "🟡" : "🔵"} {model.status}
              </span>
            </div>
            <div style={styles.modelDetail}>
              <strong>Daily Usage:</strong> {model.usage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div style={styles.tabContent}>
      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>
          기간 선택:
          <select style={styles.select}>
            <option>7일</option>
            <option>30일</option>
            <option>90일</option>
          </select>
        </label>
        <label style={styles.filterLabel}>
          회사 선택:
          <select style={styles.select}>
            <option>전체</option>
            <option>동양생명</option>
            <option>ABL생명</option>
            <option>우리금융그룹</option>
          </select>
        </label>
      </div>

      {/* Daily Query Bar Chart */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>일별 질의 건수 (7일)</h3>
        <div style={styles.barChartContainer}>
          {["월", "화", "수", "목", "금", "토", "일"].map((day, idx) => {
            const heights = [85, 92, 78, 88, 95, 72, 68];
            return (
              <div key={idx} style={styles.barWrapper}>
                <div style={{ ...styles.bar, height: `${heights[idx] * 2}px` }}></div>
                <div style={styles.barLabel}>{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Usage Pie Chart */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>서비스별 사용 비율</h3>
        <div style={styles.horizontalBars}>
          <div style={styles.barRow}>
            <span style={{ width: "120px" }}>동양생명</span>
            <div style={{ ...styles.horizontalBar, width: "60%", backgroundColor: "#1A2E4A" }}></div>
            <span>57.8%</span>
          </div>
          <div style={styles.barRow}>
            <span style={{ width: "120px" }}>ABL생명</span>
            <div style={{ ...styles.horizontalBar, width: "35%", backgroundColor: "#3498db" }}></div>
            <span>35.1%</span>
          </div>
          <div style={styles.barRow}>
            <span style={{ width: "120px" }}>우리금융그룹</span>
            <div style={{ ...styles.horizontalBar, width: "7%", backgroundColor: "#95a5a6" }}></div>
            <span>7.1%</span>
          </div>
        </div>
      </div>

      {/* Satisfaction Trend */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>만족도 추이</h3>
        <div style={styles.trendContainer}>
          {[4.0, 4.1, 4.15, 4.2, 4.18, 4.2, 4.25].map((score, idx) => (
            <div key={idx} style={styles.trendItem}>
              <div style={styles.trendScore}>{score.toFixed(2)}</div>
              <div style={styles.trendLabel}>Day {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIGuardRails = () => (
    <div style={styles.tabContent}>
      <div style={styles.guardrailsContainer}>
        {/* PII Masking */}
        <div style={styles.guardrailItem}>
          <div style={styles.guardrailLabel}>개인정보 마스킹</div>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: guardRails.piiMasking ? "#27ae60" : "#bdc3c7",
            }}
            onClick={() => setGuardRails({ ...guardRails, piiMasking: !guardRails.piiMasking })}
          >
            {guardRails.piiMasking ? "ON" : "OFF"}
          </button>
          <div style={styles.guardrailNote}>주민번호, 계좌번호, 전화번호</div>
        </div>

        {/* Hallucination Prevention */}
        <div style={styles.guardrailItem}>
          <div style={styles.guardrailLabel}>할루시네이션 방지</div>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              min="70"
              max="95"
              value={guardRails.hallucinationThreshold}
              onChange={(e) =>
                setGuardRails({ ...guardRails, hallucinationThreshold: parseInt(e.target.value) })
              }
              style={styles.slider}
            />
            <span style={styles.sliderValue}>{guardRails.hallucinationThreshold}%</span>
          </div>
          <div style={styles.guardrailNote}>신뢰도 임계값 설정</div>
        </div>

        {/* Forbidden Words Filter */}
        <div style={styles.guardrailItem}>
          <div style={styles.guardrailLabel}>금지어 필터</div>
          <div style={styles.tagList}>
            {guardRails.forbiddenWords.map((word, idx) => (
              <span key={idx} style={styles.tag}>
                {word}
                <button
                  style={styles.tagRemove}
                  onClick={() =>
                    setGuardRails({
                      ...guardRails,
                      forbiddenWords: guardRails.forbiddenWords.filter((_, i) => i !== idx),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={styles.guardrailNote}>필터 대상: {guardRails.forbiddenWords.join(", ")}</div>
        </div>

        {/* Audit Log */}
        <div style={styles.guardrailItem}>
          <div style={styles.guardrailLabel}>답변 감사 로그</div>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: guardRails.auditLog ? "#27ae60" : "#bdc3c7",
            }}
            onClick={() => setGuardRails({ ...guardRails, auditLog: !guardRails.auditLog })}
          >
            {guardRails.auditLog ? "ON" : "OFF"}
          </button>
          <div style={styles.guardrailNote}>모든 답변 기록 저장</div>
        </div>

        {/* Sensitivity Level */}
        <div style={styles.guardrailItem}>
          <div style={styles.guardrailLabel}>민감정보 접근 등급</div>
          <div style={styles.levelSelector}>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                style={{
                  ...styles.levelButton,
                  backgroundColor: guardRails.sensitivityLevel === level ? "#1A2E4A" : "#ecf0f1",
                  color: guardRails.sensitivityLevel === level ? "#fff" : "#000",
                }}
                onClick={() => setGuardRails({ ...guardRails, sensitivityLevel: level })}
              >
                Level {level}
              </button>
            ))}
          </div>
          <div style={styles.guardrailNote}>현재: Level {guardRails.sensitivityLevel}</div>
        </div>
      </div>

      {/* Violation Log */}
      <div style={styles.tableContainer}>
        <h3 style={styles.sectionTitle}>최근 위반 로그</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>시간</th>
              <th style={styles.tableCell}>유형</th>
              <th style={styles.tableCell}>사용자</th>
              <th style={styles.tableCell}>회사</th>
              <th style={styles.tableCell}>상세</th>
              <th style={styles.tableCell}>조치</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v, idx) => (
              <tr key={v.id} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={styles.tableCell}>{v.time}</td>
                <td style={styles.tableCell}>{v.type}</td>
                <td style={styles.tableCell}>{v.user}</td>
                <td style={styles.tableCell}>{v.company}</td>
                <td style={styles.tableCell}>{v.detail}</td>
                <td style={styles.tableCell}>{v.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = ["서비스 현황", "사용자 관리", "모델 관리", "통계", "AI 가드레일"];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← 포털
        </button>
        <div style={styles.headerTitle}>
          <h1 style={styles.mainTitle}>시스템 관리자</h1>
          <p style={styles.subtitle}>우리금융그룹 AI 플랫폼 관리</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              borderBottom: activeTab === tab ? "3px solid #1A2E4A" : "none",
              color: activeTab === tab ? "#1A2E4A" : "#7f8c8d",
              fontWeight: activeTab === tab ? "600" : "400",
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "서비스 현황" && renderServiceStatus()}
      {activeTab === "사용자 관리" && renderUserManagement()}
      {activeTab === "모델 관리" && renderModelManagement()}
      {activeTab === "통계" && renderStatistics()}
      {activeTab === "AI 가드레일" && renderAIGuardRails()}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#1A2E4A",
    fontSize: "16px",
    cursor: "pointer",
    marginRight: "20px",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  headerTitle: {
    flex: 1,
  },
  mainTitle: {
    margin: "0",
    fontSize: "24px",
    color: "#1A2E4A",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#7f8c8d",
  },
  tabNav: {
    display: "flex",
    gap: "0px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    marginBottom: "20px",
    borderRadius: "8px 8px 0 0",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    padding: "15px 20px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
    textAlign: "center",
  },
  tabContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  statCardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    borderLeft: "4px solid #1A2E4A",
  },
  statLabel: {
    fontSize: "12px",
    color: "#7f8c8d",
    marginBottom: "8px",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "28px",
    color: "#1A2E4A",
    fontWeight: "600",
    marginBottom: "4px",
  },
  statSubtext: {
    fontSize: "12px",
    color: "#95a5a6",
  },
  statTrend: {
    fontSize: "14px",
    color: "#27ae60",
    marginTop: "8px",
    fontWeight: "500",
  },
  tableContainer: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "16px",
    color: "#1A2E4A",
    marginBottom: "15px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  tableHeader: {
    backgroundColor: "#1A2E4A",
    color: "#fff",
  },
  tableCell: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #e0e0e0",
  },
  tableRow: {
    transition: "background 0.2s",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  buttonBar: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
  },
  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#1A2E4A",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "12px",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  modelsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  modelCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  modelName: {
    margin: "0 0 12px 0",
    fontSize: "16px",
    color: "#1A2E4A",
    fontWeight: "600",
  },
  modelDetail: {
    margin: "8px 0",
    fontSize: "12px",
    color: "#555",
  },
  filterBar: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
  },
  filterLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "500",
  },
  chartContainer: {
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
  },
  chartTitle: {
    margin: "0 0 20px 0",
    fontSize: "14px",
    color: "#1A2E4A",
    fontWeight: "600",
  },
  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: "200px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    marginX: "5px",
  },
  bar: {
    width: "30px",
    backgroundColor: "#1A2E4A",
    borderRadius: "4px 4px 0 0",
    margin: "0 5px",
  },
  barLabel: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#555",
  },
  horizontalBars: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  horizontalBar: {
    height: "25px",
    borderRadius: "4px",
  },
  trendContainer: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px",
  },
  trendItem: {
    textAlign: "center",
    flex: 1,
  },
  trendScore: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A2E4A",
    marginBottom: "5px",
  },
  trendLabel: {
    fontSize: "11px",
    color: "#7f8c8d",
  },
  guardrailsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  guardrailItem: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  guardrailLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A2E4A",
    marginBottom: "10px",
  },
  toggleButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "background 0.2s",
  },
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  slider: {
    flex: 1,
    cursor: "pointer",
  },
  sliderValue: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1A2E4A",
    minWidth: "45px",
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "10px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    backgroundColor: "#1A2E4A",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "12px",
  },
  tagRemove: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "1",
    padding: "0",
  },
  guardrailNote: {
    fontSize: "11px",
    color: "#7f8c8d",
    marginTop: "8px",
  },
  levelSelector: {
    display: "flex",
    gap: "8px",
  },
  levelButton: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};
