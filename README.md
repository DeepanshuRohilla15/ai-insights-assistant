# CineVault AI — Secure Analytics Assistant

An AI-powered internal analytics assistant for a fictional entertainment company.
Answers business questions using multiple private data sources including structured CSV data,
PDF reports, and relational data — powered by Groq LLM.

---

## GitHub Repositories

| Part | Link |
|---|---|
| Backend + Full Project | https://github.com/DeepanshuRohilla15/ai-insights-assistant |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                    React Frontend :3000                      │
│         Chat UI │ Filters │ Insights │ Charts │ History      │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend :8000                      │
│                                                             │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │  /api/chat  │  │/api/analytics│  │  /api/documents  │  │
│   │             │  │              │  │                  │  │
│   │ AI          │  │ top-movies   │  │ list / search    │  │
│   │ Orchestration│  │ regional     │  │ retrieve by id   │  │
│   │             │  │ genre-summary│  │                  │  │
│   └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│          │                │                    │            │
└──────────┼────────────────┼────────────────────┼────────────┘
           │                │                    │
           ▼                ▼                    ▼
┌──────────────┐   ┌─────────────────┐   ┌──────────────────┐
│   Groq LLM   │   │   CSV Data      │   │   PDF Knowledge  │
│              │   │                 │   │                  │
│ llama-3.3-   │   │ movies.csv      │   │ quarterly_report │
│ 70b-versatile│   │ viewers.csv     │   │ campaign_summary │
│              │   │ watch_activity  │   │ audience_report  │
│              │   │ reviews.csv     │   │ leadership_recs  │
│              │   │ marketing_spend │   │                  │
│              │   │ regional_perf   │   │                  │
└──────────────┘   └─────────────────┘   └──────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Recharts |
| Backend | Python 3.11, FastAPI |
| AI Model | Groq — llama-3.3-70b-versatile |
| Data — Structured | CSV files (6 files) |
| Data — Unstructured | PDF knowledge embedded in prompt |
| Validation | Pydantic |
| Logging | Python logging module |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
ai-insights-assistant/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── generate_data.py         # Script to generate all CSV files
│   ├── logger.py                # Centralized logging
│   ├── validators.py            # Pydantic request validation
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Backend container
│   └── routers/
│       ├── __init__.py
│       ├── chat.py              # AI orchestration endpoint
│       ├── analytics.py         # Structured data queries + ingestion
│       └── documents.py         # PDF document retrieval
├── frontend/
│   ├── src/
│   │   └── App.js               # Full React UI
│   ├── Dockerfile               # Frontend container
│   └── package.json
├── data/
│   └── csv/                     # All generated CSV files
├── docker-compose.yml           # Run everything together
├── .env                         # API keys (not committed)
└── README.md
```

---

## Setup Instructions

### Option A — Run Locally (Without Docker)

#### Backend

```bash
# 1. Go to backend folder
cd backend

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Generate CSV data files
python3 generate_data.py

# 5. Set Groq API key
export GROQ_API_KEY=your_groq_api_key_here

# 6. Start backend
uvicorn main:app --reload
```

Backend runs at: http://127.0.0.1:8000
API docs at: http://127.0.0.1:8000/docs

#### Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend runs at: http://localhost:3000

---

### Option B — Run with Docker

```bash
# 1. Make sure Docker Desktop is installed and running

# 2. Add your Groq key to .env file in root folder
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# 3. Build and run everything
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/chat` | Ask AI a business question |
| GET | `/api/analytics/top-movies` | Top 5 movies by rating |
| GET | `/api/analytics/regional` | Regional engagement data |
| GET | `/api/analytics/genre-summary` | Genre performance summary |
| POST | `/api/ingest/csv` | Upload a new CSV file |
| GET | `/api/documents` | List all PDF documents |
| GET | `/api/documents/{id}` | Get specific document |
| GET | `/api/documents/search/{keyword}` | Search documents by keyword |

---

## Example Questions the System Answers

1. Which titles performed best in 2025?
2. Why is Stellar Run trending recently?
3. Compare Dark Orbit vs Last Kingdom
4. Which city had the strongest engagement last month?
5. What explains weak comedy performance?
6. What recommendations would you give for leadership?

---

## Data Sources

| Source | Type | Files |
|---|---|---|
| Source A | SQL / CSV Structured | movies.csv, viewers.csv, watch_activity.csv, reviews.csv, marketing_spend.csv, regional_performance.csv |
| Source B | PDF Documents | Quarterly report, Campaign summary, Audience report, Leadership recommendations |
| Source C | AI Layer | Groq LLM — llama-3.3-70b-versatile |

---

## Security Design

- API key stored in environment variable, never hardcoded in committed code
- All data access goes through FastAPI routers — no direct raw file exposure to frontend
- Input validation on every request using Pydantic models
- CORS restricted — configurable per environment
- `.env` file is gitignored and never committed

---

## Assumptions & Tradeoffs

### Assumptions

1. **PDF as embedded knowledge** — PDF documents are summarized and injected into the LLM system prompt rather than using a full vector database. This simulates RAG (Retrieval Augmented Generation) without requiring additional infrastructure like Pinecone or ChromaDB.

2. **CSV as database** — CSV files are used directly instead of a full SQL database (PostgreSQL/SQLite). This keeps setup simple while demonstrating the same querying logic. In production, these would be loaded into a proper database.

3. **In-memory data loading** — CSVs are loaded fresh on each request. For a production system, data would be cached or served from a database with connection pooling.

4. **Single user, no auth** — No authentication layer is implemented. In production, JWT-based auth with role-based access control (RBAC) would be added to enforce data access boundaries per user role.

5. **Groq over OpenAI/Anthropic** — Groq was chosen for its free tier and extremely fast inference speed, making it ideal for a demo/prototype submission.

### Tradeoffs

| Decision | Tradeoff |
|---|---|
| Embedded PDF knowledge vs real RAG | Simpler setup but less scalable for large document libraries |
| CSV files vs SQL database | Easier to run locally but no complex joins or transactions |
| Groq free tier | Fast and free but has rate limits in production |
| Single repo for frontend + backend | Easier to review but would be separate in production |
| In-memory CSV loading | Simple but slower at scale vs caching layer |

---

## Evaluation Criteria Coverage

| Category | Weight | How we address it |
|---|---|---|
| Architecture Quality | 25 | Multi-source retrieval, tool-based access, clean separation of concerns |
| Backend Engineering | 20 | FastAPI routers, validation, logging, error handling, data ingestion API |
| AI / Multi-source Reasoning | 20 | Groq LLM with all 6 CSVs + PDF knowledge in context |
| Frontend Experience | 15 | Chat UI, filters, insights panel, charts, query history, tool trace |
| Security / Data Handling | 10 | Env vars for keys, Pydantic validation, no raw data exposure |
| Code Quality | 5 | Reusable logger, validators, clean router structure |
| Documentation | 5 | This README with architecture diagram, setup, assumptions |