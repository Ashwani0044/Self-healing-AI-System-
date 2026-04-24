from flask import Flask, jsonify
from metrics import get_system_metrics
from logs.logger import setup_logger

app = Flask(__name__)
logger = setup_logger()

@app.route("/")
def home():
    return {"message": "Self-Healing Dashboard Backend Running"}

@app.route("/metrics")
def metrics():
    data = get_system_metrics()
    return jsonify(data)

# logger usage

@app.route("/simulate-error")
def simulate_error():
    try:
        x = 10 / 0 #intentional crash

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        return {"error": "Simulated error logged"}, 500
    
@app.route("/logs")
def get_logs():
    try:
        with open("logs/app.log", "r") as f:
            logs = f.readlines()
        return {"logs": logs[-20:]}  # last 20 logs
    
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route("/simulate-warning")
def simulate_warning():
    logger.warning("This is a warning test")
    return {"message": "Warning logged"}


if __name__ == "__main__":
    app.run(debug=True)

