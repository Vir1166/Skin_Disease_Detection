import torch
import torch.nn as nn
import timm

import config


class SkinDiseaseModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = timm.create_model(
            config.MODEL_NAME,
            pretrained=config.PRETRAINED,
            num_classes=0,
            global_pool="avg",
        )
        in_features = self.backbone.num_features

        self.head = nn.Sequential(
            nn.BatchNorm1d(in_features),
            nn.Dropout(p=config.DROPOUT_RATE),
            nn.Linear(in_features, 512),
            nn.SiLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(p=config.DROPOUT_RATE / 2),
            nn.Linear(512, config.NUM_CLASSES),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.head(self.backbone(x))


def load_model(checkpoint_path: str, device: torch.device) -> SkinDiseaseModel:
    model = SkinDiseaseModel()
    ckpt  = torch.load(checkpoint_path, map_location=device, weights_only=True)
    model.load_state_dict(ckpt["model_state"])
    model.to(device)
    model.eval()
    return model
