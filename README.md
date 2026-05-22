# Skin Disease Detection

A web application that uses a fine-tuned EfficientNet-B4 model to classify 9 common skin conditions from a user-uploaded image.

---

## Architecture

```
┌─────────────────────────┐        HTTPS POST /predict        ┌──────────────────────────┐
│      Frontend           │  ─────────────────────────────►  │       Backend            │
│   Vercel (static)       │                                   │   HF Spaces (Docker)     │
│                         │  ◄─────────────────────────────  │                          │
│  HTML · CSS · JS        │        JSON predictions           │  Flask · PyTorch · timm  │
└─────────────────────────┘                                   └──────────┬───────────────┘
                                                                         │ downloads on
                                                                         │ first boot
                                                                         ▼
                                                              ┌──────────────────────────┐
                                                              │    HF Hub Model Repo     │
                                                              │  best_model.pth (~212MB) │
                                                              └──────────────────────────┘
```

| Layer | Platform | Purpose |
|---|---|---|
| Frontend | Vercel | Static site — UI, image upload, results display |
| Backend API | Hugging Face Spaces | Flask server — image preprocessing and inference |
| Model weights | Hugging Face Hub | `/skin-disease-model` |

---

## Project Structure

```
web/
├── frontend/                   # Deployed to Vercel
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   ├── finisher-header.es5.min.js
│   └── assets/                 # Static images used in the UI
│
└── backend/                    # Deployed to HF Spaces (skin_be)
    ├── app.py                  # Flask API server
    ├── model.py                # EfficientNet-B4 model definition
    ├── config.py               # Class names, image size, paths
    ├── requirements.txt
    ├── Dockerfile
    └── checkpoints/            # model weights land here at runtime
```

---

## Model

- **Architecture:** EfficientNet-B4 backbone (via `timm`) with a custom classification head
- **Input:** RGB image resized to 380×380, normalised with ImageNet mean/std
- **Output:** Softmax probabilities over 9 classes
- **Weights:** Downloaded automatically from HF Hub on first startup

### Classification Head

```
BatchNorm1d → Dropout(0.4) → Linear(features→512) → SiLU
→ BatchNorm1d → Dropout(0.2) → Linear(512→9)
```

### Detectable Conditions

| # | Condition |
|---|---|
| 1 | Acne |
| 2 | Actinic Keratosis & Basal Cell Carcinoma |
| 3 | Bacterial Impetigo |
| 4 | Eczema |
| 5 | Healthy / Normal Skin |
| 6 | Melanoma, Skin Cancer, Nevi & Moles |
| 7 | Psoriasis |
| 8 | Vitiligo |
| 9 | Warts, Molluscum & Other Viral Infections |

---

## API

**Base URL:** `https://skin-be.hf.space`

### `GET /`
Health check. Returns `{"status": "ok"}`.

### `POST /predict`
Accepts a multipart form upload and returns ranked predictions.

**Request**
```
Content-Type: multipart/form-data
Field: image  (JPEG / PNG file)
```

**Response**
```json
{
  "predictions": [
    { "class": "Eczema",  "confidence": 0.8712 },
    { "class": "Psoriasis", "confidence": 0.0921 },
    ...
  ]
}
```
Predictions are sorted by confidence, highest first.

---

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py          # runs on http://localhost:7860
```

Place `best_model.pth` in `backend/checkpoints/` or let the app download it automatically on first run.

### Frontend

Open `frontend/index.html` directly in a browser, or serve it with any static file server:

```bash
cd frontend
npx serve .
```

Update the `fetch` URL in `main.js` to point to `http://localhost:7860/predict` for local testing.

---

## Deployment

### Backend → HF Spaces

1. Create a Space at `huggingface.co/spaces` with **Docker** SDK.
2. Push the contents of `backend/` to the Space repository.
3. The Space builds from `Dockerfile` and auto-downloads the model weights on first boot.

### Frontend → Vercel

1. Import the GitHub repository into Vercel.
2. Set the **Root Directory** to `frontend/`.
3. Vercel detects a static site — no build step needed.

---

## Disclaimer

This tool is not a substitute for professional medical diagnosis. Always consult a qualified dermatologist before drawing any clinical conclusions.
