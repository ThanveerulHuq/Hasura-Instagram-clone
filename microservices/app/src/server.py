from src import app
from flask import jsonify, request, render_template,make_response,request
import requests
import json
from wtforms import Form, validators, StringField

filestore_url = "https://filestore.helmet94.hasura-app.io/v1/file"
data_url = "https://data.helmet94.hasura-app.io/v1/query"
filestore_headers = {
   "Authorization": "Bearer d3df3ca86db4b0f131ae030cf4dceb053f82c8cb624cd01b"
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
        return render_template('Image_upload_form.html')

@app.route('/uploadPost', methods=['POST'])
def upload_post():
    request_json = request.get_json(silent=True)
    print(request_json)
    file_key = request_json['file_key']
    user_id = request_json['user_id']
    descr = request_json['descr']
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

    return "success"	
