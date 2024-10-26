# Google-Back

## Installation

Download the model from the [Google Drive](https://drive.google.com/file/d/1tayJ8a2w-o2tSxGoFeX-7MF-M7lZfzu6/view?usp=sharing) and extract it to the root of the project.

```bash
pip install -r requirements.txt
python3 app.py
```

Add the json files at the backend folder located [here](https://drive.google.com/drive/folders/1eiTce_MOM5j1dOTHiOh5fLH9txmbKf2y?usp=sharing)

Endpoints:

- `/`: Home page (Health check)

- `/check_fraud`: Check if an email is fraudulent
  - Method: POST
    - Body: `{"text": "Happy Birthday! 🎂 We hope your special day is filled with love, joy, and wonderful moments with your loved ones. This year, as you celebrate, we want to remind you how much we appreciate having you as part of our community."}`
    - Response: `{
        "prediction": 0,
        "processing_time_seconds": 0.1,
        "text": "Happy Birthday! 🎂 We hope your special day is filled with love, joy, and wonderful moments with your loved ones. This year, as you celebrate, we want to remind you how much we appreciate having you as part of our community."
    }`
    - Prediction: 0 (Not fraudulent) or 1 (Fraudulent)
