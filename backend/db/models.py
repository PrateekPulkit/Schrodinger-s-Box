from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from datetime import datetime
import enum
from .database import Base

class MilitaryRole(str, enum.Enum):
    COMMANDER = "COMMANDER"
    FIELD_OPERATIVE = "FIELD_OPERATIVE"
    ANALYST = "ANALYST"

class User(Base):
    """Stores military personnel profiles."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=MilitaryRole.FIELD_OPERATIVE.value)


class AuditLog(Base):
    """Stores a record of all key exchanges."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String, index=True)
    combo_used = Column(String)
    threat_level_assessed = Column(String)
    ip_address = Column(String)

class BenchmarkResult(Base):
    """Stores historical benchmark runs for the machine learning Recommender to train on."""
    __tablename__ = "benchmark_history"

    id = Column(Integer, primary_key=True, index=True)
    run_timestamp = Column(DateTime, default=datetime.utcnow)
    combo_id = Column(String, index=True)
    key_gen_ms = Column(Float)
    encap_ms = Column(Float)
    decap_ms = Column(Float)
    kdf_ms = Column(Float)
    total_time_ms = Column(Float)
    public_key_size = Column(Integer)
    ciphertext_size = Column(Integer)
    security_level = Column(Integer)
