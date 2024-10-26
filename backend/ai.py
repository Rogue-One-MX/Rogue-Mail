# ai.py
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import time

# Load the model and tokenizer from the decompressed folder
model = AutoModelForSequenceClassification.from_pretrained("modelo_emails", use_safetensors=True)
tokenizer = AutoTokenizer.from_pretrained("modelo_emails")

def get_fraud(texto):
    start_time = time.time()

    # Tokenize and check the input text
    inputs = tokenizer(texto, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=-1).item()

    elapsed_time = time.time() - start_time

    return prediction, elapsed_time
