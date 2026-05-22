# 🌀 SCHRÖDINGER'S BOX

<div align="center">

![Header Banner](https://img.shields.io/badge/CYBERSECURITY-DEFENSE--GRADE-0a0e17?style=for-the-badge&logo=probot&logoColor=00ffcc)
![Post Quantum](https://img.shields.io/badge/PQC-HYBRID--CRYPTOGRAPHY-6929c4?style=for-the-badge&logo=quantum&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-v19.0-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.2-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-v2.0%2B-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![Qiskit](https://img.shields.io/badge/Qiskit-v0.43-6929C4?style=flat-square&logo=qiskit&logoColor=white)](https://qiskit.org)
[![AES-256-GCM](https://img.shields.io/badge/Cipher-AES--256--GCM-00ffcc?style=flat-square)](https://csrc.nist.gov/publications/detail/sp/800-38d/final)

### *A Zero-Knowledge, E2E Encrypted Communication Platform Shielded by Multi-Family Post-Quantum Cryptography & ML Security Intelligence*

[Key Features](#-key-features) • [Cryptographic Architecture](#-cryptographic-architecture--mathematical-foundations) • [Machine Learning Intelligence](#-machine-learning-security-intelligence) • [Quantum Circuit Simulation](#-quantum-circuit-simulation) • [Project Layout](#-repository-layout) • [Getting Started](#-getting-started) • [API Reference](#-api-specification--endpoints)

</div>

---

## 🌌 Project Overview

**Schrödinger's Box** represents a paradigm shift in end-to-end encrypted messaging, built to anticipate and neutralize the threat of **Harvest Now, Decrypt Later (HNDL)** attacks. Standard symmetric and asymmetric encryption schemes (RSA, ECC, Diffie-Hellman) will fall rapidly once a cryptographically relevant quantum computer (CRQC) is engineered. 

This platform implements a **3-Way Hybrid Post-Quantum Cryptographic (PQC)** scheme directly in a zero-knowledge communication topology. The server functions solely as an oblivious packet relay; it possesses absolutely no visibility into symmetric keys, KEM ciphertexts, or decrypted message states. The system integrates real-time network anomaly detection via **deep learning models** alongside dynamic cryptosystem tuning powered by **predictive resource classifiers**.

---

## ⚡ Key Features

*   🛡️ **3-Way Hybrid Cryptosystem**: Integrates **Lattice-based**, **Code-based**, and **Hash-based** algorithms. Ephemeral shared keys are derived from all three cryptographic families and dynamically bound using a secure KDF.
*   🔒 **Zero-Knowledge Messaging**: End-to-end client-side encryption using **AES-256-GCM** over secure, low-latency WebSockets. Autogen IVs and unique tags block message spoofing and replay attacks.
*   🧠 **Deep Learning Threat Analysis**: A **PyTorch-based Feedforward Neural Network** monitors connection metadata on the server, categorizing traffic behaviors into `Normal`, `MITM/Replay Anomaly`, or `DDoS Attack`.
*   📊 **Telemetry-Driven Cryptography**: A **Random Forest Classifier** evaluates device capabilities, available bandwidth, and server-reported threat indices to recommend the optimal security/performance algorithm pair.
*   🌀 **BB84 QKD Simulation**: A physical quantum circuit simulator built with **Qiskit** executes quantum state vectors and basis measurements to visually teach and analyze the fundamentals of Quantum Key Distribution.
*   📈 **Real-Time Security Dashboard**: Immersive frontend interface with glassmorphic cards, live performance metrics, active websocket handshakes, and cryptographic speed comparisons.

---

## 🧬 Cryptographic Architecture & Mathematical Foundations

### 1. Hybrid Key Encapsulation Mechanism (KEM)
To safeguard against single-algorithm failure, Schrödinger's Box establishes joint secrets by performing multiple independent KEM operations. The primary suite utilizes three distinct mathematical structures:

1.  **Lattice Cryptography (Kyber-1024 / NTRU)**: Relies on the hardness of solving the *Learning With Errors (LWE)* problem over polynomial rings. High-speed performance with compact key structures.
2.  **Code-Based Cryptography (BIKE)**: Derived from the difficulty of decoding *Quasi-Cyclic Moderate Density Parity Check (QC-MDPC)* codes. Mathematical framework distinct from lattices.
3.  **Hash-Based Cryptography (SPHINCS+)**: A conservative stateless signature and fallback scheme dependent purely on the collision-resistance of robust hash functions.

```
       [ Client A ]                                                   [ Client B ]
            │                                                              │
            │ 1. Fetches Ephemeral PQC Public Keys                         │
            ├─────────────────────────────────────────────────────────────>│
            │                                                              │
            │ 2. Computes 3-Way Encapsulation                              │
            │    - Kyber.Encaps(PK_K)  ==> (C_K, SS_Kyber)                 │
            │    - BIKE.Encaps(PK_B)   ==> (C_B, SS_BIKE)                  │
            │    - SPHINCS.Encaps(PK_S) ==> (C_S, SS_SPHINCS)               │
            │                                                              │
            │ 3. Transmits Ciphertexts (C_K || C_B || C_S)                 │
            │<─────────────────────────────────────────────────────────────┤
            │                                                              │
    [ Decapsulates Secrets ]                                       [ Decapsulates Secrets ]
      - SS_Kyber, SS_BIKE,                                           - SS_Kyber, SS_BIKE,
        SS_SPHINCS                                                     SS_SPHINCS
            │                                                              │
            ▼                                                              ▼
   [ Concatenates Secrets ]                                       [ Concatenates Secrets ]
   IKM = SS_K || SS_B || SS_S                                     IKM = SS_K || SS_B || SS_S
            │                                                              │
            ▼                                                              ▼
   [ Concatenates Salts ]                                         [ Concatenates Salts ]
   Salt = Session_ID || Epoch                                     Salt = Session_ID || Epoch
            │                                                              │
            ▼                                                              ▼
    ┌───────────────┐                                              ┌───────────────┐
    │  HKDF-SHA512  │                                              │  HKDF-SHA512  │
    └───────┬───────┘                                              └───────┬───────┘
            │                                                              │
            ▼                                                              ▼
   [ AES-256 Joint Key ]                                          [ AES-256 Joint Key ]
```

### 2. Multi-Key Derivation (HKDF-SHA512)
Once decapsulated, the input keying material ($IKM$) is extracted by concatenating the separate shared secrets:

$$IKM = SS_{\text{Kyber}} \mathbin{\Vert} SS_{\text{BIKE}} \mathbin{\Vert} SS_{\text{SPHINCS+}}$$

The joint symmetric session key is then derived through an **HMAC-based Key Derivation Function (HKDF)** using SHA-512:

$$PRK = \text{HMAC-SHA512}(\text{Salt}, IKM)$$

$$OKM = \text{HMAC-SHA512}(PRK, \text{Info} \mathbin{\Vert} \text{0x01})$$

The final 256 bits of the Output Keying Material ($OKM$) serve as the AES symmetric key, assuring perfect forward secrecy: if any single PQC algorithm is compromised, the remaining two mathematical structures preserve the privacy of the derived session key.

### 3. Symmetric Client-Side Encryption
Payloads are encrypted locally on the host browser via **AES-256-GCM** using a cryptographically secure random 96-bit Initialization Vector ($IV$) generated per-message. This supplies **Authenticated Encryption with Associated Data (AEAD)**:

$$\text{Ciphertext}, \text{Tag} = \text{AES-GCM-Encrypt}(\text{Plaintext}, K_{\text{session}}, IV)$$

Any tampering of the encrypted payload in flight is automatically caught by the recipient during decryption via authentication tag verification.

---

## 🧠 Machine Learning Security Intelligence

Schrödinger's Box operates a dual-layer AI safety framework to monitor operational health and customize runtime configuration:

### 1. PyTorch Threat Classification Model
A fully connected 3-layer deep neural network continuously evaluates packet metrics:

```
  Input Vector (5 Dim) ──> [ Linear (5 -> 64) ] ──> [ ReLU ] ──> [ Linear (64 -> 32) ] ──> [ ReLU ] ──> [ Linear (32 -> 3) ] ──> [ Softmax ] ──> Class Output
```

*   **Feature Vector**: `[Payload Size, Packet Frequency, Average Latency, Fault Packet Rate, Rekey Request Frequency]`
*   **Target Output Classes**:
    1.  `0`: **Normal** (Standard user behaviour)
    2.  `1`: **MITM / Replay Attack** (Heightened latency, high rekey request rate)
    3.  `2`: **DDoS Threat** (Massive payload sizes, anomalous transaction rate)
*   **Loss / Optimizer**: Multi-Class Cross Entropy Loss trained with the Adam optimizer over synthetic, real-time-simulated baseline datasets.

### 2. Scikit-Learn Crypto-Resource Allocator
Calculates local compute telemetry to determine the safest possible cryptosystem configuration:
*   **Features Evaluated**: Client CPU cores, physical memory allocation, network latency, available bandwidth, and server-side Threat Index.
*   **Algorithm**: Random Forest Classifier matching telemetry to recommended operational modes:
    *   **Ultra-Performance**: High-speed Lattice-based primitives only (suited for low-battery mobile devices).
    *   **Balanced**: Double hybrid Lattice + Code-based primitives.
    *   **Defense-Grade**: High-entropy 3-way Hybrid Suite (Kyber + BIKE + SPHINCS+), enforced when the server threat index spikes.

---

## 🌀 Quantum Circuit Simulation

The quantum dashboard implements a physical simulation of the **BB84 Quantum Key Distribution** protocol. Built directly on top of the **Qiskit** framework, the backend initializes registers, compiles gates, and measures qubits:

```python
# BB84 Circuit generation logic in quantum/circuit_sim.py
from qiskit import QuantumCircuit, Aer, execute

def build_bb84_simulation(bits_count=8):
    # Generates quantum keys, choosing random bases
    qc = QuantumCircuit(bits_count, bits_count)
    for i in range(bits_count):
        # Alice prepares qubits
        if alice_bits[i] == 1:
            qc.x(i)  # Flip to |1>
        if alice_bases[i] == 'X':
            qc.h(i)  # Apply Hadamard to enter superposition
            
        # Bob measures qubits
        if bob_bases[i] == 'X':
            qc.h(i)  # Measure in diagonal basis
        qc.measure(i, i)
        
    job = execute(qc, Aer.get_backend('qasm_simulator'), shots=1)
    return job.result().get_counts()
```

The frontend maps the output vectors, plotting probabilities, measurement bases, and quantum statevectors dynamically. This visualizes the physical foundations of quantum mechanics—such as the **No-Cloning Theorem** and basis collapse—directly in a commercial chat context.

---

## 📊 Cryptographic Performance Benchmark

The platform allows real-time execution comparisons of various post-quantum configurations, illustrating key exchange timings and payload overheads:

| Cryptosystem Configuration | Average KeyGen (ms) | Encapsulation (ms) | Decapsulation (ms) | Client Public Key Size (Bytes) | Security Level (NIST) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kyber-1024 (Lattice)** | 0.42 ms | 0.58 ms | 0.65 ms | 1,568 Bytes | Level 5 (AES-256 equivalent) |
| **BIKE-L1 (Code-Based)** | 11.20 ms | 14.80 ms | 22.10 ms | 2,541 Bytes | Level 1 (AES-128 equivalent) |
| **SPHINCS+-128f (Hash)** | 145.40 ms | 210.10 ms | 18.20 ms | 32 Bytes | Level 1 (Stateless fallback) |
| **Kyber + BIKE (2-Way)** | 11.62 ms | 15.38 ms | 22.75 ms | 4,109 Bytes | Multi-Hardness Combined |
| **3-Way Hybrid Suite** | **157.02 ms** | **225.48 ms** | **40.95 ms** | **4,141 Bytes** | **Extreme Post-Quantum Shield** |

---

## 📁 Repository Layout

```
schrodingers-box/
├── backend/
│   ├── api/                 # FastAPI Router Endpoints
│   │   ├── routes_auth.py       # RBAC and session token validation
│   │   ├── routes_benchmark.py  # PQC speed and key-size calculators
│   │   ├── routes_chat.py       # Secure websocket broker
│   │   ├── routes_ml.py         # PyTorch classification & random forest endpoints
│   │   └── routes_quantum.py    # Qiskit BB84 circuit generator
│   ├── crypto/              # PQC wrapper engines, Hybrid KDF, and AES utilities
│   │   ├── aes_engine.py        # Client-side fallback / local AES utilities
│   │   ├── algorithm_registry.py# Mapping configurations
│   │   ├── hybrid_kdf.py        # HKDF-SHA512 joint-secret processor
│   │   └── pqc_core.py          # Core PQC models (MockKEM mapping structures)
│   ├── db/                  # Persistent SQLite DB schemas and audit structures
│   ├── ml/                  # Deep learning models & ML telemetry models
│   │   ├── models/              # Trained weights: threat_model.pt & algo_selector.pkl
│   │   └── train.py             # PyTorch synthetic trainer
│   ├── quantum/             # Qiskit circuit models
│   │   ├── circuit_sim.py       # Qiskit BB84 simulator
│   │   └── visualizer.py        # Density matrix output formatters
│   ├── main.py              # Application entry point
│   ├── Dockerfile           # Backend container config
│   └── requirements.txt     # Python dependency mapping
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable visual widgets
│   │   │   ├── QuantumCircuit.tsx   # Qiskit circuit representation canvas
│   │   │   ├── ThreatMeter.tsx      # Real-time PyTorch feed visualizer
│   │   │   └── BenchmarkChart.tsx   # Recharts cryptosystem benchmark display
│   │   ├── contexts/        # React authentication and session security state
│   │   ├── pages/           # High-impact user dashboard panels
│   │   │   ├── Dashboard.tsx        # Global cybersecurity dashboard
│   │   │   ├── Chat.tsx             # E2E zero-knowledge chat window
│   │   │   └── QuantumSim.tsx       # Interactive BB84 simulator interface
│   │   └── utils/           # Client-side WebCrypto AES-GCM protocols
│   ├── package.json         # Node.js workspace registry
│   ├── tailwind.config.js   # Premium aesthetic theme mapping
│   └── tsconfig.json        # Strict TypeScript rules
├── docker-compose.yml       # Production-ready compose orchestrator
└── start_windows.ps1        # Instant local setup command script
```

---

## ⚡ Getting Started

Ensure you have **Python 3.11+**, **Node.js 18+**, and **Docker** installed.

### 💻 Step-by-Step Local Deployment

#### 1. Configure the Backend Service
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up and activate a local Python virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install backend packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Execute the training script to generate the models:
   ```bash
   python -m ml.train
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *Verify backend status by loading the live interactive Swagger documentation: `http://localhost:8000/docs`*

#### 2. Configure the Frontend Interface
1. Open a new terminal session and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm assets:
   ```bash
   npm install
   ```
3. Boot up the Vite compilation server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173` or `http://localhost:5174`*

---

### 🐳 Full-Stack Container Orchestration (Docker Compose)
To run backend, database, and frontend containers synchronously with high network isolation:

1. Create a root environment configuration:
   ```bash
   cp .env.example .env
   ```
2. Build and launch the container cluster:
   ```bash
   docker-compose up --build
   ```
3. Load the secure UI directly at `http://localhost:5173`.

---

## 🔌 API Specification & Endpoints

| Method | Endpoint | Description | Payloads / Parameters |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Validates credentials, issues JWT bearer tokens | `username`, `password` |
| **POST** | `/api/ml/classify_threat` | Evaluates packet telemetry using PyTorch models | `payload_size`, `packet_freq`, `latency` |
| **POST** | `/api/ml/recommend_algo` | Selects optimal cryptosystem using Random Forest | `cpu_cores`, `memory_gb`, `packet_loss_pct` |
| **GET** | `/api/quantum/simulate` | Executes BB84 circuit on Aer backend, returns states | `bits_count` (int) |
| **GET** | `/api/benchmark/run` | Triggers a PQC performance comparison run | None |
| **WS** | `/ws/chat/{session_id}` | End-to-end client-encrypted real-time relay | `token` (Query Parameter) |

---

## 🔒 Security Notice & Native Liboqs Compilation
*   **Development Fallback**: In the absence of native OS-compiled cryptographic hardware libraries, Schrödinger's Box runs a highly optimized Python wrapper class called **MockKEM**. This simulates the identical public-key sizes, encryption latency ranges, encapsulation signatures, and mathematical interfaces of native Kyber, BIKE, and SPHINCS+.
*   **Native Hardware Compilation**: For production environments, the system connects directly with **`liboqs`** (the C library developed by Open Quantum Safe). To compile and link native hardware accelerators, follow the step-by-step compilation manual documented in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 🧑‍💻 Creator & Researcher
*   **Lead Cryptographic Developer**: **Prateek Pulkit**
*   **Research Domain**: Future-proofing real-time communication architectures through hybrid mathematical lattices, neural-network network defense, and simulated BB84 QKD channels.

*Schrödinger's Box is maintained as an individual research project. Feature requests, cryptographic reviews, and issue submissions are welcomed.*
