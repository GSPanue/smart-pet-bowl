import requests

class API():
  def __init__(self):
    self.api = "https://2hpfgt282i.execute-api.us-east-1.amazonaws.com/dev/api/v1/"

  def set_api(self, api):
    self.api = api

  def get_api(self):
    return self.api

  def get(self, endpoint, payload):
    return requests.get(self.get_api() + endpoint, params=payload)

  def post(self, endpoint, payload):
    requests.post(self.get_api() + endpoint, json=payload)
