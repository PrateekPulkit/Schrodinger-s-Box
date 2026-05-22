from fastapi import APIRouter
from pydantic import BaseModel
from ml import predict_threat_level, AlgorithmRecommender

router = APIRouter()
recommender = AlgorithmRecommender()

class ThreatRequest(BaseModel):
    session_duration_mins: float
    data_sensitivity: int
    network_type: int
    geo_risk: int
    payload_size_class: int

class SelectorRequest(BaseModel):
    threat_level_str: str
    latency_budget_ms: float
    key_size_budget_bytes: float
    security_level_req: int

@router.post("/threat_classify")
def classify_threat(req: ThreatRequest):
    features = [
        req.session_duration_mins,
        req.data_sensitivity,
        req.network_type,
        req.geo_risk,
        req.payload_size_class
    ]
    threat = predict_threat_level(features)
    return {"threat_level": threat}

@router.post("/recommend_combo")
def recommend_combo(req: SelectorRequest):
    res = recommender.recommend(
        threat_level=req.threat_level_str,
        latency_budget=req.latency_budget_ms,
        key_size=req.key_size_budget_bytes,
        sec_level=req.security_level_req
    )
    return res
