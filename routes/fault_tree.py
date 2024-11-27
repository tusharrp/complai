from flask import Blueprint, render_template, request, jsonify
import requests
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

fault_tree_bp = Blueprint('fault_tree', __name__)

API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'  # Updated API key
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

@fault_tree_bp.route('/')
def fault_tree():
    return render_template('industry/pi/ehs/deviation/analysis/fault_tree/fault_tree.html')

@fault_tree_bp.route('/generate_fault_tree', methods=['POST'])
def generate_fault_tree():
    if request.method != 'POST':
        return jsonify({'error': 'Invalid request method'}), 405

    top_event = request.json.get('top_event')
    if not top_event:
        return jsonify({'error': 'No top event provided'}), 400

    payload = {
        "contents": [{
            "parts": [{
                "text": f"Generate a fault tree analysis for the top event: '{top_event}' in the pharmaceutical industry. Provide a JSON structure with 'name' for each node and 'children' for sub-events. Include at least two levels of causes, with 2-3 sub-events for each cause. Format the response as a valid JSON object."
            }]
        }]
    }

    headers = {
        'Content-Type': 'application/json'
    }

    try:
        logger.debug(f"Sending request to API with payload: {payload}")
        response = requests.post(API_URL, json=payload, headers=headers)
        logger.debug(f"Received response with status code: {response.status_code}")
        logger.debug(f"Response content: {response.text}")
        
        response.raise_for_status()

        response_json = response.json()
        if 'candidates' not in response_json or not response_json['candidates']:
            logger.error("No candidates in response")
            return jsonify({'error': 'No results generated'}), 500

        response_text = response_json['candidates'][0]['content']['parts'][0]['text']
        logger.debug(f"Extracted response text: {response_text}")

        # Clean up the response text
        response_text = response_text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]  # Remove ```json and ``` 
        
        logger.debug(f"Cleaned response text: {response_text}")

        fault_tree = json.loads(response_text)
        return jsonify(fault_tree)

    except requests.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return jsonify({'error': f"API request failed: {str(e)}"}), 500
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        logger.error(f"Problematic JSON: {response_text}")
        return jsonify({'error': 'Failed to parse API response', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500