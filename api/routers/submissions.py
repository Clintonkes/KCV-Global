from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from database import models, schemas
from .auth import get_current_user, get_current_user_optional
from utils import email

router = APIRouter()

@router.post("/", response_model=schemas.Submission)
def submit_work(submission_data: schemas.SubmissionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user_optional)):
    new_submission = models.Submission(
        artist_id=current_user.id if current_user else None,
        name=submission_data.name if not current_user else current_user.username,
        email=submission_data.email if not current_user else current_user.email,
        category=submission_data.category,
        bio=submission_data.bio,
        status="pending"
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    
    email.send_application_received_email(
        to_email=new_submission.email,
        name=new_submission.name,
        category=new_submission.category
    )
    
    return new_submission

@router.get("/my", response_model=List[schemas.Submission])
def my_submissions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Submission).filter(models.Submission.artist_id == current_user.id).all()

@router.get("/", response_model=List[schemas.Submission])
def list_all_submissions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.Submission).all()

@router.put("/{submission_id}", response_model=schemas.Submission)
def review_submission(submission_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.status = status
    
    # If approved, upgrade user role to 'artist'
    if status == "approved":
        artist = db.query(models.User).filter(models.User.id == submission.artist_id).first()
        if artist:
            artist.role = "artist"
            artist.is_creator = True
            
        email.send_application_accepted_email(
            to_email=submission.email,
            name=submission.name
        )
    
    db.commit()
    db.refresh(submission)
    return submission
