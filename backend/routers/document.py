from fastapi import APIRouter

router = APIRouter()

PDF_KNOWLEDGE = {
    "quarterly_report": {
        "title": "Q1 2025 Quarterly Executive Report",
        "content": "Stellar Run grew 40% in Q1 2025 driven by TikTok influencer campaigns and strong 18-24 audience engagement. Total revenue up 22% YoY.",
        "source": "quarterly_report.pdf"
    },
    "campaign_summary": {
        "title": "Campaign Performance Summary",
        "content": "Comedy genre underperforming due to low marketing spend ($60K-$80K vs $300K+ for top titles). Instagram and YouTube campaigns outperformed TV by 3x ROI.",
        "source": "campaign_summary.pdf"
    },
    "audience_report": {
        "title": "Audience Behavior Report",
        "content": "18-24 age group drives 60% of Sci-Fi views. Mumbai and Bangalore are top engagement cities. Completion rate above 85% for Action and Sci-Fi.",
        "source": "audience_report.pdf"
    },
    "leadership_recommendations": {
        "title": "Leadership Recommendations Q3",
        "content": "Increase Sci-Fi and Action budgets by 30%. Pause comedy investment. Focus regional campaigns on Mumbai and Bangalore.",
        "source": "content_roadmap.pdf"
    }
}

@router.get("/documents")
def list_documents():
    return [{"id": k, "title": v["title"], "source": v["source"]} for k, v in PDF_KNOWLEDGE.items()]

@router.get("/documents/{doc_id}")
def get_document(doc_id: str):
    if doc_id not in PDF_KNOWLEDGE:
        return {"error": "Document not found"}
    return PDF_KNOWLEDGE[doc_id]

@router.get("/documents/search/{keyword}")
def search_documents(keyword: str):
    results = []
    for k, v in PDF_KNOWLEDGE.items():
        if keyword.lower() in v["content"].lower() or keyword.lower() in v["title"].lower():
            results.append({"id": k, "title": v["title"], "snippet": v["content"][:100] + "..."})
    return results if results else {"message": "No documents found"}