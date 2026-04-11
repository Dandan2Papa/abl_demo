import React, { useState, useRef, useEffect } from "react";
import { C } from "../../constants.js";
import { callLLM } from "../../api.js";

const ABLHub = ({ settings, onBack }) => {
  const [activeTab, setActiveTab] = useState("knowledge");

  // ============ TAB: Knowledge Agent ============
  const KnowledgeAgent = () => {
    const [messages, setMessages] = useState([
      {
        id: 1,
        type: "assistant",
        text: "ABL생명 보험상품 약관 AI Agent입니다. 약관, 기초서류, 사업방법서에 대해 질문해 주세요.",
        sources: null,
      },
    ]);
    const [input, setInput] = useState("");
    const [expandedFolders, setExpandedFolders] = useState({
      약관: true,
      기초서류: false,
      사업방법서: false,
    });
    const [selectedVersion, setSelectedVersion] = useState("2025년 1월 v3.2");
    const [compareDoc1, setCompareDoc1] = useState("");
    const [compareDoc2, setCompareDoc2] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const folders = {
      약관: ["일반암진단특약D.pdf", "더보장종합건강보험.pdf", "특정질병사망보장특약.pdf"],
      기초서류: ["상품설명서.pdf", "약관해설서.pdf"],
      사업방법서: ["ABL_사업방법서_2025.pdf"],
    };

    const sampleQuestions = [
      "일반암 진단특약D 보장 한도는?",
      "THE 더보장종합건강보험 해약환급금 계산 방법",
      "갱신형과 비갱신형 차이점 비교",
    ];

    const toggleFolder = (folder) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [folder]: !prev[folder],
      }));
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
      if (!input.trim()) return;

      const userMsg = {
        id: messages.length + 1,
        type: "user",
        text: input,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const response = await callLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an ABL생명 insurance product knowledge agent. Answer questions about insurance policies, documents, and coverage terms. When providing answers, include relevant document sources.",
            },
            { role: "user", content: input },
          ],
          settings,
        });

        const assistantMsg = {
          id: messages.length + 2,
          type: "assistant",
          text: response,
          sources: {
            document: "약관집_2025_v3.2",
            page: "42-45",
            excerpt: "해당 보장사항에 대한 구체적 내용...",
          },
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const errorMsg = {
          id: messages.length + 2,
          type: "assistant",
          text: "죄송합니다. 질문을 처리하는 중에 오류가 발생했습니다.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ display: "flex", height: "calc(100vh - 200px)" }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: "250px",
            borderRight: "1px solid #DEE2E8",
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#F3F5F8",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
              지식베이스
            </div>
            {Object.keys(folders).map((folder) => (
              <div key={folder} style={{ marginBottom: "12px" }}>
                <div
                  onClick={() => toggleFolder(folder)}
                  style={{
                    cursor: "pointer",
                    padding: "6px 8px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    border: "1px solid #DEE2E8",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ marginRight: "6px" }}>
                    {expandedFolders[folder] ? "📂" : "📁"}
                  </span>
                  <span>{folder}</span>
                  <span style={{ fontSize: "10px", marginLeft: "auto" }}>
                    ({folders[folder].length})
                  </span>
                </div>
                {expandedFolders[folder] && (
                  <div style={{ marginLeft: "16px", fontSize: "11px" }}>
                    {folders[folder].map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "4px 0",
                          cursor: "pointer",
                          color: "#0066CC",
                        }}
                      >
                        📄 {file}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "#C8001C",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            문서 업로드
          </button>

          <div style={{ fontSize: "11px", marginBottom: "8px", fontWeight: 600 }}>
            버전 선택
          </div>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              fontSize: "11px",
              borderRadius: "4px",
              border: "1px solid #DEE2E8",
            }}
          >
            <option>2025년 1월 v3.2</option>
            <option>2024년 12월 v3.1</option>
          </select>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 1 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>
                  자주하는 질문
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {sampleQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      onClick={() => setInput(q)}
                      style={{
                        padding: "12px",
                        backgroundColor: "#fff",
                        border: "1px solid #DEE2E8",
                        borderRadius: "8px",
                        fontSize: "11px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F3F5F8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "12px 16px",
                    backgroundColor: msg.type === "user" ? "#C8001C" : "#fff",
                    color: msg.type === "user" ? "#fff" : "#000",
                    borderRadius: "8px",
                    border: msg.type === "assistant" ? "1px solid #DEE2E8" : "none",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.text}
                  {msg.sources && (
                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: "1px solid rgba(0,0,0,0.1)",
                        fontSize: "11px",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: "6px" }}>📄 출처</div>
                      <div style={{ color: "#0066CC", cursor: "pointer" }}>
                        {msg.sources.document} (p.{msg.sources.page})
                      </div>
                      <div style={{ marginTop: "4px", fontStyle: "italic" }}>
                        "{msg.sources.excerpt}"
                      </div>
                    </div>
                  )}
                  {msg.type === "assistant" && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "transparent",
                          border: "1px solid #DEE2E8",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        👍
                      </button>
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "transparent",
                          border: "1px solid #DEE2E8",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #DEE2E8",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  입력 중...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #DEE2E8",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="질문을 입력하세요..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #DEE2E8",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 16px",
                backgroundColor: "#C8001C",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              전송
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          style={{
            width: "200px",
            borderLeft: "1px solid #DEE2E8",
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#F3F5F8",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
            문서 비교
          </div>
          <select
            value={compareDoc1}
            onChange={(e) => setCompareDoc1(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              fontSize: "11px",
              marginBottom: "8px",
              borderRadius: "4px",
              border: "1px solid #DEE2E8",
            }}
          >
            <option value="">문서 선택</option>
            {Object.values(folders)
              .flat()
              .map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
          </select>
          <select
            value={compareDoc2}
            onChange={(e) => setCompareDoc2(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              fontSize: "11px",
              marginBottom: "12px",
              borderRadius: "4px",
              border: "1px solid #DEE2E8",
            }}
          >
            <option value="">문서 선택</option>
            {Object.values(folders)
              .flat()
              .map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
          </select>
          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "#C8001C",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            비교 시작
          </button>
        </div>
      </div>
    );
  };

  // ============ TAB: Sales Script Agent ============
  const SalesScriptAgent = () => {
    const [formData, setFormData] = useState({
      name: "",
      age: "",
      gender: "",
      currentPremium: "",
      recommendedPremium: "",
      missingItems: "",
    });
    const [reportFile, setReportFile] = useState(null);
    const [script, setScript] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFormChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateScript = async () => {
      setLoading(true);
      try {
        const response = await callLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an ABL생명 sales script generator. Create persuasive sales scripts based on customer information and coverage analysis.",
            },
            {
              role: "user",
              content: `고객정보: ${JSON.stringify(formData)}. 영업 스크립트를 생성해주세요.`,
            },
          ],
          settings,
        });

        setScript({
          introduction: response.substring(0, 200),
          analysisResult: "고객님 현재 보장 분석 결과를 말씀드리겠습니다.",
          needsAwakening: "특히 중대질병 항목이 부족하신 것 같습니다.",
          approachStrategy: "ABL생명의 특화상품을 추천드립니다.",
          recommendedProducts: response,
        });
      } catch (error) {
        console.error("Script generation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ display: "flex", height: "calc(100vh - 200px)" }}>
        {/* Left Panel */}
        <div
          style={{
            width: "300px",
            borderRight: "1px solid #DEE2E8",
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#F3F5F8",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
            고객정보
          </div>
          {[
            { label: "성명", key: "name" },
            { label: "나이", key: "age" },
            { label: "성별", key: "gender" },
            { label: "현재보험료", key: "currentPremium" },
            { label: "권장보험료", key: "recommendedPremium" },
            { label: "부족항목", key: "missingItems" },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                {label}
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleFormChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #DEE2E8",
                  borderRadius: "4px",
                  fontSize: "12px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              border: "2px dashed #C8001C",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F5F8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
              보장분석 리포트 업로드
            </div>
            <div style={{ fontSize: "11px", color: "#666" }}>
              {reportFile ? `✓ ${reportFile}` : "파일을 드래그하세요"}
            </div>
          </div>

          <button
            onClick={generateScript}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#C8001C",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "생성 중..." : "스크립트 생성"}
          </button>
        </div>

        {/* Middle Panel */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          {script ? (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8001C", marginBottom: "8px" }}>
                  [도입인사]
                </div>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>{script.introduction}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8001C", marginBottom: "8px" }}>
                  [보장분석 결과]
                </div>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  {script.analysisResult}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8001C", marginBottom: "8px" }}>
                  [니즈환기]
                </div>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  {script.needsAwakening}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8001C", marginBottom: "8px" }}>
                  [고객 접근화법]
                </div>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  {script.approachStrategy}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8001C", marginBottom: "8px" }}>
                  [추천상품]
                </div>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  {script.recommendedProducts}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#999", paddingTop: "40px" }}>
              고객정보를 입력하고 스크립트를 생성하세요
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: "240px",
            borderLeft: "1px solid #DEE2E8",
            padding: "20px",
            backgroundColor: "#F3F5F8",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
            보장분석 요약
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #DEE2E8",
            }}
          >
            <div style={{ fontSize: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  fontSize: "11px",
                }}
              >
                <div style={{ flex: 1 }}>부족</div>
                <div
                  style={{
                    flex: 2,
                    height: "6px",
                    backgroundColor: "#FF6B6B",
                    borderRadius: "3px",
                  }}
                />
                <div style={{ marginLeft: "4px" }}>30%</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  fontSize: "11px",
                }}
              >
                <div style={{ flex: 1 }}>양호</div>
                <div
                  style={{
                    flex: 2,
                    height: "6px",
                    backgroundColor: "#4CAF50",
                    borderRadius: "3px",
                  }}
                />
                <div style={{ marginLeft: "4px" }}>70%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ TAB: Work Assistant ============
  const WorkAssistant = () => {
    const [mode, setMode] = useState("general");
    const [messages, setMessages] = useState([
      {
        id: 1,
        type: "assistant",
        text: "무엇을 도와드릴까요?",
      },
    ]);
    const [input, setInput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const modes = [
      { id: "general", label: "일반대화" },
      { id: "rag", label: "RAG 문서검색" },
      { id: "report", label: "보고서 작성" },
      { id: "code", label: "코드 어시스턴트" },
      { id: "compare", label: "문서비교" },
    ];

    const templates = ["주간보고", "회의록", "업무보고", "품의서"];
    const languages = ["VBA", "Java", "Python", "SQL"];

    const getModeSystemPrompt = () => {
      switch (mode) {
        case "report":
          return "You are a professional report writing assistant for ABL생명. Help create structured reports.";
        case "code":
          return "You are a coding assistant. Help write and review code across multiple languages.";
        case "rag":
          return "You are a document search assistant. Help find relevant documents and information.";
        case "compare":
          return "You are a document comparison assistant. Help compare and highlight differences.";
        default:
          return "You are a general work assistant for ABL생명. Help with various work tasks.";
      }
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
      if (!input.trim()) return;

      const userMsg = {
        id: messages.length + 1,
        type: "user",
        text: input,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const systemPrompt = getModeSystemPrompt();
        const contextInfo =
          mode === "report" && selectedTemplate ? `Template: ${selectedTemplate}` : "";
        const contextInfo2 =
          mode === "code" && selectedLanguage ? `Language: ${selectedLanguage}` : "";

        const response = await callLLM({
          messages: [
            {
              role: "system",
              content: `${systemPrompt} ${contextInfo} ${contextInfo2}`,
            },
            { role: "user", content: input },
          ],
          settings,
        });

        const assistantMsg = {
          id: messages.length + 2,
          type: "assistant",
          text: response,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const errorMsg = {
          id: messages.length + 2,
          type: "assistant",
          text: "죄송합니다. 처리 중 오류가 발생했습니다.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
        {/* Mode Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #DEE2E8",
            backgroundColor: "#fff",
            padding: "0 16px",
          }}
        >
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "12px 16px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: mode === m.id ? "3px solid #C8001C" : "3px solid transparent",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: mode === m.id ? 600 : 400,
                color: mode === m.id ? "#C8001C" : "#666",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Mode-specific Options */}
        {(mode === "report" || mode === "code") && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#F3F5F8",
              borderBottom: "1px solid #DEE2E8",
              display: "flex",
              gap: "12px",
            }}
          >
            {mode === "report" && (
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{
                  padding: "6px 8px",
                  fontSize: "12px",
                  border: "1px solid #DEE2E8",
                  borderRadius: "4px",
                }}
              >
                <option value="">템플릿 선택</option>
                {templates.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            {mode === "code" && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: "6px 8px",
                  fontSize: "12px",
                  border: "1px solid #DEE2E8",
                  borderRadius: "4px",
                }}
              >
                <option value="">언어 선택</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "12px 16px",
                  backgroundColor: msg.type === "user" ? "#C8001C" : "#f5f5f5",
                  color: msg.type === "user" ? "#fff" : "#000",
                  borderRadius: "8px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                입력 중...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #DEE2E8",
            display: "flex",
            gap: "8px",
            backgroundColor: "#fff",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #DEE2E8",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 16px",
              backgroundColor: "#C8001C",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.6 : 1,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            전송
          </button>
        </div>
      </div>
    );
  };

  // ============ TAB: Rider Recommendation ============
  const RiderRecommendation = () => {
    const [profile, setProfile] = useState({
      name: "",
      age: "",
      diseaseHistory: [],
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const diseases = [
      { name: "고혈압", status: "부족" },
      { name: "당뇨", status: "미흡" },
      { name: "암", status: "충분" },
      { name: "심혈관", status: "미가입" },
    ];

    const generateRecommendations = async () => {
      setLoading(true);
      try {
        const response = await callLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an ABL생명 rider recommendation specialist. Recommend suitable insurance riders based on customer health profile.",
            },
            {
              role: "user",
              content: `질병 이력: ${profile.diseaseHistory.join(", ")}. 특약을 추천해주세요.`,
            },
          ],
          settings,
        });

        setRecommendations({
          riders: [
            { name: "중대질병 특약", priority: "높음", reason: response.substring(0, 100) },
            {
              name: "암 진단 특약",
              priority: "중간",
              reason: "가족력이 있으므로 권장",
            },
            { name: "입원일당 특약", priority: "중간", reason: "기본 보장이 부족함" },
          ],
          competitorComparison: [
            { product: "ABL 플러스", score: 95 },
            { product: "경쟁사 A", score: 78 },
            { product: "경쟁사 B", score: 72 },
          ],
        });
      } catch (error) {
        console.error("Recommendation generation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ display: "flex", height: "calc(100vh - 200px)" }}>
        {/* Left Panel */}
        <div
          style={{
            width: "300px",
            borderRight: "1px solid #DEE2E8",
            padding: "20px",
            backgroundColor: "#F3F5F8",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
            고객 프로필
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              성명
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #DEE2E8",
                borderRadius: "4px",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              나이
            </label>
            <input
              type="text"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #DEE2E8",
                borderRadius: "4px",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
            질병 이력
          </div>
          {diseases.map((disease) => (
            <div
              key={disease.name}
              style={{
                padding: "8px 12px",
                backgroundColor: "#fff",
                borderRadius: "4px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                border: "1px solid #DEE2E8",
              }}
            >
              <span>{disease.name}</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  backgroundColor:
                    disease.status === "부족"
                      ? "#FF6B6B"
                      : disease.status === "미흡"
                        ? "#FFA500"
                        : disease.status === "충분"
                          ? "#4CAF50"
                          : "#999",
                  color: "#fff",
                  borderRadius: "3px",
                }}
              >
                {disease.status}
              </span>
            </div>
          ))}

          <button
            onClick={generateRecommendations}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "10px",
              backgroundColor: "#C8001C",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "추천 중..." : "추천 생성"}
          </button>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          {recommendations ? (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                  추천 특약
                </div>
                <div
                  style={{
                    border: "1px solid #DEE2E8",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2fr",
                      backgroundColor: "#F3F5F8",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "12px",
                      borderBottom: "1px solid #DEE2E8",
                    }}
                  >
                    <div>특약명</div>
                    <div>우선순위</div>
                    <div>사유</div>
                  </div>
                  {recommendations.riders.map((rider, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 2fr",
                        padding: "12px",
                        borderBottom: idx < recommendations.riders.length - 1 ? "1px solid #DEE2E8" : "none",
                        fontSize: "12px",
                      }}
                    >
                      <div>{rider.name}</div>
                      <div>
                        <span
                          style={{
                            padding: "2px 6px",
                            backgroundColor:
                              rider.priority === "높음" ? "#FF6B6B" : "#FFA500",
                            color: "#fff",
                            borderRadius: "3px",
                            fontSize: "10px",
                          }}
                        >
                          {rider.priority}
                        </span>
                      </div>
                      <div>{rider.reason}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                  경쟁사 비교
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {recommendations.competitorComparison.map((comp, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "120px", fontSize: "12px" }}>{comp.product}</div>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          backgroundColor: "#DEE2E8",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${comp.score}%`,
                            backgroundColor: "#C8001C",
                          }}
                        />
                      </div>
                      <div style={{ width: "40px", fontSize: "12px", textAlign: "right" }}>
                        {comp.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#999", paddingTop: "40px" }}>
              고객 정보를 입력하고 추천을 생성하세요
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============ TAB: AI Agent Hub ============
  const AIAgentHub = () => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [agentMessages, setAgentMessages] = useState([]);
    const [agentInput, setAgentInput] = useState("");
    const [agentLoading, setAgentLoading] = useState(false);

    const agents = [
      {
        id: "churn",
        title: "해지방어 AI Agent",
        icon: "🛡️",
        description: "해지 위험 고객 예측 및 맞춤 리텐션 전략",
        systemPrompt:
          "You are a customer churn prevention specialist for ABL생명. Analyze customer data and provide retention strategies.",
      },
      {
        id: "marketing",
        title: "마케팅 문구 생성",
        icon: "✍️",
        description: "타겟 세그먼트별 맞춤 마케팅 카피",
        systemPrompt:
          "You are a marketing copywriter for ABL생명. Generate targeted marketing messages for different customer segments.",
      },
      {
        id: "compliance",
        title: "컴플라이언스 검토",
        icon: "⚖️",
        description: "보험업법 준수 여부 자동 검토",
        systemPrompt:
          "You are an insurance compliance expert. Review content for compliance with insurance regulations.",
      },
      {
        id: "complaint",
        title: "민원 예측/대응",
        icon: "📞",
        description: "민원 패턴 분석 및 선제적 대응",
        systemPrompt:
          "You are a customer complaint prediction specialist. Analyze patterns and suggest preventive measures.",
      },
      {
        id: "quality",
        title: "신계약 품질 분석",
        icon: "📊",
        description: "불완전판매 리스크 조기 탐지",
        systemPrompt:
          "You are a new business quality analyst. Identify incomplete sales and risks.",
      },
      {
        id: "design",
        title: "고객 맞춤 상품 설계",
        icon: "💎",
        description: "최적 상품 포트폴리오 자동 설계",
        systemPrompt:
          "You are a product design specialist. Create optimal product portfolios for customers.",
      },
    ];

    const handleAgentSend = async () => {
      if (!agentInput.trim() || !selectedAgent) return;

      const userMsg = {
        id: agentMessages.length + 1,
        type: "user",
        text: agentInput,
      };
      setAgentMessages((prev) => [...prev, userMsg]);
      setAgentInput("");
      setAgentLoading(true);

      try {
        const agent = agents.find((a) => a.id === selectedAgent);
        const response = await callLLM({
          messages: [
            { role: "system", content: agent.systemPrompt },
            { role: "user", content: agentInput },
          ],
          settings,
        });

        const assistantMsg = {
          id: agentMessages.length + 2,
          type: "assistant",
          text: response,
        };
        setAgentMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const errorMsg = {
          id: agentMessages.length + 2,
          type: "assistant",
          text: "처리 중 오류가 발생했습니다.",
        };
        setAgentMessages((prev) => [...prev, errorMsg]);
      } finally {
        setAgentLoading(false);
      }
    };

    if (selectedAgent) {
      const agent = agents.find((a) => a.id === selectedAgent);
      return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #DEE2E8",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={() => {
                setSelectedAgent(null);
                setAgentMessages([]);
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: "transparent",
                border: "1px solid #DEE2E8",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ← 뒤로
            </button>
            <span style={{ fontSize: "16px" }}>{agent.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>{agent.title}</div>
              <div style={{ fontSize: "11px", color: "#666" }}>{agent.description}</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {agentMessages.length === 0 && (
              <div style={{ textAlign: "center", color: "#999", paddingTop: "40px" }}>
                <div style={{ fontSize: "13px", marginBottom: "16px" }}>
                  {agent.title}에 질문하세요
                </div>
              </div>
            )}

            {agentMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "12px 16px",
                    backgroundColor: msg.type === "user" ? "#C8001C" : "#f5f5f5",
                    color: msg.type === "user" ? "#fff" : "#000",
                    borderRadius: "8px",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {agentLoading && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  처리 중...
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #DEE2E8",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAgentSend()}
              placeholder="메시지를 입력하세요..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #DEE2E8",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleAgentSend}
              disabled={agentLoading || !agentInput.trim()}
              style={{
                padding: "10px 16px",
                backgroundColor: "#C8001C",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: agentLoading || !agentInput.trim() ? "not-allowed" : "pointer",
                opacity: agentLoading || !agentInput.trim() ? 0.6 : 1,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              전송
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          padding: "24px",
          overflowY: "auto",
          height: "calc(100vh - 200px)",
          backgroundColor: "#F3F5F8",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #DEE2E8",
                borderRadius: "8px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{agent.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                {agent.title}
              </div>
              <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.5" }}>
                {agent.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============ Main Component ============
  const tabs = [
    { id: "knowledge", label: "보험상품 지식 Agent", icon: "📚" },
    { id: "script", label: "영업지원 스크립트", icon: "📋" },
    { id: "assistant", label: "업무지원 AI Assistant", icon: "🤖" },
    { id: "rider", label: "특약 추천", icon: "🎯" },
    { id: "agents", label: "AI Agent Hub", icon: "⚡" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#F3F5F8" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #DEE2E8",
          gap: "12px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "6px 12px",
            backgroundColor: "transparent",
            border: "1px solid #DEE2E8",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ← 포털
        </button>

        <div
          style={{
            padding: "4px 12px",
            backgroundColor: "#C8001C",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          ABL
        </div>

        <div style={{ fontSize: "13px", fontWeight: 600 }}>생성형 AI 플랫폼</div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#fff",
          borderBottom: "1px solid #DEE2E8",
          paddingLeft: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid #C8001C" : "3px solid transparent",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#C8001C" : "#666",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "knowledge" && <KnowledgeAgent />}
        {activeTab === "script" && <SalesScriptAgent />}
        {activeTab === "assistant" && <WorkAssistant />}
        {activeTab === "rider" && <RiderRecommendation />}
        {activeTab === "agents" && <AIAgentHub />}
      </div>
    </div>
  );
};

export default ABLHub;
