from flask import Blueprint, render_template

pi_bp = Blueprint('pi', __name__)

@pi_bp.route('/pi')
def pi():
    return render_template('industry/pi/pi.html')

@pi_bp.route('/ehs')
def ehs():
    return render_template('industry/pi/ehs/ehs.html')
