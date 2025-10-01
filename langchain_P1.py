from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser

app = Flask(__name__)


llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
    # other params...
)


# Define JSON output structure
class AIResponse(BaseModel):
    summary: str = Field(description="Summary of the user's message")
    sentiment: int = Field(
        description="Sentiment score from 0 (negative) to 100 (positive)"
    )
    response: str = Field(description="Suggested response to the user")


@app.route("/generate", methods=["POST"])
def generate():
    input = request.json["input"]
    # This is where we'll add our AI logic later
    res = llm.invoke(input)
    print(res)
    return jsonify({"message": res.content})


if __name__ == "__main__":
    app.run(debug=True)
