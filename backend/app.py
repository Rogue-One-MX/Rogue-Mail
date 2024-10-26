from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from flask_cors import CORS
from ai import get_fraud

app = Flask(__name__)
CORS(app)

# Inicializar Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("project-29b2a-firebase-adminsdk-rbady-3bd110e3ec.json")
    firebase_admin.initialize_app(cred)

# Inicializar Firestore
db = firestore.client()

# Inicia el flujo de OAuth para que el usuario autorice la aplicación
'''gmail_flow = InstalledAppFlow.from_client_secrets_file(
    r"client_secret_597077420077-hrf0q75r512rl666uohf9p1m73109tsc.apps.googleusercontent.com.json",
    scopes=["https://mail.google.com/"],
)
# Corre el servidor local para obtener el token de acceso
creds = gmail_flow.run_local_server(port=5001)

# Crear el servicio de la API de Gmail usando las credenciales obtenidas
gmail_service = build("gmail", "v1", credentials=creds)

'''
@app.route("/")
def home():
    return "Hello, Flask with Firebase!"


@app.route("/add", methods=["POST"])
def add_document():
    # Ejemplo de agregar un documento a Firestore
    doc_ref = db.collection("usuarios").document("example_user")
    doc_ref.set({"nombre": "John Doe", "email": "john.doe@example.com", "edad": 30})
    return jsonify({"message": "Usuario agregado exitosamente"}), 200


@app.route("/check_fraud", methods=["POST"])
def check_fraud():
    # Get the text from the request
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Use the get_fraud function from ai.py to determine if the text is fraudulent and get the processing time
    result, processing_time = get_fraud(text)

    # Return the result as a JSON response
    return jsonify(
        {
            "text": text,
            "prediction": result,
            "processing_time_seconds": round(
                processing_time, 2
            ),  # Rounded for better readability
        }
    )

@app.route('/api/emails', methods=['GET'])
def get_emails():
    try:
        emails_ref = db.collection('emails') # Cambia 'emails' por el nombre de tu colección
        docs = emails_ref.stream()
        emails = [doc.to_dict() for doc in docs]
        return jsonify(emails), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
