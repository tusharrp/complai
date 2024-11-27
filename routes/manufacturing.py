from flask import Blueprint, render_template

manufacturing_bp = Blueprint('manufacturing', __name__)

@manufacturing_bp.route('/')
def manufacturing():
    return render_template('industry/pi/manufacturing/manufacturing.html')

@manufacturing_bp.route('/reports')
def reports():
    return render_template('industry/pi/manufacturing/reports.html')