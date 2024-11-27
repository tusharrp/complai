from flask import Blueprint, jsonify, render_template, request
import requests
import os

train_bp = Blueprint('train', __name__)

# Set your Google API key
API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'  # Updated API key
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

sop_prompt = (
    "Why it matters: Briefly explain the importance of following this SOP.\n"
    "Key steps: List 2-3 crucial steps for completing the task.\n"
    "Resources: Mention any tools or templates employees can use.\n"
    "Questions? Encourage clarification.\n"
    "Practice: Briefly mention practicing for better understanding."
)

deviation_prompt = (
    "Impact: Explain the potential consequences of this deviation.\n"
    "Root cause: Identify possible reasons for the deviation.\n"
    "Corrective actions: Suggest 2-3 steps to address the deviation.\n"
    "Prevention: Recommend measures to prevent future occurrences.\n"
    "Reporting: Emphasize the importance of reporting deviations."
)

def generate_text(prompt):
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(API_KEY, headers=headers, json=payload)
    print(response.text)  # Add this line to check the API response
    if response.status_code != 200:
        error_message = f"Error: Received status code {response.status_code}. Response: {response.text}"
        raise Exception(error_message)
    
    response_json = response.json()
    print(f"Full API response: {response_json}")  # Debug print
    
    if 'filters' in response_json:
        error_message = "Error generating text. Filter response received."
        raise Exception(error_message)
    
    return response_json

@train_bp.route('/')
def index():
    return render_template('train.html')

@train_bp.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        user_prompt = data.get('script')  # Fetch user-generated script
        script_type = data.get('type', 'sop')  # Get the script type, default to 'sop'
        
        print(f"Generating text for prompt: {user_prompt}")  # Add this line to check the prompt
        
        # Choose the appropriate static prompt based on the script type
        static_prompt = sop_prompt if script_type == 'sop' else deviation_prompt
        
        # Combine user input with the static prompt
        combined_prompt = f"{user_prompt}\n\n{static_prompt}"

        # Call the function to generate text using Google's Generative Language API
        response = generate_text(combined_prompt)
        print(response)  # Add this line to check the JSON response
        generated_text = response.get('candidates', [{}])[0].get('output', '').strip()
        
        print(f"Generated text: {generated_text}")  # Debug print

        return jsonify({'text': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500