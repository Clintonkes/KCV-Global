from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from database.session import engine, Base, SessionLocal
from .routers import auth, photos, products, orders, sessions, submissions, admin

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
import traceback
from sqlalchemy import text

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("kcv-global")

# Create tables defined in models
Base.metadata.create_all(bind=engine)

def run_migrations():
    """Add new columns to existing tables safely (idempotent)."""
    migrations = [
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS email VARCHAR;",
        "ALTER TABLE sessions ADD COLUMN IF NOT EXISTS email VARCHAR;",
        "ALTER TABLE sessions ADD COLUMN IF NOT EXISTS guest_name VARCHAR;",
        "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS name VARCHAR;",
        "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS email VARCHAR;",
        "ALTER TABLE submissions ALTER COLUMN artist_id DROP NOT NULL;",
        "ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;",
        "ALTER TABLE sessions ALTER COLUMN client_id DROP NOT NULL;",
    ]
    try:
        with engine.connect() as conn:
            for sql in migrations:
                try:
                    conn.execute(text(sql))
                except Exception as e:
                    # Column likely already exists — safe to ignore
                    logger.debug(f"Migration skipped (already applied): {e}")
            conn.commit()
        logger.info("Database migrations applied.")
    except Exception as e:
        logger.error(f"Migration error: {e}")

def seed_admin():
    """Create the initial admin user if they don't exist."""
    from database import models
    from utils.auth import get_password_hash
    
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@kcvglobal.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "KCV_Admin_2026!")
        
        existing = db.query(models.User).filter(models.User.email == admin_email).first()
        if not existing:
            admin_user = models.User(
                email=admin_email,
                username="admin_kcv",
                hashed_password=get_password_hash(admin_password),
                role="admin",
                is_creator=True,
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"Admin user created: {admin_email}")
        else:
            logger.info(f"Admin user already exists: {admin_email}")
    except Exception as e:
        logger.error(f"Admin seed error: {e}")
        db.rollback()
    finally:
        db.close()

# Run on startup
run_migrations()
seed_admin()

app = FastAPI(title="KCV Global", version="1.0.0")

# Error Logging Middleware
@app.middleware("http")
async def error_logging_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled Exception: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "error": str(e)}
        )

# CORS Configuration
origins = json.loads(os.getenv("ALLOWED_ORIGINS", '["http://localhost:5173"]'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ... (origins and middleware)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(photos.router, prefix="/api/v1/photos", tags=["Photos"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])
app.include_router(submissions.router, prefix="/api/v1/submissions", tags=["Submissions"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# Serve Static Files
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = os.path.join(ROOT_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve the API if requested (though routers handle this)
        if full_path.startswith("api"):
            return None
        
        # Check if file exists in dist
        file_path = os.path.join("dist", full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Default to index.html for SPA routing
        return FileResponse("dist/index.html")

@app.get("/health")
async def root():
    return {"message": "KCV Global is running", "version": "1.0.0"}
