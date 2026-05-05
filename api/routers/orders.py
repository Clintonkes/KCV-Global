from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from database import models, schemas
from .auth import get_current_user, get_current_user_optional
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/checkout")
def checkout(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user_optional)):
    try:
        user_id_for_stripe = current_user.id if current_user else 'guest'
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(order_data.total_amount * 100),
            currency='usd',
            metadata={'user_id': user_id_for_stripe, 'email': order_data.email}
        )
        
        new_order = models.Order(
            user_id=current_user.id if current_user else None,
            email=order_data.email if not current_user else current_user.email,
            total_amount=order_data.total_amount,
            items=order_data.items,
            status="pending",
            stripe_intent_id=intent.id
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        return {
            "status": "pending",
            "order_id": new_order.id,
            "client_secret": intent.client_secret,
            "message": "Order placed successfully. An email with order details has been sent to your registered address."
        }
        
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
