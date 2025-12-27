from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
import os
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from app.config import settings

router = APIRouter()

# Initialize S3 client only if credentials are provided
s3_client: Optional[boto3.client] = None
if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY and settings.AWS_S3_BUCKET:
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
    except Exception:
        s3_client = None


@router.post("/")
async def upload_images(files: List[UploadFile] = File(...)):
    """
    Upload one or more images to S3 and return their URLs.
    For MVP, we'll store images locally if S3 is not configured.
    """
    uploaded_urls = []
    
    for file in files:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not an image")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        try:
            file_content = await file.read()
            
            # For MVP: If S3 is configured, upload to S3, otherwise save locally
            if s3_client and settings.AWS_S3_BUCKET:
                # Upload to S3
                s3_key = f"clothing-items/{unique_filename}"
                s3_client.put_object(
                    Bucket=settings.AWS_S3_BUCKET,
                    Key=s3_key,
                    Body=file_content,
                    ContentType=file.content_type
                )
                # Generate public URL (or use CloudFront if configured)
                image_url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
            else:
                # Local storage for development
                upload_dir = "uploads"
                os.makedirs(upload_dir, exist_ok=True)
                file_path = os.path.join(upload_dir, unique_filename)
                with open(file_path, "wb") as f:
                    f.write(file_content)
                image_url = f"/uploads/{unique_filename}"
            
            uploaded_urls.append(image_url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload {file.filename}: {str(e)}")
    
    return {"image_urls": uploaded_urls}

