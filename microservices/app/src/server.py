from src import app
from flask import Flask, render_template, request, make_response
import requests
import json
# from flask import jsonify

#app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
filestore_url = "https://filestore.helmet94.hasura-app.io/v1/file"
data_url = "https://data.helmet94.hasura-app.io/v1/query"
filestore_headers = {
   "Authorization": "Bearer d3df3ca86db4b0f131ae030cf4dceb053f82c8cb624cd01b"
}
data_headers = {
   "Content-Type": "application/json"
}
allowed_extns =['png','jpeg', 'gif']
@app.route("/")
def home():
    return "Hasura Hello World"

	
# Uncomment to add a new URL at /new

# @app.route("/json")
# def json_message():
#     return jsonify(message="Hello World")
