// ── YouTube video helpers ────────────────────────────────────────────────────
function loadVideo(videoId) {
  document.getElementById("ytvid").innerHTML =
    `<iframe width="92.5%" height="90%" src="https://www.youtube.com/embed/${videoId}"
      style="border-radius:10px;" allowfullscreen></iframe>`;
  document.getElementById("ytvid").scrollIntoView({ behavior: "smooth" });
}
function ytbuttonMD() { loadVideo("-uf1mOu98V8"); }  // Melanoma Diagnosis
function ytbuttonMT() { loadVideo("bjN3XlTXaIc"); }  // Melanoma Treatment
function ytbuttonA()  { loadVideo("h3kn_Lf7BHE"); }  // Acne
function ytbuttonE()  { loadVideo("fmurdUlmaIg"); }  // Eczema
function ytbuttonV()  { loadVideo("nTqY7DIoLpI"); }  // Vitiligo
function ytbuttonP()  { loadVideo("l2L7B70ZXt8"); }  // Psoriasis
function ytbuttonAK() { loadVideo("Ndi5UklInSc"); }  // Actinic Keratosis / BCC
function ytbuttonI()  { loadVideo("oUq7UeVEoDA"); }  // Impetigo
function ytbuttonW()  { loadVideo("4DkR7E2yZqU"); }  // Warts & Molluscum

function detectnow() {
  document.getElementById("detection").scrollIntoView({ behavior: "smooth" });
}

// ── DOM refs ─────────────────────────────────────────────────────────────────
const imageInput    = document.getElementById("imageInput");
const imagePreview  = document.getElementById("imagePreview");
const analyzeButton = document.getElementById("analyzeButton");
const resultDisplay = document.getElementById("result");
const pasteZone     = document.getElementById("pasteZone");
const pasteLabel    = document.getElementById("pasteLabel");

// ── Display names (clean labels for each model class) ────────────────────────
const DISPLAY_NAMES = {
  "Acne":                                        "Acne",
  "Actinic Keratosis_ Basal cell carcinoma":     "Actinic Keratosis / Basal Cell Carcinoma",
  "Ba Impetigo":                                 "Bacterial Impetigo",
  "Eczema":                                      "Eczema",
  "Healthy_Normal Skin":                         "Healthy Skin",
  "Melanoma Skin Cancer Nevi And Moles":         "Melanoma",
  "Psoriasis":                                   "Psoriasis",
  "Vitiligo":                                    "Vitiligo",
  "Warts Molluscum And Other Viral Infections":  "Warts & Molluscum",
};

// ── Clipboard paste state ─────────────────────────────────────────────────────
let pastedFile = null;

function showImagePreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function setPasteZonePasted() {
  pasteZone.classList.add("pasted");
  pasteLabel.textContent = "✓ Image pasted — ready to analyse";
}

function resetPasteZone() {
  pasteZone.classList.remove("pasted");
  pasteLabel.innerHTML = 'or press <kbd>Ctrl+V</kbd> to paste from clipboard';
}

// ── Image preview — file input ────────────────────────────────────────────────
imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    pastedFile = null;
    resetPasteZone();
    showImagePreview(file);
  }
});

// ── Image preview — clipboard paste ──────────────────────────────────────────
document.addEventListener("paste", function (event) {
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith("image")) {
      pastedFile = item.getAsFile();
      showImagePreview(pastedFile);
      setPasteZonePasted();
      break;
    }
  }
});

// ── Disease info database ─────────────────────────────────────────────────────
const DISEASE_INFO = {
  "Acne": {
    buttons: `<button onclick="ytbuttonA()" id="vidbutton">Video</button>`,
    tips: [
      "Wash your face twice daily with a gentle cleanser.",
      "Avoid touching or popping pimples.",
      "Use non-comedogenic skincare products.",
      "Consider OTC treatments with benzoyl peroxide or salicylic acid.",
      "Consult a dermatologist for prescription treatments if acne persists.",
    ],
  },
  "Actinic Keratosis_ Basal cell carcinoma": {
    buttons: `<button onclick="ytbuttonAK()" id="vidbutton">Video</button>`,
    tips: [
      "Avoid excessive sun exposure and use SPF 30+ sunscreen daily.",
      "Wear protective clothing and wide-brimmed hats outdoors.",
      "Schedule regular skin checks with a dermatologist.",
      "Do not ignore rough, scaly, or crusty skin patches.",
      "Early treatment options include cryotherapy, topical creams, or surgery.",
    ],
  },
  "Ba Impetigo": {
    buttons: `<button onclick="ytbuttonI()" id="vidbutton">Video</button>`,
    tips: [
      "Keep the affected area clean and avoid touching or scratching sores.",
      "Wash hands frequently to prevent spreading the infection.",
      "Use antibiotic cream or oral antibiotics as prescribed by a doctor.",
      "Avoid sharing towels, clothing, or personal items.",
      "Keep infected children away from school until the sores heal.",
    ],
  },
  "Eczema": {
    buttons: `<button onclick="ytbuttonE()" id="vidbutton">Video</button>`,
    tips: [
      "Keep your skin moisturized using fragrance-free creams or ointments.",
      "Avoid triggers like harsh soaps, allergens, or extreme temperatures.",
      "Use mild, unscented detergents for clothing.",
      "Apply medicated creams like corticosteroids as prescribed.",
      "Consult a dermatologist if symptoms worsen or persist.",
    ],
  },
  "Healthy_Normal Skin": {
    buttons: ``,
    tips: [
      "Great news — no disease detected! Maintain healthy skin with daily moisturiser.",
      "Use sunscreen (SPF 30+) every day, even when it is cloudy.",
      "Stay hydrated and eat a balanced diet rich in antioxidants.",
      "Cleanse gently and avoid harsh scrubbing.",
      "Schedule a yearly skin check with a dermatologist as a precaution.",
    ],
  },
  "Melanoma Skin Cancer Nevi And Moles": {
    buttons: `<button onclick="ytbuttonMD()" id="vidbutton">Diagnosis Video</button>
              <button onclick="ytbuttonMT()" id="vidbutton">Treatment Video</button>`,
    tips: [
      "Perform regular self-checks for new or changing moles using the ABCDE rule.",
      "Wear sunscreen and protective clothing to reduce UV exposure.",
      "Consult a dermatologist immediately for suspicious skin changes.",
      "Early-stage melanoma is typically treated with surgery.",
      "Advanced cases may require immunotherapy, targeted therapy, or radiation.",
    ],
  },
  "Psoriasis": {
    buttons: `<button onclick="ytbuttonP()" id="vidbutton">Video</button>`,
    tips: [
      "Moisturise daily to reduce dryness and flaking.",
      "Avoid triggers such as stress, infections, and certain medications.",
      "Topical treatments (corticosteroids, vitamin D analogues) can reduce plaques.",
      "Phototherapy (UVB light therapy) is effective for moderate to severe cases.",
      "Consult a dermatologist — biologic medications are available for severe psoriasis.",
    ],
  },
  "Vitiligo": {
    buttons: `<button onclick="ytbuttonV()" id="vidbutton">Video</button>`,
    tips: [
      "Protect affected skin from sun exposure using sunscreen (SPF 30 or higher).",
      "Consider topical treatments like corticosteroids or calcineurin inhibitors.",
      "Phototherapy (light therapy) may help restore pigmentation.",
      "Skin grafting or depigmentation therapy may be recommended in some cases.",
      "Seek guidance from a dermatologist for a personalised treatment plan.",
    ],
  },
  "Warts Molluscum And Other Viral Infections": {
    buttons: `<button onclick="ytbuttonW()" id="vidbutton">Video</button>`,
    tips: [
      "Avoid touching or picking at warts or molluscum lesions.",
      "Wash hands frequently to prevent spreading.",
      "Many lesions resolve on their own over months to years.",
      "Treatment options include cryotherapy, topical acids, or curettage.",
      "Consult a dermatologist if lesions spread, multiply, or cause discomfort.",
    ],
  },
};

// ── Analyse button ────────────────────────────────────────────────────────────
analyzeButton.addEventListener("click", async () => {
  const file = pastedFile || imageInput.files[0];
  if (!file) {
    resultDisplay.innerHTML = '<div class="result-warn">Please select or paste an image first.</div>';
    return;
  }

  resultDisplay.innerHTML = '<div class="result-confidence">Analysing…</div>';
  document.getElementById("newbutton").innerHTML = "";
  document.getElementById("info").innerHTML = "";
  document.getElementById("ytvid").innerHTML = "";

  const formData = new FormData();
  formData.append("image", file);

  let data;
  try {
    const response = await fetch("https://vh-2011-skin-be.hf.space/predict", { method: "POST", body: formData });
    data = await response.json();
  } catch (err) {
    resultDisplay.innerHTML =
      '<div class="result-warn">Could not reach the server. Please try again later.</div>';
    return;
  }

  if (data.error) {
    resultDisplay.innerHTML = `<div class="result-warn">${data.error}</div>`;
    return;
  }

  const predictions = data.predictions;   // sorted descending by confidence
  const top         = predictions[0];
  const topName     = DISPLAY_NAMES[top.class] || top.class;
  const topPct      = (top.confidence * 100).toFixed(1);

  if (top.confidence > 0.79) {
    resultDisplay.innerHTML = `
      <div class="result-primary">${topName}</div>
      <div class="result-confidence">${topPct}% confidence</div>`;
  } else {
    const second     = predictions[1];
    const secondName = DISPLAY_NAMES[second.class] || second.class;
    const secondPct  = (second.confidence * 100).toFixed(1);
    resultDisplay.innerHTML = `
      <div class="result-primary">${topName}</div>
      <div class="result-confidence">${topPct}% — most likely</div>
      <div class="result-also">Also possible: <strong>${secondName}</strong> &mdash; ${secondPct}%</div>`;
  }

  // Disease-specific tips and video buttons
  const info = DISEASE_INFO[top.class];
  if (info) {
    document.getElementById("newbutton").innerHTML = info.buttons;
    const tipsList = info.tips.map((t, i) => `${i + 1}. ${t}`).join("<br>");
    document.getElementById("info").innerHTML =
      "<h2>Please consult a medical specialist, but here are some standard tips:</h2><br>" +
      tipsList;
  }
});
