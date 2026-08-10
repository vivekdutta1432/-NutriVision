from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
from PIL import Image
import os
import json

# Load environment variables
load_dotenv()

# Configure Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Flask App
app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Home Page
@app.route("/")
def home():
    return render_template("index.html")


# Analyze Food Image
@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    img = Image.open(filepath)

    prompt = """
You are an expert nutritionist.

Analyze the uploaded food image.

Return ONLY valid JSON.

{
    "food_name":"",
    "confidence":"",
    "serving_size":"",
    "meal_type":"",
    "ingredients":[],
    "calories":"",
    "protein":"",
    "carbs":"",
    "fat":"",
    "fiber":"",
    "sugar":"",
    "sodium":"",
    "vitamins":[],
    "nutrition_score":"",
    "healthiness":"",
    "health_tips":[],
    "muscle_gain_tip":"",
    "weight_loss_tip":"",
    "heart_health_tip":"",
    "diabetes_tip":"",
    "allergens":[],
    "vegetarian":"",
    "summary":""
}

Rules:

- Return ONLY JSON.
- No markdown.
- No explanation.
- Estimate values if necessary.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[prompt, img]
        )

        text = response.text.strip()

        # Remove markdown if Gemini returns it
        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        data = json.loads(text)

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)