from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from pydantic import BaseModel
from database.session import get_db
from database import models, schemas
from .auth import get_current_user

router = APIRouter()

class RoleUpdate(BaseModel):
    role: str

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_users = db.query(models.User).count()
    total_revenue = db.query(func.sum(models.Order.total_amount)).filter(models.Order.status == "paid").scalar() or 0.0
    total_bookings = db.query(models.Session).count()
    total_orders = db.query(models.Order).count()
    total_photos = db.query(models.Photo).count()
    total_submissions = db.query(models.Submission).count()
    
    return {
        "total_users": total_users,
        "total_revenue": total_revenue,
        "total_bookings": total_bookings,
        "total_orders": total_orders,
        "total_photos": total_photos,
        "total_submissions": total_submissions
    }

@router.get("/users", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.User).all()

@router.get("/debug-uploads")
def debug_uploads(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ROOT_DIR = os.path.dirname(BASE_DIR) if os.path.basename(BASE_DIR) == "api" else BASE_DIR
    UPLOAD_PATH = os.path.join(ROOT_DIR, "uploads")
    
    files = []
    if os.path.exists(UPLOAD_PATH):
        for root, dirs, filenames in os.walk(UPLOAD_PATH):
            for f in filenames:
                files.append(os.path.join(root, f))
    
    return {
        "root_dir": ROOT_DIR,
        "upload_path": UPLOAD_PATH,
        "exists": os.path.exists(UPLOAD_PATH),
        "files": files
    }

@router.put("/users/{user_id}", response_model=schemas.User)
def update_user_role(user_id: int, body: RoleUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = body.role
    db.commit()
    db.refresh(user)
    return user
