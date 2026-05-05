from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from database import models, schemas
from .auth import get_current_user
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/checkout", response_model=schemas.Order)
def checkout(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # In a real app, you would validate product availability and calculate price server-side
    
    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(order_data.total_amount * 100),
            currency='usd',
            metadata={'user_id': current_user.id}
        )
        
        new_order = models.Order(
            user_id=current_user.id,
            total_amount=order_data.total_amount,
            items=order_data.items,
            status="pending",
            stripe_intent_id=intent.id
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        # We attach the client_secret to the order object for the frontend to use
        order_dict = schemas.Order.from_orm(new_order).dict()
        order_dict['client_secret'] = intent.client_secret
        return order_dict
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.Order])
def list_my_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return order
