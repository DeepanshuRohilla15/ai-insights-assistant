from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import documents
from routers import chat, analytics

app = FastAPI(title="AI Insights Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(chat.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(documents.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "running"}