from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import items, upload
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clothing Tracker API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files locally (for development)
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])


@app.get("/")
def read_root():
    return {"message": "Clothing Tracker API"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

