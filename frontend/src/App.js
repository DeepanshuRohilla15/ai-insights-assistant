import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const API = "http://127.0.0.1:8000/api";
const COLORS = ["#185FA5", "#1D9E75", "#D85A30", "#BA7517", "#993556"];

const SUGGESTED = [
  "Which titles performed best in 2025?",
  "Why is Stellar Run trending recently?",
  "Compare Dark Orbit vs Last Kingdom",
  "Which city had strongest engagement last month?",
  "What explains weak comedy performance?",
  "What recommendations for leadership next quarter?"
];

const INSIGHTS = [
  { label: "Top Title", value: "Stellar Run", sub: "Rating 9.1 · Sci-Fi" },
  { label: "Fastest Growing Genre", value: "Sci-Fi", sub: "+40% Q1 2025" },
  { label: "Weakest Genre", value: "Comedy", sub: "Avg rating 5.0" },
  { label: "Top City", value: "Mumbai", sub: "Highest engagement" },
];

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your Entertainment Analytics Assistant. Ask me anything about movie performance, audience trends, or regional insights.", sources: [], tools: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const [topMovies, setTopMovies] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  // Filters
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterCity, setFilterCity] = useState("All");

  useEffect(() => {
    axios.get(`${API}/analytics/top-movies`).then(r => setTopMovies(r.data)).catch(() => {});
    axios.get(`${API}/analytics/genre-summary`).then(r => setGenreData(r.data)).catch(() => {});
  }, []);

  const ask = async (q) => {
    const query = q || question;
    if (!query.trim()) return;

    // Append filters to query if set
    let fullQuery = query;
    if (filterGenre !== "All") fullQuery += ` (filter: genre=${filterGenre})`;
    if (filterYear !== "All") fullQuery += ` (filter: year=${filterYear})`;
    if (filterCity !== "All") fullQuery += ` (filter: city=${filterCity})`;

    setMessages(prev => [...prev, { role: "user", text: query }]);
    setLoading(true);
    setQuestion("");
    setActiveTab("chat");

    try {
      const res = await axios.post(`${API}/chat`, { question: fullQuery });
      setMessages(prev => [...prev, {
        role: "ai",
        text: res.data.answer,
        sources: res.data.sources || [],
        tools: ["query_csv", "retrieve_pdf", "groq_llm"]
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "Error: Could not reach backend. Make sure it is running on port 8000.",
        sources: [],
        tools: []
      }]);
    }
    setLoading(false);
  };

  const filteredMovies = topMovies.filter(m => {
    if (filterGenre !== "All" && m.genre !== filterGenre) return false;
    if (filterYear !== "All" && String(m.release_year) !== filterYear) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif", background: "#f9f9f9" }}>

      {/* Sidebar */}
      <div style={{ width: 250, background: "#fff", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", padding: 16, overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#185FA5" }}>CineVault AI</h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Analytics Assistant</p>
        </div>

        {/* Filters */}
        <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Filters</p>

        <label style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>Genre</label>
        <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)}
          style={{ marginBottom: 10, padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}>
          {["All","Sci-Fi","Drama","Action","Comedy","Thriller"].map(g => <option key={g}>{g}</option>)}
        </select>

        <label style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>Year</label>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          style={{ marginBottom: 10, padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}>
          {["All","2024","2025"].map(y => <option key={y}>{y}</option>)}
        </select>

        <label style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>City</label>
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
          style={{ marginBottom: 16, padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}>
          {["All","Mumbai","Delhi","Bangalore","Chennai","Pune"].map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Suggested Questions */}
        <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Suggested</p>
        {SUGGESTED.map((q, i) => (
          <button key={i} onClick={() => ask(q)}
            style={{ display: "block", width: "100%", textAlign: "left", background: "#f5f8ff",
              border: "1px solid #dde8ff", borderRadius: 8, padding: "8px 10px", marginBottom: 8,
              fontSize: 12, cursor: "pointer", color: "#333", lineHeight: 1.4 }}>
            {q}
          </button>
        ))}

        {/* Active Sources */}
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>Active sources</p>
          {["movies.csv","regional.csv","marketing.csv","reviews.csv","PDF Reports"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75" }}></div>
              <span style={{ fontSize: 11, color: "#555" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 500 }}>Entertainment Analytics Assistant</h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["chat", "insights", "charts", "history"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #ddd",
                  background: activeTab === tab ? "#185FA5" : "#fff",
                  color: activeTab === tab ? "#fff" : "#555",
                  fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "72%", background: m.role === "user" ? "#185FA5" : "#fff",
                    color: m.role === "user" ? "#fff" : "#222",
                    border: m.role === "ai" ? "1px solid #eee" : "none",
                    borderRadius: 12, padding: "12px 16px", fontSize: 14, lineHeight: 1.6,
                    boxShadow: m.role === "ai" ? "0 1px 4px rgba(0,0,0,0.05)" : "none" }}>
                    <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <p style={{ fontSize: 11, color: m.role === "user" ? "rgba(255,255,255,0.7)" : "#aaa", marginTop: 8, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                        Sources: {m.sources.join(" · ")}
                      </p>
                    )}
                    {m.tools && m.tools.length > 0 && (
                      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {m.tools.map(t => (
                          <span key={t} style={{ fontSize: 10, background: "#f0f4ff", color: "#185FA5", padding: "2px 8px", borderRadius: 20, border: "1px solid #dde8ff" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid #eee",
                  borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#888" }}>
                  Thinking...
                </div>
              )}
            </div>

            <div style={{ padding: 16, borderTop: "1px solid #eee", background: "#fff", display: "flex", gap: 10 }}>
              <input value={question} onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && ask()}
                placeholder="Ask a business question about movies, regions, or trends..."
                style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
              <button onClick={() => ask()}
                style={{ padding: "10px 22px", background: "#185FA5", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
                Ask
              </button>
            </div>
          </>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Key Business Insights</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {INSIGHTS.map((ins, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{ins.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#185FA5" }}>{ins.value}</p>
                  <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{ins.sub}</p>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>PDF Document Library</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { title: "Q1 2025 Quarterly Executive Report", tag: "quarterly_report.pdf" },
                { title: "Campaign Performance Summary", tag: "campaign_summary.pdf" },
                { title: "Audience Behavior Report", tag: "audience_report.pdf" },
                { title: "Leadership Recommendations Q3", tag: "content_roadmap.pdf" },
              ].map((doc, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{doc.title}</p>
                    <p style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{doc.tag}</p>
                  </div>
                  <span style={{ fontSize: 11, background: "#f0f4ff", color: "#185FA5", padding: "4px 10px", borderRadius: 20 }}>PDF</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHARTS TAB */}
        {activeTab === "charts" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Top Movies by Rating</h3>
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>
              Filtered by: Genre={filterGenre} · Year={filterYear}
            </p>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={filteredMovies.length > 0 ? filteredMovies : topMovies}>
                  <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#185FA5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Views by Genre</h3>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={genreData} dataKey="total_views" nameKey="genre" cx="50%" cy="50%" outerRadius={80}
                    label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}>
                    {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Query History & Tool Trace</h3>
            {messages.filter(m => m.role === "user").length === 0 && (
              <p style={{ color: "#aaa", fontSize: 14 }}>No queries yet. Ask something in the Chat tab.</p>
            )}
            {messages.map((m, i) => {
              if (m.role !== "user") return null;
              const reply = messages[i + 1];
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>Q: {m.text}</p>
                    <span style={{ fontSize: 11, color: "#aaa" }}>#{Math.floor(i / 2) + 1}</span>
                  </div>
                  {reply && (
                    <>
                      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>
                        {reply.text.slice(0, 200)}{reply.text.length > 200 ? "..." : ""}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(reply.tools || []).map(t => (
                          <span key={t} style={{ fontSize: 10, background: "#f0f4ff", color: "#185FA5", padding: "2px 8px", borderRadius: 20, border: "1px solid #dde8ff" }}>
                            tool: {t}
                          </span>
                        ))}
                        {(reply.sources || []).map(s => (
                          <span key={s} style={{ fontSize: 10, background: "#f0fff8", color: "#1D9E75", padding: "2px 8px", borderRadius: 20, border: "1px solid #9FE1CB" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}