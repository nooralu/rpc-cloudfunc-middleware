import sys
import uuid
import requests
import hashlib
import time
from imp import reload
import json

reload(sys)

# NOTE: This code comes from Youdao's official sample code

YOUDAO_URL = 'https://openapi.youdao.com/api'
APP_KEY = 'your app key'
APP_SECRET = 'your app secret'

def encrypt(signStr):
    hash_algorithm = hashlib.sha256()
    hash_algorithm.update(signStr.encode('utf-8'))
    return hash_algorithm.hexdigest()


def truncate(q):
    if q is None:
        return None
    size = len(q)
    return q if size <= 20 else q[0:10] + str(size) + q[size - 10:size]


def do_request(data):
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    res = requests.post(YOUDAO_URL, data=data, headers=headers)
    return res.json()['translation'][0]


def connect(q):

    data = {}
    data['from'] = 'en'
    data['to'] = 'zh-CHS'
    data['signType'] = 'v3'
    curtime = str(int(time.time()))
    data['curtime'] = curtime
    salt = str(uuid.uuid1())
    signStr = APP_KEY + truncate(q) + salt + curtime + APP_SECRET
    sign = encrypt(signStr)
    data['appKey'] = APP_KEY
    data['q'] = q
    data['salt'] = salt
    data['sign'] = sign

    response = do_request(data)
    return response


def handler(environ, start_response):
    context = environ['fc.context']
    request_uri = environ['fc.request_uri']
    for k, v in environ.items():
        if k.startswith("HTTP_"):
            # process custom request headers
            pass

    # get request_body
    try:
        request_body_size = int(environ.get('CONTENT_LENGTH', 0))
    except (ValueError):
        request_body_size = 0
    request_body = environ['wsgi.input'].read(request_body_size)

    # get request_method
    request_method = environ['REQUEST_METHOD']

    # get path info
    path_info = environ['PATH_INFO']

    # get server_protocol
    server_protocol = environ['SERVER_PROTOCOL']

    # get content_type
    try:
        content_type = environ['CONTENT_TYPE']
    except (KeyError):
        content_type = " "

    # get query_string
    try:
        query_string = environ['QUERY_STRING']
    except (KeyError):
        query_string = " "

    print ('request_body: {}'.format(request_body))

    print ('method: {} path: {}  query_string: {} server_protocol: {}'.format(request_method, path_info,  query_string, server_protocol))
    # do something here

    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    start_response(status, response_headers)
    # return value must be iterable

    try:
        text = json.loads(request_body)['prompt']
    except:
        return json.dumps({'message': 'error'})

    t = connect(text)
    return json.dumps({'message': t})