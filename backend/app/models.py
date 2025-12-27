from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ARRAY
from sqlalchemy.sql import func
from app.database import Base


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # e.g., Tops, Bottoms, Dresses, etc.
    subcategory = Column(String, nullable=True)  # e.g., T-shirts, Jeans, etc.
    brand = Column(String, nullable=True)
    purchase_date = Column(DateTime, nullable=True)
    purchase_price = Column(Float, nullable=True)
    tags = Column(ARRAY(String), default=[])
    notes = Column(Text, nullable=True)
    image_urls = Column(ARRAY(String), default=[])  # URLs to images stored in S3
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner = Column(String, default="default")  # For multi-user support later

