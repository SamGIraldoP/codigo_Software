import hmac
import os
import re
from dotenv import load_dotenv
from flask import Flask, request, jsonify
load_dotenv
app = Flask(__name__)
API_TOKEN = os.getenv("TOKEN")
@app.before_request
def verificar_token():
    request_token = (request.get_json(silent=True) or {}).get("token")

    if(
        not isinstance(request_token, str) 
        or not API_TOKEN
        or not hmac.compare_digest(request_token, API_TOKEN)
    ):
        return jsonify({"error": "Token inválido"}), 401
@app.route("/example", methods=["POST"])
def example():
    return jsonify({
        "mensaje": "Token Valido, ruta /example accedida"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)