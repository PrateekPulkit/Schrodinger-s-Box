from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class PQCCombo:
    id: str
    lattice: str
    code_based: str
    hash_based: str
    profile: str
    security_level: int
    latency_budget_ms: float

# Define the combinations exactly as requested
PQC_COMBOS: Dict[str, PQCCombo] = {
    "COMBO-A": PQCCombo(
        id="COMBO-A",
        lattice="Kyber1024",
        code_based="BIKE-L3",
        hash_based="SPHINCS+-SHA256-256f-simple",
        profile="Max security",
        security_level=5,
        latency_budget_ms=150.0
    ),
    "COMBO-B": PQCCombo(
        id="COMBO-B",
        lattice="Kyber768",
        code_based="BIKE-L1",
        hash_based="SPHINCS+-SHAKE-128f-simple",
        profile="Balanced",
        security_level=3,
        latency_budget_ms=100.0
    ),
    "COMBO-C": PQCCombo(
        id="COMBO-C",
        lattice="NTRU-HPS-4096-821",
        code_based="BIKE-L3",
        hash_based="SPHINCS+-SHA256-192f-simple",
        profile="High security, NTRU",
        security_level=5,
        latency_budget_ms=160.0
    ),
    "COMBO-D": PQCCombo(
        id="COMBO-D",
        lattice="Kyber512",
        code_based="BIKE-L1",
        hash_based="SPHINCS+-SHAKE-128s-simple",
        profile="Low latency",
        security_level=1,
        latency_budget_ms=50.0
    ),
    "COMBO-E": PQCCombo(
        id="COMBO-E",
        lattice="NTRU-HPS-2048-509",
        code_based="BIKE-L1",
        hash_based="SPHINCS+-SHA256-128f-simple",
        profile="Lightweight",
        security_level=1,
        latency_budget_ms=60.0
    ),
}

def get_combo(combo_id: str) -> Optional[PQCCombo]:
    return PQC_COMBOS.get(combo_id)
