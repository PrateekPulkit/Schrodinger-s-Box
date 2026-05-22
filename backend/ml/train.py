import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from .threat_model import ThreatClassifier

def train_threat_model():
    """Trains PyTorch Neural Network for Threat Classification using synthetic data."""
    print("Training Threat Model...")
    # Generate Synthetic Data
    # Features: duration, sensitivity, network, geo_risk, payload
    # Labels: 0 (LOW), 1 (MEDIUM), 2 (HIGH), 3 (CRITICAL)
    X = np.random.rand(2000, 5) * [120, 5, 4, 3, 3] # Scale appropriately
    
    # Synthetic heuristic for labeling
    score = X[:, 1]*10 + X[:, 2]*5 + X[:, 3]*10 + X[:, 4]*2
    y = np.zeros(2000, dtype=np.int64)
    y[score > 40] = 1
    y[score > 60] = 2
    y[score > 80] = 3

    X_train = torch.tensor(X, dtype=torch.float32)
    y_train = torch.tensor(y, dtype=torch.long)

    model = ThreatClassifier()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    for epoch in range(200):
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)
        loss.backward()
        optimizer.step()
        
    os.makedirs(os.path.dirname(os.path.abspath(__file__)) + "/models", exist_ok=True)
    model_path = os.path.dirname(os.path.abspath(__file__)) + "/models/threat_model.pt"
    torch.save(model.state_dict(), model_path)
    print(f"Saved Threat Model to {model_path}")

def train_algo_selector():
    """Trains scikit-learn Random Forest for Algorithm Selection using synthetic data."""
    print("Training Algorithm Selector...")
    # Features: threat_level (0-3), latency_budget, key_size_budget, security_level
    X = np.random.rand(2000, 4) * [4, 500, 5000, 6]
    X[:, 0] = np.floor(X[:, 0]) # discrete threat
    X[:, 3] = np.floor(X[:, 3]) # discrete sec level

    # Synthetic labels (0 to 4 mapping to COMBO-A through COMBO-E)
    # Give it realistic heuristics: High security needed -> 0 or 2
    # Low latency -> 3 or 4
    y = np.zeros(2000, dtype=np.int64)
    for i in range(2000):
        t, l, k, s = X[i]
        if s >= 4 or t >= 2:
            y[i] = 0 if l > 100 else 2  # COMBO-A or C
        elif l < 80:
            y[i] = 3 if s > 2 else 4    # COMBO-D or E
        else:
            y[i] = 1                    # COMBO-B
            
    clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    clf.fit(X, y)

    model_path = os.path.dirname(os.path.abspath(__file__)) + "/models/algo_selector.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(clf, f)
    print(f"Saved Algo Selector to {model_path}")

if __name__ == "__main__":
    train_threat_model()
    train_algo_selector()
    print("ML training complete.")
