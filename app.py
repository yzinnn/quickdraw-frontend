from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import transforms
from PIL import Image
import torch
from torch import nn
from io import BytesIO
import os
import json

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 🎯 CNN 모델 정의
class DeepCNN(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),
            nn.Conv2d(32, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),
            nn.MaxPool2d(2), nn.Dropout2d(0.25),

            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.MaxPool2d(2), nn.Dropout2d(0.25),

            nn.Conv2d(64, 128, 3, padding=1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.Conv2d(128, 128, 3, padding=1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.MaxPool2d(2), nn.Dropout2d(0.25),
        )

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 16 * 16, 512), nn.ReLU(), nn.Dropout(0.5),
            nn.Linear(512, 256), nn.ReLU(), nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x


# 🔥 sceneId -> (model, class_list) 매핑
scene_model_map = {}

# 🔄 모델과 json 로딩
for i in range(1, 4):
    scene_id = f"scene{i}"
    model_path = f"quickdraw_{scene_id}.pth"
    label_path = f"{scene_id}_class_labels.json"

    if not os.path.exists(model_path):
        print(f"❌ {scene_id} 모델 없음: {model_path}")
        continue
    if not os.path.exists(label_path):
        print(f"⚠️ {scene_id} 라벨 파일 없음: {label_path}")
        continue

    with open(label_path) as f:
        label_data = json.load(f)
        class_list = label_data["classes"]

    model = DeepCNN(num_classes=len(class_list)).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    scene_model_map[scene_id] = (model, class_list)
    print(f"✅ {scene_id} 로드 완료! 클래스: {class_list}")

# 💡 이미지 전처리
transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: 1 - x),  # 흰 배경 기준 반전
])

# 🧠 예측 라우트
@app.route('/predict/<scene_id>', methods=['POST'])
def predict(scene_id):
    if scene_id not in scene_model_map:
        return jsonify({'error': 'Invalid scene ID'}), 400
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    model, class_list = scene_model_map[scene_id]

    img_bytes = request.files['image'].read()
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    x = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(x)
        pred = output.argmax().item()
        return jsonify({'label': class_list[pred]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
