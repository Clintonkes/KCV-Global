from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.session import get_db
from database import models, schemas
from .auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Session])
def list_available_slots(date: Optional[str] = None, db: Session = Depends(get_db)):
    # In a real app, logic would filter based on existing bookings
    # For now, just returning all bookings as a simplified list
    query = db.query(models.Session)
    if date:
        query = query.filter(models.Session.date == date)
    return query.all()

@router.post("/book", response_model=schemas.Session)
def book_session(session_data: schemas.SessionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_session = models.Session(
        client_id=current_user.id,
        date=session_data.date,
        time_slot=session_data.time_slot,
        type=session_data.type,
        notes=session_data.notes,
        status="pending"
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.get("/my", response_model=List[schemas.Session])
def my_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Session).filter(models.Session.client_id == current_user.id).all()

@router.put("/{session_id}", response_model=schemas.Session)
def update_session_status(session_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = status
    db.commit()
    db.refresh(session)
    return session

@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.client_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(session)
    db.commit()
    return {"message": "Session cancelled"}
