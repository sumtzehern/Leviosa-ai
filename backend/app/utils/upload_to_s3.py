import boto3
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)

def upload_file_to_s3(file_bytes: bytes, filename: str, content_type: str = "application/pdf") -> str:
    bucket_name = os.getenv("S3_BUCKET_NAME")
    if not bucket_name:
        raise ValueError("S3_BUCKET_NAME environment variable is not set.")
    unique_name = f"{uuid.uuid4().hex}_{filename}"

   # put file in s3
    s3_client.put_object(
        Bucket=bucket_name,
        Key=unique_name,
        Body=file_bytes,
        ContentType = content_type,
    )

    return f"https://{bucket_name}.s3.amazonaws.com/{unique_name}"

