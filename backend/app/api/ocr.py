"""
OCR endpoint for unstructured docs (PDFs, images, handwritten, printouts).
1. If PDF has a text layer → extract with pdfplumber.
2. Otherwise convert pages to images → run Donut-base (via HF API).
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pdf2image import convert_from_bytes
from PIL import Image
from io import BytesIO
import base64, requests, os, pdfplumber
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "naver-clova-ix/donut-base")
HF_URL   = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN missing in .env")

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type":  "application/json"
}

def pil_to_data_uri(img: Image.Image) -> str:
    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()

@router.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    name = file.filename.lower()
    content = await file.read()

    # 1) Try pdfplumber for digital PDF
    if name.endswith(".pdf"):
        try:
            texts = []
            with pdfplumber.open(BytesIO(content)) as pdf:
                for i, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text() or ""
                    # you can also grab page.rects/textboxes for bboxes here
                    texts.append({"page": i, "text": text})
            # if we got non-empty text, return it immediately
            if any(p["text"].strip() for p in texts):
                return {"pages": texts}
        except Exception:
            pass  # fallback to image OCR

    # 2) Otherwise (or if pdfplumber gave nothing): image‐based OCR
    #    convert PDF → images or load image directly
    pages = []
    if name.endswith(".pdf"):
        pages = convert_from_bytes(content)
    elif name.endswith((".png", ".jpg", ".jpeg")):
        img = Image.open(BytesIO(content)).convert("RGB")
        pages = [img]
    else:
        raise HTTPException(400, "Unsupported file type")

    results = []
    for i, page in enumerate(pages, start=1):
        data_uri = pil_to_data_uri(page)
        payload = {"inputs": f"data:image/png;base64,{data_uri}"}

        r = requests.post(HF_URL, headers=headers, json=payload, timeout=60)
        if r.status_code != 200:
            raise HTTPException(r.status_code, f"HF error: {r.text}")

        try:
            gen = r.json().get("generated_text", "")
        except Exception:
            raise HTTPException(500, f"Invalid JSON from HF: {r.text}")

        results.append({"page": i, "text": gen})

    return {"pages": results}
