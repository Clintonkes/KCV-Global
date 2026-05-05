from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from database.session import engine, Base
from .routers import auth, photos, products, orders, sessions, submissions, admin

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KCV Global API", version="1.0.0")

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
