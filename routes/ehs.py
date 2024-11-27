from flask import Blueprint, render_template

ehs_bp = Blueprint('ehs', __name__)

@ehs_bp.route('/ehs')
def ehs():
    return render_template('industry/pi/ehs/ehs.html')

@ehs_bp.route('/sop')
def sop():
    return render_template('industry/pi/ehs/sop/sop.html')

@ehs_bp.route('/deviation')
def deviation():
    return render_template('industry/pi/ehs/deviation/deviation.html')