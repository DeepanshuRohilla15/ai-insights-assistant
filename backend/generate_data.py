import pandas as pd
import random
import os

os.makedirs("../data/csv", exist_ok=True)

movies = pd.DataFrame({
    "movie_id": range(1, 11),
    "title": ["Stellar Run","Dark Orbit","Last Kingdom","The Void","Comedy Nights",
               "City Lights","Apex","Neon Wave","Iron Fist","Laugh Track"],
    "genre": ["Sci-Fi","Sci-Fi","Drama","Thriller","Comedy",
               "Drama","Action","Sci-Fi","Action","Comedy"],
    "release_year": [2025,2024,2025,2024,2025,2024,2025,2024,2025,2024],
    "rating": [9.1, 8.4, 8.7, 7.9, 5.2, 8.1, 8.8, 7.5, 8.3, 4.9],
    "total_views": [1200000,980000,870000,650000,300000,
                    720000,1100000,580000,890000,210000]
})

viewers = pd.DataFrame({
    "viewer_id": range(1, 11),
    "age_group": ["18-24","25-34","35-44","18-24","45-54",
                  "25-34","18-24","35-44","25-34","55+"],
    "gender": ["M","F","M","F","M","F","M","F","M","F"],
    "preferred_genre": ["Sci-Fi","Drama","Action","Comedy","Drama",
                        "Sci-Fi","Action","Comedy","Sci-Fi","Drama"]
})

watch_activity = pd.DataFrame({
    "movie_id": [1,1,2,3,4,5,6,7,8,9,10,1],
    "viewer_id": [1,2,3,4,5,6,7,8,9,10,1,3],
    "watch_date": ["2025-01-15","2025-02-10","2025-01-20","2025-03-05",
                   "2024-11-01","2025-01-30","2024-12-15","2025-02-20",
                   "2024-10-10","2025-03-01","2024-09-15","2025-03-10"],
    "completion_pct": [95,88,72,91,65,40,85,93,70,88,35,97]
})

reviews = pd.DataFrame({
    "movie_id": range(1, 11),
    "avg_stars": [4.8,4.2,4.5,3.9,2.5,4.1,4.6,3.7,4.3,2.3],
    "review_count": [15000,9000,11000,6000,2000,8000,13000,5000,10000,1500],
    "sentiment": ["positive","positive","positive","neutral","negative",
                  "positive","positive","neutral","positive","negative"]
})

marketing_spend = pd.DataFrame({
    "movie_id": range(1, 11),
    "spend_usd": [450000,300000,280000,200000,80000,
                  220000,400000,150000,350000,60000],
    "platform": ["YouTube","Instagram","TV","Google","TikTok",
                 "YouTube","Instagram","TV","Google","TikTok"],
    "impressions": [5000000,3200000,2800000,1900000,800000,
                    2100000,4200000,1500000,3800000,600000]
})

regional_performance = pd.DataFrame({
    "city": ["Mumbai","Delhi","Bangalore","Chennai","Pune",
              "Mumbai","Delhi","Bangalore","Chennai","Pune"],
    "movie_id": [1,2,3,4,5,6,7,8,9,10],
    "views": [random.randint(50000, 200000) for _ in range(10)],
    "engagement_score": [round(random.uniform(6, 10), 1) for _ in range(10)],
    "month": ["March","March","March","March","March",
               "February","February","February","February","February"]
})

movies.to_csv("../data/csv/movies.csv", index=False)
viewers.to_csv("../data/csv/viewers.csv", index=False)
watch_activity.to_csv("../data/csv/watch_activity.csv", index=False)
reviews.to_csv("../data/csv/reviews.csv", index=False)
marketing_spend.to_csv("../data/csv/marketing_spend.csv", index=False)
regional_performance.to_csv("../data/csv/regional_performance.csv", index=False)

print("All 6 CSV files created successfully!")