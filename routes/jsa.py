from flask import Flask, render_template, request, jsonify, Blueprint
import requests
import logging
import json
import re

app = Flask(__name__)
jsa_bp = Blueprint('jsa', __name__)

API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'  # Updated API key
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@jsa_bp.route('/')
def jsa_index():
    return render_template('industry/pi/ehs/jsa/jsa.html')

@jsa_bp.route('/analyze', methods=['POST'])
def analyze_activity():
    activity = request.form.get('activity')
    logging.debug(f"Received activity details: {activity}")

    if not activity:
        return jsonify({'error': 'No activity details provided'}), 400

    prompt = f"""
    Given the following job activity in a JSA (Job Safety Analysis) report:
    
    Activity: {activity}
    
    Please provide a detailed analysis including:
    1. Potential Hazards: List one possible hazards associated with this activity, give only the most relevant and common.
    2. Severity Before Mitigation: Rate the severity for hazard before any safety measures are implemented. Use a scale of Low, Medium, High, or Critical.
    3. Required Control & Checks: Provide a comprehensive text of all necessary safety measures, equipment, and procedures to mitigate each hazard in one paragraph.
    4. Severity After Mitigation: Re-evaluate the severity for each hazard after the proposed safety measures are implemented.
    5. Action Party: Specify who is responsible for implementing and maintaining each safety measure.

    Provide as much detail as possible for each section and give only 1 hazard and corresponding details. Format the response as a JSON object with these fields - 'Hazards', 'SeverityBeforeMitigation', 'ControlAndChecks', 'SeverityAfterMitigation', 'ActionParty' 
    """

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

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        response_json = response.json()
        logging.debug(f"API response: {response_json}")

        if 'candidates' in response_json and response_json['candidates']:
            generated_text = response_json['candidates'][0]['content']['parts'][0]['text'].strip('```json').strip('```      ')

            logging.debug(f"Generated text: {generated_text}")

            # Extract JSON from the generated text
            json_match = re.search(r'\{.*\}', generated_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                result = json.loads(json_str)
                
                # Ensure all expected keys are present
                expected_keys = ['Hazards', 'SeverityBeforeMitigation', 'ControlAndChecks', 
                                 'SeverityAfterMitigation', 'ActionParty']
                for key in expected_keys:
                    if key not in result:
                        result[key] = "Not provided"

                return jsonify(result)
            else:
                logging.error("No JSON object found in the generated text")
                return jsonify({"error": "Failed to extract JSON from the generated text"}), 500
        elif 'filters' in response_json:
            logging.warning(f"Content filtered by API: {response_json['filters']}")
            return jsonify({"error": "Content filtered by API", "details": response_json['filters']}), 422
        else:
            logging.error(f"Unexpected API response format: {response_json}")
            return jsonify({"error": "Unexpected API response format"}), 500

    except requests.exceptions.RequestException as e:
        logging.error(f"Request to external API failed: {e}")
        return jsonify({"error": "Failed to get response from API"}), 500
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse the generated text: {e}")
        return jsonify({"error": "Failed to parse the generated text"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == '__main__':
    app.run(debug=True)