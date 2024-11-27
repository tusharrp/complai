from flask import Blueprint, render_template, jsonify, request
from models.google_api import generate_text

sop_bp = Blueprint('sop', __name__)

@sop_bp.route('/sop')
def sop():
    return render_template('industry/pi/ehs/sop/sop.html')

@sop_bp.route('/train')
def train():
    return render_template('industry/pi/ehs/sop/train/train.html')

@sop_bp.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        section = data.get('section')
        user_prompt = data.get('user_prompt')

        combined_prompt = user_prompt

        if section == 'Objective':
            combined_prompt += """ Create the 'Objective' section for a QMS document in the pharmaceutical industry.
        The objective should be clearly defined, focusing on ensuring the quality and compliance
        of the manufacturing process according to regulatory standards."""
        elif section == 'Scope':
            combined_prompt += """ Create the 'Scope' section for a QMS document in the pharmaceutical industry.
        The scope should outline the extent and boundaries of the manufacturing process
        ensuring compliance with regulatory standards."""
        elif section == 'Responsibility':
            combined_prompt += """ Create the 'Responsibility' section for a QMS document in the pharmaceutical industry.
        Define the responsibilities of various roles involved in ensuring the quality and compliance
        of the manufacturing process according to regulatory standards."""
        elif section == 'Accountability':
            combined_prompt += """ Create the 'Accountability' section for a QMS document in the pharmaceutical industry.
        Define the accountability mechanisms for ensuring adherence to quality and regulatory standards
        in the manufacturing process."""
        elif section == 'Abbreviation':
            combined_prompt += """ Create the 'Abbreviation' section for a QMS document in the pharmaceutical industry.
        List and define any abbreviations used within the document to ensure clarity and understanding."""
        elif section == 'Procedure':
            combined_prompt += """ Create the 'Procedure' section for a QMS document in the pharmaceutical industry.
        Outline the step-by-step procedures to be followed to ensure compliance with quality standards
        and regulatory requirements."""
        elif section == 'Authorization of the permit':
            combined_prompt += """
        Create the 'Authorization of the Permit' section for a QMS document in the pharmaceutical industry.
        Describe the process and criteria for authorizing permits within the quality management system.
        """
        elif section == 'Preparation for hot work':
            combined_prompt += """
        Create the 'Preparation for Hot Work' section for a QMS document in the pharmaceutical industry.
        Detail the preparations and safety measures required before commencing any hot work activities
        to ensure compliance with safety and regulatory standards.
        """
        elif section == 'Annexures':
            combined_prompt += """
        Create the 'Annexures' section for a QMS document in the pharmaceutical industry.
        Provide any supplementary information, charts, tables, or additional documentation that supports
        the main content of the document.
        """
        elif section == 'Revision History':
            combined_prompt += """
        Create the 'Revision History' section for a QMS document in the pharmaceutical industry.
        Document the history of revisions made to the document, including dates, descriptions of changes,
        and responsible parties.
        """
        else:
            return jsonify({'text': ''})

        generated_text = generate_text(combined_prompt)

        return jsonify({'text': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500