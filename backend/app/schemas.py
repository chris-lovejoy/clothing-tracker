from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ClothingItemBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    tags: List[str] = []
    notes: Optional[str] = None
    owner: str = "default"


class ClothingItemCreate(ClothingItemBase):
    image_urls: List[str] = []


class ClothingItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    image_urls: Optional[List[str]] = None
    owner: Optional[str] = None


class ClothingItem(ClothingItemBase):
    id: int
    image_urls: List[str] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

