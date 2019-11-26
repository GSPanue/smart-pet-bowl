import boto3

class Database():
  def __init__(self):
    self.database = boto3.resource("dynamodb")

  def set_database(self, database):
    self.database = database

  def get_database(self):
    return self.database

  def get_table(self, table_name):
    database = self.get_database()

    return database.Table(table_name)

  def put(self, table_name, item):
    table = self.get_table(table_name)

    table.put_item(
      Item = item
    )

  def get(self, table_name, key):
    table = self.get_table(table_name)

    response = table.get_item(
      Key = key
    )

    return response["Item"]
