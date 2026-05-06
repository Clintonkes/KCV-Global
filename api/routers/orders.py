from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from database import models, schemas
from .auth import get_current_user, get_current_user_optional
from utils import email
import os

router = APIRouter()



@router.post("/checkout")
def checkout(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user_optional)):
    try:
        new_order = models.Order(
            user_id=current_user.id if current_user else None,
            email=order_data.email if not current_user else current_user.email,
            total_amount=order_data.total_amount,
            items=order_data.items,
            status="pending",
            stripe_intent_id=None # No stripe for this flow
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        email.send_checkout_received_email(
            to_email=new_order.email,
            order_id=new_order.id,
            total_amount=new_order.total_amount
        )
        
        return {
            "status": "pending",
            "order_id": new_order.id,
            "message": "Order request received! Check your email for details."
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/all", response_model=List[schemas.Order])
def list_all_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

@router.get("/", response_model=List[schemas.Order])
def list_my_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return order

@router.put("/{order_id}", response_model=schemas.Order)
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    db.refresh(order)
    
    email.send_order_status_email(
        to_email=order.email,
        order_id=order.id,
        status=status
    )
    
    return order
