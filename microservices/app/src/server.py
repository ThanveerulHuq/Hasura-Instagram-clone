from src import app
from flask import jsonify, request, render_template,make_response,request
import requests
import json
from wtforms import Form, validators, StringField

filestore_url = "https://filestore.helmet94.hasura-app.io/v1/file"
data_url = "https://data.helmet94.hasura-app.io/v1/query"
filestore_headers = {
   "Authorization": "Bearer 5a021247deb17e3b4e93a4d99f5b0cf09ac0c880d777bec0"
}
data_headers = {
   "Content-Type": "application/json"
}
allowed_extns =['png','jpeg', 'gif']

class ReusableForm(Form):
   name = StringField('Name:', validators=[validators.required()])

@app.route('/')
def index():
    return "<h1>Hello World - Thanveer</h1>"


@app.route('/authors')
def authors():
    allposts = requests.get("https://jsonplaceholder.typicode.com/posts")
    postsJson = allposts.json()
    authorposts = {}
    for post in postsJson:
        userid = post["userId"]
        if userid in authorposts:
            authorposts[userid] = authorposts[userid]+ 1
        else:
            authorposts[userid] = 1
    allUsers = requests.get("https://jsonplaceholder.typicode.com/users")
    usersJson = allUsers.json()
    usernames = {}
    for usr in usersJson:
        usernames[usr["id"]] = usr["name"]
    authorswithcount = "<h3> Author<span style='margin-left: 40px;'>count</span></h3>"
    for key, value in authorposts.items():
        authorswithcount += '<p>' + usernames[key] + '      ' + str(authorposts[key]) + '</p>'
    return authorswithcount


@app.route('/setcookie')
def cookie_insertion():
    name = request.cookies.get('name')
    age = request.cookies.get('age')
    resp = make_response()
    if name is None:
        resp.set_cookie('name', 'thanveer')
    if age is None:
        resp.set_cookie('age', '23')
    return resp


@app.route('/getcookies')
def get_cookie():
    name = request.cookies.get('name')
    age = request.cookies.get('age')
    if name is not None and age is not None:
        return name + " " + age
    else:
        return "<h5>No cookie found<h5>"


@app.route('/robot.txt')
def deny():
    return "<h1>Request Denied</h1>"

@app.route('/html')
def html():
    return render_template('mypage.html')


@app.route('/input', methods=['GET', 'POST'])
def input():
    form = ReusableForm(request.form)
    if request.method == 'POST':
        name = request.form['name']
        print("Entered Name==> "+name)
    return render_template('login.html', form=form)

#Group task code
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