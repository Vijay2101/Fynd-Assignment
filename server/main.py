from fastapi import FastAPI, HTTPException
from schemas import ReviewCreate, ReviewSubmitResponse, AdminReview
from llm import call_llm
from datetime import datetime
import json
import uuid
import os
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Feedback System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


mongo_uri = os.environ.get("MONGO_URI")

client = MongoClient(mongo_uri)
db = client["fynd"]              # Database name
user_collection = db["reviews"]  

@app.post("/reviews", response_model=ReviewSubmitResponse)
def submit_review(payload: ReviewCreate):
    review_text = payload.review.strip() if payload.review else ""
    if review_text == "":
        prompt_review_text = "No written feedback provided."

    prompt = f"""
You are an AI feedback system.

User Rating: {payload.rating}
User Review: {prompt_review_text}

Return STRICT JSON:
{{
  "ai_response": "Polite response to the user",
  "ai_summary": "Short admin-facing summary",
  "ai_actions": "Recommended next actions"
}}
"""

    try:
        llm_raw = call_llm(prompt)
        llm_data = json.loads(llm_raw)
    except Exception:
        raise HTTPException(status_code=500, detail="LLM processing failed")

    try:
        user_collection.insert_one({
            "_id": str(uuid.uuid4()),
            "rating": payload.rating,
            "review": review_text,
            "ai_response": llm_data["ai_response"],
            "ai_summary": llm_data["ai_summary"],
            "ai_actions": llm_data["ai_actions"],
            "created_at": datetime.utcnow()
        })
    except Exception:
        raise HTTPException(status_code=500, detail="Database write failed")

    return {
        "status": "success",
        "ai_response": llm_data["ai_response"]
    }


@app.get("/admin/reviews", response_model=list[AdminReview])
def get_admin_reviews():
    try:
        docs = user_collection.find({}, {
            "_id": 0,
            "rating": 1,
            "review": 1,
            "ai_summary": 1,
            "ai_actions": 1
        }).sort("created_at", -1)
    except Exception:
        raise HTTPException(status_code=500, detail="Database read failed")

    return list(docs)
