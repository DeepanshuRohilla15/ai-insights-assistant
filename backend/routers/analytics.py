from fastapi import APIRouter, HTTPException, UploadFile, File
import pandas as pd
import shutil
from logger import get_logger

router = APIRouter()
logger = get_logger("analytics")

def read_csv_safe(path: str):
    try:
        return pd.read_csv(path)
    except Exception as e:
        logger.error(f"Failed to read {path}: {e}")
        raise HTTPException(status_code=500, detail=f"Could not read data file: {path}")

@router.post("/ingest/csv")
def ingest_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    try:
        save_path = f"../data/csv/{file.filename}"
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        df = pd.read_csv(save_path)
        logger.info(f"Ingested file: {file.filename} with {len(df)} rows")
        return {"message": f"{file.filename} uploaded successfully", "rows": len(df), "columns": list(df.columns)}
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/top-movies")
def top_movies():
    df = read_csv_safe("../data/csv/movies.csv")
    top = df.sort_values("rating", ascending=False).head(5)
    logger.info("Fetched top movies")
    return top.to_dict(orient="records")

@router.get("/analytics/regional")
def regional():
    df = read_csv_safe("../data/csv/regional_performance.csv")
    return df.to_dict(orient="records")

@router.get("/analytics/genre-summary")
def genre_summary():
    df = read_csv_safe("../data/csv/movies.csv")
    summary = df.groupby("genre").agg(
        avg_rating=("rating", "mean"),
        total_views=("total_views", "sum"),
        count=("movie_id", "count")
    ).reset_index()
    summary["avg_rating"] = summary["avg_rating"].round(2)
    return summary.to_dict(orient="records")