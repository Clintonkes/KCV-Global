from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from database import models, schemas
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.Submission)
def submit_work(submission_data: schemas.SubmissionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_submission = models.Submission(
        artist_id=current_user.id,
        category=submission_data.category,
        bio=submission_data.bio,
        status="pending"
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
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
    
    db.commit()
    db.refresh(submission)
    return submission
