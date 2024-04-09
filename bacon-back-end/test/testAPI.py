import json
from flask import Flask, request, jsonify
import cx_Oracle

app = Flask(__name__)

@app.route("/", methods=["GET"])
def query_all():
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM test")
    
    results = []

    for row in cursor:
        results.append({"id": row[0], "text": row[1]})

    return jsonify(results)

@app.route("/<int:id>/", methods=["GET"])
def query_one(id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"SELECT * FROM test where id = {id}")

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({"id": row[0], "text": row[1]})
    else:
        return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    dsn = cx_Oracle.makedsn('localhost', '1521')
    username = 'guest'
    password = 'guest'

    app.run(host="0.0.0.0", port=8000) # host="0.0.0.0" makes Flask app accessible from external hosts

