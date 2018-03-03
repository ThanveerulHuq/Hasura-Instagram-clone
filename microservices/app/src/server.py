from src import app
from flask import jsonify, request, render_template,make_response,request
import requests
import json
from wtforms import Form, validators, StringField

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024


signup_url = "https://auth.clipping57.hasura-app.io/v1/signup"
data_url = "https://data.clipping57.hasura-app.io/v1/query"
auth_headers = {"Content-Type": "application/json"}
data_headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer f0ce51389aabf2bba1a026551e1c22cb7449ec113d096df8"
}

@app.route('/')
def index():
    return "<h1>Hello World - Thanveer</h1>"

@app.route('/signup',methods = ['GET', 'POST'])
def signup():
    request_json = request.get_json(silent=True)    
    res= add_user_data(request_json)
    if('error' in res):
        return jsonify(error=res['error'])
    else:
        return jsonify(user=add_user_auth(request_json))

def add_user_data(user):
    query= {
        "type": "insert",
        "args":{
            "table":"users",
            "objects":[
                {"name": user['name'],"user_name": user['user_name'] ,"email_id":user['email_id'],"mobile_no":user['mobile_no'],"age":user['age']}
            ],
            "returning":["user_id"]
        }
    }
    resp = requests.request("POST", data_url, data=json.dumps(query), headers=data_headers)
    response = resp.content
    jsonResponse = json.loads(response.decode('utf-8'))
    print(jsonResponse)
    return jsonResponse
    

def add_user_auth(user):
    query = {
    "provider": "username",
    "data": {
    "username": user['user_name'],
    "password": user['password']
    }
    }
    resp = requests.request("POST", signup_url, data=json.dumps(query), headers=auth_headers)
    response = resp.content
    jsonResponse = json.loads(response.decode('utf-8'))
    print(jsonResponse)
    # print(jsonResponse['code'])
    if('code' in jsonResponse):
        return jsonResponse['message']
    else:
        auth_token= jsonResponse['auth_token']
        username= jsonResponse['username']
        print(auth_token)
        return {'auth_token':auth_token,'username':username}


@app.route('/uploadImage', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        filename=file.filename
        if file and filename.split(".")[-1].lower() in allowed_extns:
            resp = requests.post(filestore_url, data=file.read(), headers=filestore_headers)
            response = resp.content
            jsonResponse = json.loads(response.decode('utf-8'))
            return json.dumps({'filekey': jsonResponse['file_id']})
        else:
            print("not exist")
            return "failed"
    else:
        return render_template('image_upload_form.html')

@app.route('/uploadPost', methods=['POST'])
def upload_post():
    request_json = request.get_json(silent=True)
    print(request_json)
    file_key = request_json['file_key']
    user_id = request_json['user_id']
    descr = request_json['descr']
    tags_string=request_json['tags']
    query= {
        "type": "insert",
        "args":{
            "table":"user_post",
            "objects":[
                {"image_url": file_key ,"created_by": user_id ,"description": descr}
            ],
            "returning":["post_id"]
        }
    }
    resp = requests.request("POST", data_url, data=json.dumps(query), headers=data_headers)
    response = resp.content
    jsonResponse = json.loads(response.decode('utf-8'))
    post_id= jsonResponse['returning'][0]['post_id']
    tag_added=add_tags(tags_string,post_id)
    if(tag_added):
        return "success"
    else:
        return "upload failed"

@app.route('/getPosts', methods=['GET'])
def get_post():
    query = {
        "type":"select",
        "args": {
            "table": "user_post",
            "columns": ["*"],
            "where": {"post_id": {"$lt":"40"}},
            "limit":"5",
            "order_by": "-post_id",
        }
    }
    resp = requests.request("POST", data_url, data=json.dumps(query), headers=data_headers)
    json_res = decode_json(resp)
    print(json_res)
    return jsonify(posts=json_res)


def add_tags(tag_string,post_id):
    post_tag_ids=[]
    tags = tag_string.split('|')
    for tag in tags:
        print(tag)
        requestPayload = {
            "type": "select",
            "args": {
                "table": "user_tags",
                "columns": ["tag_id"],
                "where": {
                    "tag_name": tag
                }
            }
        }
        resp = requests.request("POST", data_url, data=json.dumps(requestPayload), headers=data_headers)
        json_res = decode_json(resp)
        if(len(json_res) > 0):
            tag_id = json_res[0]['tag_id']
        else:
            requestPayload1 = {
                "type": "insert",
                "args": {
                    "table": "user_tags",
                    "objects": [
                        {
                            "tag_name": tag,
                            "created_by": 1
                        }
                    ],
                    "returning": [
                        "tag_id"
                    ]
                }
            }
            resp1 = requests.request("POST", data_url, data=json.dumps(requestPayload1), headers=data_headers)
            tag_id= decode_json(resp1)['returning'][0]['tag_id']
            print('tag_id:'+str(tag_id))

        requestPayload2= {
            "type": "insert",
            "args":{
                "table":"post_tags",
                "objects":[
                    {"post_id":post_id ,"tag_id": tag_id}
                ],
                "returning":["post_tag_id"]
            }
        }
        resp2 = requests.request("POST", data_url, data=json.dumps(requestPayload2), headers=data_headers)
        response = decode_json(resp2)['returning'][0]['post_tag_id']
        print(response)
        post_tag_ids.append(response)
    if(len(post_tag_ids) > 0):
        return True
    else:
        return False

def decode_json(response):
    response = response.content
    json_response = json.loads(response.decode('utf-8'))
    return json_response