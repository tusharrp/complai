from flask import Blueprint, render_template

industry_bp = Blueprint('industry', __name__)

@industry_bp.route('/')
def industry():
    return render_template('industry/industry.html')

@industry_bp.route('/pi')
def pi():
    return render_template('industry/pi/pi.html')

