from fastapi import APIRouter
from quantum import QuantumPQCAnalog, export_circuit_to_json

router = APIRouter()

@router.get("/simulate")
def run_quantum_simulation():
    """
    Runs the quantum circuit simulation metaphor for PQC key exchange.
    Returns circuit topology JSON for Framer Motion rendering and probabilities.
    """
    sim = QuantumPQCAnalog()
    res = sim.build_and_run()
    
    frontend_circuit = export_circuit_to_json(sim.circuit)
    
    return {
        "status": "success",
        "circuit_topology": frontend_circuit,
        "collapse_timestamp": res["collapse_timestamp"],
        "state_probabilities": res["probabilities"]
    }
