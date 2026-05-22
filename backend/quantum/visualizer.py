import json
from qiskit import QuantumCircuit

def export_circuit_to_json(qc: QuantumCircuit) -> dict:
    """
    Converts a Qiskit QuantumCircuit into a custom JSON dictionary 
    tailored for a React frontend renderer.
    """
    if not isinstance(qc, QuantumCircuit):
        raise ValueError("Provided object is not a Qiskit QuantumCircuit")

    num_qubits = qc.num_qubits
    num_clbits = qc.num_clbits
    
    frontend_gates = []
    
    for instruction in qc.data:
        op = instruction.operation
        qubits_involved = [qc.find_bit(q).index for q in instruction.qubits]
        clbits_involved = [qc.find_bit(c).index for c in instruction.clbits]

        gate_type = op.name
        
        # We only map basic visualization structures for the demo
        if gate_type == "barrier":
            frontend_gates.append({
                "type": "barrier",
                "label": op.label if op.label else "barrier",
                "qubits": qubits_involved
            })
        elif gate_type == "measure":
            frontend_gates.append({
                "type": "measure",
                "qubit": qubits_involved[0],
                "clbit": clbits_involved[0]
            })
        else:
            # e.g., 'h', 'cx'
            frontend_gates.append({
                "type": "gate",
                "name": gate_type.upper(),
                "qubits": qubits_involved
            })

    return {
        "num_qubits": num_qubits,
        "num_clbits": num_clbits,
        "operations": frontend_gates
    }
