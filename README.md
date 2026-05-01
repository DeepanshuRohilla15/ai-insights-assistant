# AI Insights Assistant — CineVault

## Overview
AI-powered analytics assistant for an entertainment company using multi-source data.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Recharts |
| Backend | Python, FastAPI |
| AI Model | Groq (llama-3.3-70b-versatile) |
| Data Sources | CSV files + PDF knowledge (embedded) |

## Architecture
User → React Frontend → FastAPI Backend → Groq LLM
                                       ↘ CSV Data (6 files)
                                       ↘ PDF Summary (embedded in prompt)

## Setup Instructions
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn groq pandas python-multipart
set GROQ_API_KEY=your_key_here
python generate_data.py
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Assumptions & Tradeoffs
- PDF documents are summarized into the system prompt (simulates RAG without a vector DB)
- CSV files are loaded in-memory per request (fine for demo scale)
- No auth layer added (JWT middleware would be added in production)
- CORS is open for local dev; restrict in production

## Example Questions
1. Which titles performed best in 2025?
2. Why is Stellar Run trending recently?
3. Compare Dark Orbit vs Last Kingdom
4. Which city had strongest engagement last month?
5. What explains weak comedy performance?
6. What recommendations for leadership?