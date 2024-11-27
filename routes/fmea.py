from flask import Blueprint, render_template, request, jsonify
import requests
import os
import json
import logging

basedir = os.path.abspath(os.path.dirname(__file__))

fmea_bp = Blueprint('fmea', __name__, 
                    template_folder=os.path.join(basedir, 'templates'),
                    static_folder=os.path.join(basedir, 'static'))

API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@fmea_bp.route('/')
def index():
    return render_template('industry/pi/ehs/deviation/analysis/fmea/fmea.html')

@fmea_bp.route('/generate_fmea', methods=['POST'])
def generate_fmea():
    logger.info("generate_fmea route hit")
    input_text = request.json.get('input')
    if not input_text:
        return jsonify({'error': 'No input provided'}), 400

    payload = {
        "contents": [{
            "parts": [{
                "text": f"Generate a Failure Mode and Effects Analysis (FMEA) for the following input: '{input_text}'. Provide results for each of these steps: 1. Determining failure mode, 2. Assessing severity, 3. Assigning probability number, 4. Assigning detection number, 5. Calculating risk priority number. Format the response as a JSON object with steps as keys and analysis results as values."
            }]
        }]
    }

    try:
        logger.info(f"Sending request to API with payload: {payload}")
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        logger.info(f"API response status: {response.status_code}")
        response_json = response.json()
        logger.info(f"API response JSON: {response_json}")

        if 'candidates' not in response_json or not response_json['candidates']:
            return jsonify({'error': 'No results generated'}), 500

        response_text = response_json['candidates'][0]['content']['parts'][0]['text']
        
        # Extract the JSON string from the response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        json_string = response_text[json_start:json_end]
        
        fmea_results = json.loads(json_string)
        logger.info(f"Processed FMEA results: {fmea_results}")
        return jsonify(fmea_results)

    except requests.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return jsonify({'error': 'API request failed', 'details': str(e)}), 500
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        logger.error(f"Response text: {response_text}")
        return jsonify({'error': 'Failed to parse API response', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}", exc_info=True)
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500