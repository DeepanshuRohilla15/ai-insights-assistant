from fastapi import APIRouter
import pandas as pd

router = APIRouter()

@router.get("/analytics/top-movies")
def top_movies():
    df = pd.read_csv("../data/csv/movies.csv")
    top = df.sort_values("rating", ascending=False).head(5)
    return top.to_dict(orient="records")

@router.get("/analytics/regional")
def regional():
    df = pd.read_csv("../data/csv/regional_performance.csv")
    return df.to_dict(orient="records")

@router.get("/analytics/genre-summary")
def genre_summary():
    df = pd.read_csv("../data/csv/movies.csv")
    summary = df.groupby("genre").agg(
        avg_rating=("rating", "mean"),
        total_views=("total_views", "sum"),
        count=("movie_id", "count")
    ).reset_index()
    summary["avg_rating"] = summary["avg_rating"].round(2)
    return summary.to_dict(orient="records")