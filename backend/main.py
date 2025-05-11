from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from typing import List
from app.api.parse import router as parse_router  # type: ignore
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Leviosa API")

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to Leviosa API"}

app.include_router(parse_router, prefix="/api") # type: ignore
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")