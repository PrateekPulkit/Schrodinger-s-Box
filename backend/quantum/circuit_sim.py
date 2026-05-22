from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import time

class QuantumPQCAnalog:
    """
    Simulates a quantum circuit to act as a visual and metaphorical analog
    for the hybrid PQC key exchange.
    
    1. Superposition: Key is all possibilities.
    2. Entanglement: Client and Server linked states.
    3. Collapse: Measurement defines the final session key.
    """
    def __init__(self):
        self.simulator = AerSimulator()
        self.circuit = None
        self.collapse_time = None
        self.probabilities = {}

    def build_and_run(self) -> dict:
        """Builds the circuit, simulates, and records the result."""
        # 3 Qubits corresponding to 3 PQC Algorithms combining
        # 3 Classical bits for measurement
        qc = QuantumCircuit(3, 3)

        # Step 1: Superposition
        # Apply Hadamard to all representing the uncertainty of the derived key
        qc.h(0)
        qc.h(1)
        qc.h(2)
        qc.barrier(label="Superposition")

        # Step 2: Entanglement (Bell states analog)
        # Linking qubits to represent HKDF combination and Client-Server link
        qc.cx(0, 1)
        qc.cx(1, 2)
        qc.barrier(label="Entanglement")

        # Step 3: Measurement Collapse
        self.collapse_time = time.time()
        qc.measure([0, 1, 2], [0, 1, 2])
        
        self.circuit = qc

        # Run simulation
        compiled_circuit = transpile(qc, self.simulator)
        result = self.simulator.run(compiled_circuit, shots=1000).result()
        counts = result.get_counts(compiled_circuit)

        # Convert counts to probabilities
        total = sum(counts.values())
        self.probabilities = {state: count/total for state, count in counts.items()}

        return {
            "collapse_timestamp": self.collapse_time,
            "probabilities": self.probabilities
        }
