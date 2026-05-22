from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import time
import statistics
from typing import Dict, Any
from db.database import get_db
from db.models import BenchmarkResult
from crypto import PQC_COMBOS, PQCHandshake, derive_hybrid_session_key

router = APIRouter()

@router.post("/run")
def run_benchmarks(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Runs benchmarks for all 5 combos, 10 iterations each.
    Measurements:
    - Key gen/encap/decap/kdf ms
    - Sizes
    Returns mean and std deviations.
    """
    iterations = 10
    results = {}

    for combo_id, combo in PQC_COMBOS.items():
        combo_metrics = {
            "key_gen_ms": [],
            "encap_ms": [],
            "decap_ms": [],
            "kdf_ms": [],
            "total_time_ms": []
        }
        
        # We need mock or actual lengths; run one pass to get sizes
        pk_size = 0
        ct_size = 0
        
        for _ in range(iterations):
            start_total = time.time()
            
            # Key Gen
            start = time.time()
            pks, kems_state = PQCHandshake.client_generate_keypairs(combo_id)
            end_gen = time.time()
            combo_metrics["key_gen_ms"].append((end_gen - start) * 1000)
            
            if pk_size == 0:
                pk_size = sum(len(pk) for pk in pks.values())

            # Encap
            start = time.time()
            cts, ss_server = PQCHandshake.server_encapsulate(combo_id, pks)
            end_encap = time.time()
            combo_metrics["encap_ms"].append((end_encap - start) * 1000)
            
            if ct_size == 0:
                ct_size = sum(len(ct) for ct in cts.values())

            # Decap
            start = time.time()
            ss_client = PQCHandshake.client_decapsulate(combo_id, kems_state, cts)
            end_decap = time.time()
            combo_metrics["decap_ms"].append((end_decap - start) * 1000)
            
            # KDF
            start = time.time()
            final_key = derive_hybrid_session_key(ss_server)
            end_kdf = time.time()
            combo_metrics["kdf_ms"].append((end_kdf - start) * 1000)

            combo_metrics["total_time_ms"].append((time.time() - start_total) * 1000)
            
            # Save to history DB (1 per iteration)
            db_res = BenchmarkResult(
                combo_id=combo_id,
                key_gen_ms=combo_metrics["key_gen_ms"][-1],
                encap_ms=combo_metrics["encap_ms"][-1],
                decap_ms=combo_metrics["decap_ms"][-1],
                kdf_ms=combo_metrics["kdf_ms"][-1],
                total_time_ms=combo_metrics["total_time_ms"][-1],
                public_key_size=pk_size,
                ciphertext_size=ct_size,
                security_level=combo.security_level
            )
            db.add(db_res)

        db.commit()

        # Compute aggregates
        results[combo_id] = {
            "key_gen_ms_mean": sum(combo_metrics["key_gen_ms"]) / iterations,
            "key_gen_ms_std": statistics.stdev(combo_metrics["key_gen_ms"]) if iterations > 1 else 0,
            "encap_ms_mean": sum(combo_metrics["encap_ms"]) / iterations,
            "encap_ms_std": statistics.stdev(combo_metrics["encap_ms"]) if iterations > 1 else 0,
            "decap_ms_mean": sum(combo_metrics["decap_ms"]) / iterations,
            "decap_ms_std": statistics.stdev(combo_metrics["decap_ms"]) if iterations > 1 else 0,
            "kdf_ms_mean": sum(combo_metrics["kdf_ms"]) / iterations,
            "kdf_ms_std": statistics.stdev(combo_metrics["kdf_ms"]) if iterations > 1 else 0,
            "total_time_ms_mean": sum(combo_metrics["total_time_ms"]) / iterations,
            "total_time_ms_std": statistics.stdev(combo_metrics["total_time_ms"]) if iterations > 1 else 0,
            "public_key_size": pk_size,
            "ciphertext_size": ct_size,
            "security_level": combo.security_level
        }

    return {"status": "success", "results": results}

@router.get("/history")
def get_benchmark_history(db: Session = Depends(get_db)):
    # Group and return stats for Dashboard
    records = db.query(BenchmarkResult).order_by(BenchmarkResult.id.desc()).limit(100).all()
    return {"history": records}
