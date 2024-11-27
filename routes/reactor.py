from flask import Blueprint, render_template, request, jsonify, session
import random
import requests
import logging
import json

reactor_bp = Blueprint('reactor', __name__)

API_KEY = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'  # Updated API key
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@reactor_bp.route('/')
def index():
    return render_template('industry/pi/manufacturing/tpm/tpm.html')

@reactor_bp.route('/reactor')
def reactor():
    return render_template('industry/pi/manufacturing/tpm/reactor.html')

@reactor_bp.route('/registration')
def registration():
    return render_template('industry/pi/manufacturing/tpm/registration.html')

@reactor_bp.route('/analysis')
def analysis():
    return render_template('industry/pi/manufacturing/tpm/analysis.html')

@reactor_bp.route('/save_report', methods=['POST'])
def save_report():
    report_data = request.json
    session['report_data'] = report_data
    return jsonify({'success': True, 'redirect': '/industry/pi/manufacturing/tpm/analysis'})

@reactor_bp.route('/get_dummy_data')
def get_dummy_data():
    dummy_data = {
        'overallMaintenance': {
            'good': random.randint(50, 80),
            'fair': random.randint(10, 30),
            'poor': random.randint(5, 20)
        },
        'reactorInternals': [random.randint(0, 20) for _ in range(6)],
        'heatExchangerEfficiency': [random.randint(80, 100) for _ in range(12)],
        'coolantSystem': [
            {'component': 'Pipes', 'lastMaintenance': '2024-03-15', 'nextScheduled': '2024-09-15', 'status': random.choice(['Excellent', 'Good', 'Fair', 'Poor'])},
            {'component': 'Valves', 'lastMaintenance': '2024-02-01', 'nextScheduled': '2024-08-01', 'status': random.choice(['Excellent', 'Good', 'Fair', 'Poor'])},
            {'component': 'Filters', 'lastMaintenance': '2024-01-10', 'nextScheduled': '2024-07-10', 'status': random.choice(['Excellent', 'Good', 'Fair', 'Poor'])},
        ],
        'keyFindings': [
            "Critical wear detected on reactor core support structure",
            "Steam generator #2 showing signs of increased corrosion",
            "ECCS pump #3 performance below expected levels",
            "Turbine efficiency improved by 5% after recent maintenance",
            "Containment leak rate test results within acceptable range"
        ],
        'recommendations': [
            "Schedule immediate inspection of reactor core support structure",
            "Increase monitoring frequency for steam generator #2",
            "Plan for ECCS pump #3 overhaul within next 6 months",
            "Continue optimized maintenance schedule for turbine systems",
            "Conduct additional training for containment system maintenance personnel"
        ]
    }
    return jsonify(dummy_data)

@reactor_bp.route('/rephrase_text', methods=['POST'])
def rephrase_text():
    try:
        text = request.json['text']
        if not text:
            return jsonify({"error": "No text provided"}), 400

        pharma_prompt = f"""
        Based on the following brief description of a preventive maintenance activity of reactor in a pharmaceutical Industry, generate a detailed three-line report. Each line should focus on a specific aspect: 1) The main task performed, 2) Detailed observations made during the activity, and 3) Recommendations or follow-up actions based on the maintenance technician's experience.

        Brief description: {text}

        Generate a three-line report in the following format:
        1. Main task: [Detailed description of the primary maintenance activity performed]
        2. Observations: [Specific findings, measurements, or irregularities noticed during the maintenance]
        3. Recommendations: [Experience-based suggestions for follow-up actions or improvements]

        Ensure each line is comprehensive and uses appropriate pharmaceutical industry terminology.
        """

        payload = {
            "contents": [{
                "parts": [{
                    "text": pharma_prompt
                }]
            }]
        }

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        if 'candidates' not in data or not data['candidates']:
            return jsonify({'error': 'No results generated'}), 500

        rephrased_text = data['candidates'][0]['output']
        return jsonify({"rephrased_text": rephrased_text})

    except requests.exceptions.RequestException as e:
        print(f"RequestException: {e}")
        if e.response:
            print(f"Response Content: {e.response.text}")
        return jsonify({"error": f"Failed to rephrase text: {str(e)}"}), 500
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500