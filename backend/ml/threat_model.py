import torch
import torch.nn as nn
import os

# Threat Levels Mapping
THREAT_LEVELS = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH",
    3: "CRITICAL"
}

class ThreatClassifier(nn.Module):
    """
    3-layer feedforward neural network.
    Input features (5):
    - session duration estimate (mins)
    - data sensitivity level (1-5)
    - network type (0=Internal, 1=VPN, 2=Public, 3=Tor)
    - geographic risk zone (0=Low, 1=Medium, 2=High)
    - payload size class (0=Small, 1=Medium, 2=Large)
    """
    def __init__(self):
        super(ThreatClassifier, self).__init__()
        self.fc1 = nn.Linear(5, 16)
        self.relu1 = nn.ReLU()
        self.fc2 = nn.Linear(16, 16)
        self.relu2 = nn.ReLU()
        self.fc3 = nn.Linear(16, 4)  # 4 classes: LOW, MED, HIGH, CRITICAL

    def forward(self, x):
        x = self.relu1(self.fc1(x))
        x = self.relu2(self.fc2(x))
        # Softmax is handled locally during loss/inference
        return x

def predict_threat_level(features, model_path: str = "models/threat_model.pt") -> str:
    """Predicts string threat level from feature list."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_file = os.path.join(base_dir, model_path)
    
    model = ThreatClassifier()
    if os.path.exists(model_file):
        model.load_state_dict(torch.load(model_file, map_location=torch.device('cpu')))
    model.eval()

    inputs = torch.tensor([features], dtype=torch.float32)
    with torch.no_grad():
        outputs = model(inputs)
        probs = torch.softmax(outputs, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
    
    return THREAT_LEVELS[predicted_class]
