'''from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate(r"\Google-Back\project-29b2a-firebase-adminsdk-rbady-3bd110e3ec.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Initialize Gmail API
gmail_creds = service_account.Credentials.from_service_account_file(
    r"\Google-Back\project-29b2a-firebase-adminsdk-rbady-3bd110e3ec.json",
    scopes=["https://www.googleapis.com/auth/gmail.readonly"]
)
gmail_service = build('gmail', 'v1', credentials=gmail_creds)

@app.route('/')
def home():
    return "Hello, Flask with Firebase and Gmail API!"

@app.route('/add', methods=['POST'])
def add_document():
    # Example of adding a document to Firestore
    doc_ref = db.collection('usuarios').document('example_user')
    doc_ref.set({
        'nombre': 'John Doe',
        'email': 'john.doe@example.com',
        'edad': 30
    })
    return jsonify({"message": "Usuario agregado exitosamente"}), 200

@app.route('/fetch_emails', methods=['GET'])
def fetch_emails():
    # Retrieve all emails from Gmail
    results = gmail_service.users().messages().list(userId='me').execute()
    messages = results.get('messages', [])

    emails = []

    # Loop through each message and fetch details
    for message in messages:
        msg = gmail_service.users().messages().get(userId='me', id=message['id']).execute()
        email_data = {
            'id': message['id'],
            'snippet': msg['snippet'],
            'payload': msg.get('payload', {})
        }
        emails.append(email_data)

        # Add each email to Firestore
        db.collection('emails').document(message['id']).set(email_data)

    return jsonify({"message": f"{len(emails)} emails fetched and stored successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
'''