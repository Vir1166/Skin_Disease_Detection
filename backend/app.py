"""
Standalone Flask server for the Skin Disease Detection web app.

Usage (from inside the web/ folder):
    pip install -r requirements.txt
    python app.py

Then open  http://localhost:5000  in your browser.
"""

import io
import os
import urllib.request
from pathlib import Path

import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn.functional as F
import albumentations as A
from albumentations.pytorch import ToTensorV2

import config
from model import load_model

HF_MODEL_URL = (
    "https://huggingface.co/aaryan-athena/skin-disease-model/resolve/main/best_model.pth"
)

# ── App ───────────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ── Load model ────────────────────────────────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model  = None

def init_model():
    global model
    checkpoint = Path(config.BEST_MODEL_PATH)
    if not checkpoint.exists():
        print(f"Downloading model from Hugging Face …")
        checkpoint.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(HF_MODEL_URL, checkpoint)
        print("Download complete.")
    print(f"Loading model from {checkpoint} …")
    model = load_model(str(checkpoint), DEVICE)
    print(f"Model ready  ({DEVICE})")

TRANSFORM = A.Compose([
    A.Resize(height=config.IMAGE_SIZE, width=config.IMAGE_SIZE),
    A.Normalize(mean=config.MEAN, std=config.STD),
    ToTensorV2(),
])

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({
            "error": "Model not loaded. Place best_model.pth in web/checkpoints/ and restart."
        }), 503

    if "image" not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    try:
        img    = Image.open(io.BytesIO(request.files["image"].read())).convert("RGB")
        tensor = TRANSFORM(image=np.array(img))["image"].unsqueeze(0).to(DEVICE)
    except Exception as e:
        return jsonify({"error": f"Could not process image: {e}"}), 400

    with torch.no_grad():
        probs = F.softmax(model(tensor), dim=1)[0]

    predictions = sorted(
        [{"class": config.CLASS_NAMES[i], "confidence": round(probs[i].item(), 4)}
         for i in range(config.NUM_CLASSES)],
        key=lambda x: x["confidence"],
        reverse=True,
    )
    return jsonify({"predictions": predictions})


# ── Entry point ───────────────────────────────────────────────────────────────
init_model()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)
