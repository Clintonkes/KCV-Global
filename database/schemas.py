from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    is_creator: bool
    bio: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Photo Schemas
class PhotoBase(BaseModel):
    title: str
    description: str
    category: str
    price: Optional[float] = None
    is_published: Optional[bool] = True

class PhotoCreate(PhotoBase):
    url: str

class Photo(PhotoBase):
    id: int
    url: str
    created_at: datetime

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str

class ProductCreate(ProductBase):
    image_url: str

class Product(ProductBase):
    id: int
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    items: Any # JSON field
    total_amount: float
    email: Optional[EmailStr] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Session Schemas
class SessionBase(BaseModel):
    date: str
    time_slot: str
    type: str
    notes: Optional[str] = None
    email: Optional[EmailStr] = None
    guest_name: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    client_id: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionBase(BaseModel):
    category: str
    bio: str

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: int
    artist_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

# Admin Stats
class DashboardStats(BaseModel):
    total_users: int
    total_revenue: float
    total_bookings: int
    total_orders: int
    total_photos: int
    total_submissions: int
