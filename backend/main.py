from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base, SessionLocal
from api.routes_chat import router as chat_router
from api.routes_benchmark import router as benchmark_router
from api.routes_quantum import router as quantum_router
from api.routes_ml import router as ml_router
from api.routes_auth import router as auth_router
from db.models import User, MilitaryRole
from api.auth import get_password_hash

# Create DB schema
Base.metadata.create_all(bind=engine)

# Seed initial internal military accounts
db = SessionLocal()
try:
    if not db.query(User).first():
        print("Seeding internal accounts...")
        db.add(User(username="commander", hashed_password=get_password_hash("defend123"), role=MilitaryRole.COMMANDER.value))
        db.add(User(username="operative", hashed_password=get_password_hash("field123"), role=MilitaryRole.FIELD_OPERATIVE.value))
        db.add(User(username="analyst", hashed_password=get_password_hash("intel123"), role=MilitaryRole.ANALYST.value))
        db.commit()
finally:
    db.close()

app = FastAPI(
    title="Schrödinger's Box COMMAND",
    description="Defence-grade Hybrid Post-Quantum Cryptography Backend with Role-Based Access Control",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon. Restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/ws/chat", tags=["Websocket Chat"])
app.include_router(benchmark_router, prefix="/api/benchmark", tags=["Benchmarks"])
app.include_router(quantum_router, prefix="/api/quantum", tags=["Quantum Simulation"])
app.include_router(ml_router, prefix="/api/ml", tags=["Machine Learning"])

@app.get("/health")
def health_check():
    return {"status": "operational", "crypto": "PQC Hybrid Active"}
