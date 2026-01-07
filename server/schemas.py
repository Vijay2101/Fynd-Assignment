from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review: str | None = ""

class ReviewSubmitResponse(BaseModel):
    status: str
    ai_response: str

class AdminReview(BaseModel):
    rating: int
    review: str
    ai_summary: str
    ai_actions: str
