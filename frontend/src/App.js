import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const API = "http://localhost:8000/api";
const COLORS = ["#185FA5", "#1D9E75", "#D85A30", "#BA7517", "#993556"];

const SUGGESTED = [
  "Which titles performed best in 2025?",
  "Why is Stellar Run trending recently?",
  "Compare Dark Orbit vs Last Kingdom",
  "Which city had strongest engagement last month?",
  "What explains weak comedy performance?",
  "What recommendations for leadership next quarter?"
];

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your Entertainment Analytics Assistant. Ask me anything about movie performance, audience trends, or regional insights.", sources: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const [topMovies, setTopMovies] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    axios.get(`${API}/analytics/top-movies`).then(r => setTopMovies(r.data)).catch(() => {});
    axios.get(`${API}/analytics/genre-summary`).then(r => setGenreData(r.data)).catch(() => {});
  }, []);

  const ask = async (q) => {
    const query = q || question;
    if (!query.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setLoading(true);
    setQuestion("");
    setActiveTab("chat");
    try {
      const res = await axios.post(`${API}/chat`, { question: query });
      setMessages(prev => [...prev, {
        role: "ai",
        text: res.data.answer,
        sources: res.data.sources
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error: Could not reach backend. Make sure it is running on port 8000.", sources: [] }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif", background: "#f9f9f9" }}>

      {/* Sidebar */}
      <div style={{ width: 250, background: "#fff", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", padding: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#185FA5" }}>CineVault AI</h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Analytics Assistant</p>
        </div>

        <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Suggested Questions</p>
        {SUGGESTED.map((q, i) => (
          <button key={i} onClick={() => ask(q)}
            style={{ display: "block", width: "100%", textAlign: "left", background: "#f5f8ff",
              border: "1px solid #dde8ff", borderRadius: 8, padding: "8px 10px", marginBottom: 8,
              fontSize: 12, cursor: "pointer", color: "#333", lineHeight: 1.4 }}>
            {q}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "12px 0", borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: 11, color: "#aaa" }}>Sources active</p>
          {["movies.csv","regional.csv","marketing.csv","reviews.csv","PDF Reports"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75" }}></div>
              <span style={{ fontSize: 11, color: "#555" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 500 }}>Entertainment Analytics Assistant</h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["chat","charts"].map(tab => (
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

        {/* Chat Tab */}
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

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Top Movies by Rating</h3>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topMovies}>
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
                  <Pie data={genreData} dataKey="total_views" nameKey="genre" cx="50%" cy="50%" outerRadius={80} label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}>
                    {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}