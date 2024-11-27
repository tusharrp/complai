import logging
from flask import Blueprint, render_template, request, jsonify
import requests
import json
import re

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

fishbone_bp = Blueprint('fishbone', __name__,
                        template_folder='../../templates',
                        static_folder='../../static',
                        static_url_path='/static')

API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

@fishbone_bp.route('/')
def fishbone_analysis():
    return render_template('industry/pi/ehs/deviation/analysis/fishbone/fishbone.html')

@fishbone_bp.route('/generate_fishbone', methods=['POST'])
def generate_fishbone():
    if request.method != 'POST':
        return jsonify({'error': 'Invalid request method'}), 405
    
    problem = request.json.get('problem')
    if not problem:
        return jsonify({'error': 'No problem provided'}), 400
    
    payload = {
        "contents": [{
            "parts": [{
                "text": f"Generate causes for a fishbone diagram addressing the problem: '{problem}'. Provide 3 causes for each of these categories: Man, Machine, Material, Method, Measurement, Environment. Format the response as a JSON object with categories as keys and lists of causes as values."
            }]
        }]
    }
    
    try:
        logger.debug(f"Sending request to API with payload: {payload}")
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        
        logger.debug(f"Received raw response: {response.text}")
        response_json = response.json()
        logger.debug(f"Parsed JSON response: {response_json}")
        
        if 'candidates' not in response_json or not response_json['candidates']:
            logger.error("No candidates in response")
            return jsonify({'error': 'No results generated'}), 500
        
        response_text = response_json['candidates'][0]['content']['parts'][0]['text']
        logger.debug(f"Extracted response text: {response_text}")
        
        # Clean up the response text
        response_text = response_text.strip()
        # Remove any markdown code block syntax
        response_text = re.sub(r'^```json\s*|\s*```$', '', response_text, flags=re.MULTILINE)
        # Remove any non-JSON text before or after the JSON object
        response_text = re.search(r'\{.*\}', response_text, re.DOTALL)
        if response_text:
            response_text = response_text.group(0)
        else:
            logger.error("No JSON object found in response")
            return jsonify({'error': 'Invalid response format'}), 500
        
        logger.debug(f"Cleaned response text: {response_text}")
        
        causes = json.loads(response_text)
        logger.debug(f"Parsed causes: {causes}")
        
        return jsonify(causes)
    
    except requests.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return jsonify({'error': 'API request failed'}), 500
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        logger.error(f"Problematic JSON: {response_text}")
        return jsonify({'error': 'Failed to parse API response', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500