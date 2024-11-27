# app.py

from flask import Flask, render_template
from routes.industry import industry_bp
from routes.pi import pi_bp
from routes.manufacturing import manufacturing_bp
from routes.ehs import ehs_bp
from routes.sop import sop_bp
from routes.login import login_bp
from routes.chatbot import chatbot_bp
from routes.deviation import deviation_bp
from routes.train import train_bp
from routes.why import why_bp
from routes.fishbone import fishbone_bp
from routes.fmea import fmea_bp
from routes.fault_tree import fault_tree_bp
from routes.reports import reports_bp 
from routes.jsa import jsa_bp 
from routes.reactor import reactor_bp 

app = Flask(__name__)

app.register_blueprint(industry_bp, url_prefix='/industry')
app.register_blueprint(pi_bp, url_prefix='/industry/pi')
app.register_blueprint(manufacturing_bp, url_prefix='/industry/pi/manufacturing')
app.register_blueprint(ehs_bp, url_prefix='/industry/pi/ehs')
app.register_blueprint(sop_bp, url_prefix='/industry/pi/ehs/sop')
app.register_blueprint(deviation_bp, url_prefix='/industry/pi/ehs/deviation')
app.register_blueprint(why_bp, url_prefix='/industry/pi/ehs/deviation/analysis/why')
app.register_blueprint(fishbone_bp, url_prefix='/industry/pi/ehs/deviation/analysis/fishbone')
app.register_blueprint(fmea_bp, url_prefix='/industry/pi/ehs/deviation/analysis/fmea')
app.register_blueprint(fault_tree_bp, url_prefix='/industry/pi/ehs/deviation/analysis/fault_tree')
app.register_blueprint(login_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(train_bp, url_prefix='/train')
app.register_blueprint(reports_bp, url_prefix='/industry/pi/manufacturing/reports')
app.register_blueprint(jsa_bp, url_prefix='/industry/pi/ehs/jsa')
app.register_blueprint(reactor_bp, url_prefix='/industry/pi/manufacturing/tpm/tpm')

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/industry/pi/ehs/work_order')
def work_order():
    return render_template('industry/pi/ehs/work order/work.html')

@app.route('/industry/pi/ehs/work_order/calendar')
def calendar():
    return render_template('industry/pi/ehs/work order/calendar.html')

if __name__ == "__main__":
    app.run(debug=True)
