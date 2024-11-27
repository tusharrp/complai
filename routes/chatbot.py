from flask import Blueprint, jsonify, request, render_template
import requests
from models.google_api import generate_text, call_google_api

chatbot_bp = Blueprint('chatbot', __name__)

api_key = os.getenv('GOOGLE_API_KEY')

@chatbot_bp.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@chatbot_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        user_message = data['message']

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{
                    "text": user_message
                }]
            }]
        }
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 200:
            bot_response = response.json().get('candidates')[0]['content']['parts'][0]['text']
        else:
            bot_response = "I'm sorry, I couldn't process your request."

        return jsonify({'answer': bot_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500