from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # user, admin, artist
    is_creator = Column(Boolean, default=False)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    orders = relationship("Order", back_populates="user")
    sessions = relationship("Session", back_populates="client")
    submissions = relationship("Submission", back_populates="artist")

class Photo(Base):
    __tablename__ = "photos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    url = Column(String)
    category = Column(String) # Portrait, Landscape, Fine Art, etc.
    price = Column(Float, nullable=True) # For digital sales
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    stock = Column(Integer, default=0)
    image_url = Column(String)
    category = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, paid, shipped
    total_amount = Column(Float)
    stripe_intent_id = Column(String, nullable=True)
    items = Column(JSON) # List of product_id and quantity
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String, nullable=True)
    guest_name = Column(String, nullable=True)
    date = Column(String) # e.g. "2026-05-15"
    time_slot = Column(String) # e.g. "10:00 AM"
    type = Column(String) # Portrait, Commercial, Wedding
    status = Column(String, default="pending") # pending, confirmed, completed, cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client = relationship("User", back_populates="sessions")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    artist_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    category = Column(String)
    bio = Column(Text)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    artist = relationship("User", back_populates="submissions")
