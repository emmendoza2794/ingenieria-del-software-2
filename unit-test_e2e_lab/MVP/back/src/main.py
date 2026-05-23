from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.core.config import settings
from src.core.database import engine, Base, check_database_connection
from src.routes.auth import router as auth_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Check database connection
if not check_database_connection():
    logger.warning("⚠️  Database connection failed! The API will start but database operations will fail.")
    logger.warning("⚠️  Please check your DATABASE_URL configuration in .env file")
else:
    # Create database tables only if connection is successful
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")

# Create FastAPI app instance
app = FastAPI(
    title="MVP Base API",
    version="1.0.0",
    description="API base para proyectos MVP",
    debug=settings.DEBUG
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to MVP Base API",
        "version": "1.0.0",
        "description": "API base para proyectos MVP",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint with database status"""
    db_status = "connected" if check_database_connection() else "disconnected"
    overall_status = "healthy" if db_status == "connected" else "degraded"

    return {
        "status": overall_status,
        "service": "MVP Base API",
        "version": "1.0.0",
        "database": db_status
    }
