from flask import Flask, render_template, request, jsonify, Blueprint, send_from_directory
import requests
import os, logging

# Initialize Flask app
app = Flask(__name__,
            template_folder='templates',
            static_folder='static',
            static_url_path='/static')

# API Configuration
API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'  # Updated API key
API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


why_bp = Blueprint('why', __name__,
                   template_folder='../../templates',
                   static_folder='../../static',
                   static_url_path='/static')

@why_bp.route('/')
def why_analysis():
    return render_template('industry/pi/ehs/deviation/analysis/why/why.html')

@why_bp.route('/static/js/why.js')
def serve_js():
    return send_from_directory('../../static/js', 'why.js')

@why_bp.route('/analyze', methods=['POST'])
def analyze():
    """Handle the analysis request."""
    if request.method != 'POST':
        return jsonify({'error': 'Invalid request method'}), 405

    try:
        why_details = request.json['whyDetails']
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Generate exactly three possible reasons for: {why_details}. Provide each reason on a new line."
                }]
            }]
        }

        headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY  # Added API key to headers
        }
    
        logger.debug(f"Sending request to API with payload: {payload}")
        response = requests.post(API_URL, json=payload, headers=headers)
        logger.debug(f"Received response with status code: {response.status_code}")
        logger.debug(f"Response content: {response.text}")
        
        response.raise_for_status()

        if response.status_code != 200:
            return jsonify({'error': 'API request failed'}), 500

        response_json = response.json()
        if 'candidates' not in response_json or not response_json['candidates']:
            return jsonify({'error': 'No results generated'}), 500

        options = response_json['candidates'][0]['content']['parts'][0]['text'].strip().split('\n')
        options = [option.strip() for option in options if option.strip()]

        # Ensure exactly three options
        if len(options) < 3:
            options += ["Not enough information"] * (3 - len(options))
        elif len(options) > 3:
            options = options[:3]

        return jsonify(options)

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500
def create_app():
    app = Flask(__name__,
                template_folder='templates',
                static_folder='static',
                static_url_path='/static')
    app.register_blueprint(why_bp, url_prefix='/industry/pi/ehs/deviation/analysis/why')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)