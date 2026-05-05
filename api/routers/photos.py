from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from database.session import get_db
from database import models, schemas
from .auth import get_current_user
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads/photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[schemas.Photo])
def list_photos(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Photo).filter(models.Photo.is_published == True)
    if category:
        query = query.filter(models.Photo.category == category)
    return query.all()

@router.post("/", response_model=schemas.Photo)
def create_photo(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    price: Optional[float] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    new_photo = models.Photo(
        title=title,
        description=description,
        category=category,
        price=price,
        url=f"/uploads/photos/{file.filename}"
    )
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo

@router.delete("/{photo_id}")
def delete_photo(photo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted"}
