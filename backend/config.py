import os

# ── Classes ───────────────────────────────────────────────────────────────────
CLASS_NAMES = [
    "Acne",
    "Actinic Keratosis_ Basal cell carcinoma",
    "Ba Impetigo",
    "Eczema",
    "Healthy_Normal Skin",
    "Melanoma Skin Cancer Nevi And Moles",
    "Psoriasis",
    "Vitiligo",
    "Warts Molluscum And Other Viral Infections",
]
NUM_CLASSES = len(CLASS_NAMES)

# ── Model ─────────────────────────────────────────────────────────────────────
MODEL_NAME   = "efficientnet_b4"
PRETRAINED   = False          # inference only — no download needed
IMAGE_SIZE   = 380
DROPOUT_RATE = 0.4

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR        = os.path.dirname(__file__)
BEST_MODEL_PATH = os.path.join(BASE_DIR, "checkpoints", "best_model.pth")

# ── Normalisation ─────────────────────────────────────────────────────────────
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]
