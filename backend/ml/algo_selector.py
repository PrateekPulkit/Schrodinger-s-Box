import os
import pickle
import numpy as np

# Map for decoding string combo ID to index
COMBO_MAP_INVERSE = {
    0: "COMBO-A",
    1: "COMBO-B",
    2: "COMBO-C",
    3: "COMBO-D",
    4: "COMBO-E"
}

# String threat to int
THREAT_MAP = {
    "LOW": 0,
    "MEDIUM": 1,
    "HIGH": 2,
    "CRITICAL": 3
}

class AlgorithmRecommender:
    """
    Scikit-learn Random Forest model wrapper.
    Input features (4):
    - threat level int
    - latency budget (ms)
    - key size budget (bytes)
    - security level required (1,3,5)
    """
    def __init__(self, model_path: str = "models/algo_selector.pkl"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_file = os.path.join(base_dir, model_path)
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_file):
            with open(self.model_file, "rb") as f:
                self.model = pickle.load(f)

    def recommend(self, threat_level: str, latency_budget: float, key_size: float, sec_level: int):
        if self.model is None:
            # Fallback heuristic if not trained
            return {
                "recommended_combo": "COMBO-A" if sec_level >= 3 else "COMBO-E",
                "confidences": { "COMBO-A": 0.8, "COMBO-E": 0.2 }
            }

        t_val = THREAT_MAP.get(threat_level, 1)
        features = np.array([[t_val, latency_budget, key_size, sec_level]])
        
        probas = self.model.predict_proba(features)[0]
        pred_class = self.model.predict(features)[0]
        
        confidences = {}
        for i, prob in enumerate(probas):
            if i in COMBO_MAP_INVERSE:
                confidences[COMBO_MAP_INVERSE[i]] = float(prob)

        return {
            "recommended_combo": COMBO_MAP_INVERSE[pred_class],
            "confidences": confidences
        }
