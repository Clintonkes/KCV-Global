from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.session import get_db
from database import models, schemas
from .auth import get_current_user, get_current_user_optional
from utils import email

router = APIRouter()

@router.get("/", response_model=List[schemas.Session])
def list_available_slots(date: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Session)
    if date:
        query = query.filter(models.Session.date == date)
    return query.all()

@router.post("/book", response_model=schemas.Session)
def book_session(session_data: schemas.SessionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user_optional)):
    new_session = models.Session(
        client_id=current_user.id if current_user else None,
        email=session_data.email if not current_user else current_user.email,
        guest_name=session_data.guest_name,
        date=session_data.date,
        time_slot=session_data.time_slot,
        type=session_data.type,
        notes=session_data.notes,
        status="pending"
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    email.send_booking_received_email(
        to_email=new_session.email,
        guest_name=new_session.guest_name,
        date=new_session.date,
        time_slot=new_session.time_slot,
        type=new_session.type
    )
    
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
    
    if status.lower() == "confirmed":
        email.send_booking_accepted_email(
            to_email=session.email,
            guest_name=session.guest_name,
            date=session.date,
            time_slot=session.time_slot,
            type=session.type
        )
        
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
