from flask import Blueprint, render_template, jsonify, request
from models.google_api import generate_text

deviation_bp = Blueprint('deviation', __name__)

@deviation_bp.route('/')
def deviation():
    return render_template('industry/pi/ehs/deviation/deviation.html')

@deviation_bp.route('/train')
def train():
    return render_template('industry/pi/ehs/sop/train/train.html')

@deviation_bp.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        print("Received data:", data) 
        section = data.get('section')
        user_prompt = data.get('user_prompt')

        combined_prompt = 'Generate the following without any text formatting '+ user_prompt

        if section == 'Deviation Description':
            combined_prompt += """ Create the 'Deviation Description' section for a Deviation Investigation Report.
        Provide a clear and concise description of the deviation, including what happened, when it occurred,
        and how it was discovered. Focus on the facts and avoid speculation."""
        elif section == 'Impact Assessment':
            combined_prompt += """ Create the 'Impact Assessment' section for a Deviation Investigation Report.
        Evaluate the potential impact of the deviation on product quality, patient safety, and regulatory compliance.
        Include any immediate actions taken to mitigate risks and contain the deviation."""
        elif section == 'Root Cause Analysis':
            combined_prompt += """ Create the 'Root Cause Analysis' section for a Deviation Investigation Report.
         present the findings of the root cause analysis and identify any contributing factors."""
        elif section == 'Corrective Actions':
            combined_prompt += """ Create the 'Corrective Actions' section for a Deviation Investigation Report.
        List and describe the corrective actions implemented to address the immediate effects of the deviation
        and prevent its recurrence. Include timelines and responsible parties for each action."""
        elif section == 'Preventive Actions':
            combined_prompt += """ Create the 'Preventive Actions' section for a Deviation Investigation Report.
        Outline the long-term preventive measures to be implemented to avoid similar deviations in the future.
        Include any changes to procedures, training, or systems, and explain how these will prevent recurrence."""
        elif section == 'Investigation Procedure':
            combined_prompt += """ Create the 'Investigation Procedure' section for a Deviation Investigation Report.
        Describe the step-by-step process followed to investigate the deviation. Include methods used,
        personnel involved, and any specific tools or techniques employed during the investigation."""
        elif section == 'Quality Assurance Review':
            combined_prompt += """ Create the 'Quality Assurance Review' section for a Deviation Investigation Report.
        Describe the quality assurance review process for this deviation investigation. Include any
        recommendations or additional actions suggested by the QA team."""
        elif section == 'CAPA Implementation':
            combined_prompt += """ Create the 'CAPA Implementation' section for a Deviation Investigation Report.
        Detail the plan for implementing the Corrective and Preventive Actions (CAPA). Include timelines,
        responsible parties, and methods for verifying the effectiveness of the implemented actions."""
        elif section == 'Supporting Documents':
            combined_prompt += """ Create the 'Supporting Documents' section for a Deviation Investigation Report.
        List and briefly describe any supporting documents, data, or evidence relevant to the deviation
        investigation. This may include test results, batch records, or other pertinent documentation."""
        elif section == 'Approval and Closure':
            combined_prompt += """ Create the 'Approval and Closure' section for a Deviation Investigation Report.
        Outline the process for reviewing and approving the deviation investigation report. Include
        the names and roles of individuals responsible for final approval and report closure."""
        else:
            return jsonify({'text': ''})

        generated_text = generate_text(combined_prompt)

        return jsonify({'text': generated_text})
    except Exception as e:
        print("Error in generate route:", str(e))
        return jsonify({'error': str(e)}), 500