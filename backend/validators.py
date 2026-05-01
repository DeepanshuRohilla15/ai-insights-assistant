from pydantic import BaseModel, validator

class ChatRequest(BaseModel):
    question: str

    @validator("question")
    def question_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Question cannot be empty")
        if len(v) > 1000:
            raise ValueError("Question too long, max 1000 characters")
        return v.strip()