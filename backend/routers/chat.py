from fastapi import APIRouter, HTTPException
from groq import Groq
import pandas as pd
import os
from logger import get_logger
from validators import ChatRequest

router = APIRouter()
logger = get_logger("chat")
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "your_key_here"))

def load_all_data():
    try:
        base = "../data/csv/"
        movies    = pd.read_csv(base + "movies.csv").to_string(index=False)
        regional  = pd.read_csv(base + "regional_performance.csv").to_string(index=False)
        marketing = pd.read_csv(base + "marketing_spend.csv").to_string(index=False)
        reviews   = pd.read_csv(base + "reviews.csv").to_string(index=False)
        viewers   = pd.read_csv(base + "viewers.csv").to_string(index=False)
        watch     = pd.read_csv(base + "watch_activity.csv").to_string(index=False)
        logger.info("All CSV data loaded successfully")
        return movies, regional, marketing, reviews, viewers, watch
    except Exception as e:
        logger.error(f"Failed to load data: {e}")
        raise HTTPException(status_code=500, detail=f"Data loading failed: {str(e)}")

@router.post("/chat")
def chat(payload: ChatRequest):
    logger.info(f"Received question: {payload.question}")
    movies, regional, marketing, reviews, viewers, watch = load_all_data()

    system_prompt = f"""You are an AI analytics assistant for CineVault, a fictional entertainment company.
You answer business questions using internal data from multiple sources.

--- SOURCE A: movies.csv ---
{movies}

--- SOURCE B: regional_performance.csv ---
{regional}

--- SOURCE C: marketing_spend.csv ---
{marketing}

--- SOURCE D: reviews.csv ---
{reviews}

--- SOURCE E: viewers.csv ---
{viewers}

--- SOURCE F: watch_activity.csv ---
{watch}

--- SOURCE G: PDF Reports ---
- Stellar Run grew 40% in Q1 2025 driven by TikTok influencer campaigns and strong 18-24 audience engagement.
- Comedy genre underperforming due to low marketing spend ($60K-$80K vs $300K+ for top titles).
- Dark Orbit has higher views but Last Kingdom has better ratings and completion rate.
- Mumbai and Bangalore are highest-engagement cities for Sci-Fi content.
- Leadership recommendation for Q3: increase Sci-Fi and Action budgets by 30%, pause comedy investment.

Rules:
1. Always mention which source(s) you used at the end.
2. Be concise and actionable.
3. Use numbers from the data when possible."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.question}
            ],
            max_tokens=1000,
            temperature=0.3
        )
        answer = response.choices[0].message.content
        logger.info("Groq responded successfully")
        return {
            "answer": answer,
            "sources": ["movies.csv", "regional_performance.csv", "marketing_spend.csv",
                        "reviews.csv", "watch_activity.csv", "PDF Executive Report"]
        }
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        raise HTTPException(status_code=500, detail=f"AI request failed: {str(e)}")