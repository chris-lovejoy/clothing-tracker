from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from app.database import get_db
from app.models import ClothingItem
from app.schemas import ClothingItem as ClothingItemSchema, ClothingItemCreate, ClothingItemUpdate

router = APIRouter()


@router.post("/", response_model=ClothingItemSchema)
def create_item(item: ClothingItemCreate, db: Session = Depends(get_db)):
    db_item = ClothingItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/", response_model=List[ClothingItemSchema])
def get_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|name|category|purchase_date)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    owner: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ClothingItem)
    
    # Apply filters
    if category:
        query = query.filter(ClothingItem.category == category)
    if subcategory:
        query = query.filter(ClothingItem.subcategory == subcategory)
    if brand:
        query = query.filter(ClothingItem.brand == brand)
    if owner:
        query = query.filter(ClothingItem.owner == owner)
    if search:
        search_filter = or_(
            ClothingItem.name.ilike(f"%{search}%"),
            ClothingItem.description.ilike(f"%{search}%"),
            ClothingItem.brand.ilike(f"%{search}%"),
            ClothingItem.notes.ilike(f"%{search}%"),
            func.array_to_string(ClothingItem.tags, ',').ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Apply sorting
    sort_column = getattr(ClothingItem, sort_by, ClothingItem.created_at)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    items = query.offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model=ClothingItemSchema)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ClothingItem).filter(ClothingItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=ClothingItemSchema)
def update_item(item_id: int, item: ClothingItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(ClothingItem).filter(ClothingItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = item.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ClothingItem).filter(ClothingItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}


@router.get("/filters/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(ClothingItem.category).distinct().all()
    return [cat[0] for cat in categories if cat[0] is not None]


@router.get("/filters/brands", response_model=List[str])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(ClothingItem.brand).distinct().all()
    return [brand[0] for brand in brands if brand[0] is not None]

