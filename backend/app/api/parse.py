# upload pdf file and parse it
from app.utils.upload_to_s3 import upload_file_to_s3
from fastapi import APIRouter, UploadFile, File # type: ignore
from typing import List
import os
import shutil
import uuid


router = APIRouter()

@router.post("/parse")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload and parse PDF files.
    """
    upload_files = []

    for file in files:
        file_bytes = await file.read()
        s3_url = upload_file_to_s3(file_bytes, file.filename)

        upload_files.append({
            "filename": file.filename,
            "s3_url": s3_url,
        })

    return {"Uploaded Files": upload_files}

