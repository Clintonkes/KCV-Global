import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import User, Base
from utils.auth import get_password_hash
from dotenv import load_dotenv

# Add current directory to path so we can import from 'database' and 'utils'
sys.path.append(os.getcwd())

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

# Handle postgresql:// vs postgres:// for SQLAlchemy 1.4+
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_admin():
    db = SessionLocal()
    try:
        # Create tables just in case
        Base.metadata.create_all(bind=engine)
        
        # Check if admin already exists
        admin_email = "admin@kcvglobal.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if existing_admin:
            print(f"Admin user already exists: {admin_email}")
            return
            
        # Create new admin
        admin_user = User(
            email=admin_email,
            username="admin_kcv",
            hashed_password=get_password_hash("KCV_Admin_2026!"),
            role="admin",
            is_creator=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("--------------------------------------------------")
        print("Admin user created successfully!")
        print(f"Email: {admin_email}")
        print("Password: KCV_Admin_2026!")
        print("Role: admin")
        print("--------------------------------------------------")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
