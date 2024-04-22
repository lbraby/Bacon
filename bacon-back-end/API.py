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

@app.route("/movies/<int:id>/", methods=["GET"])
def get_movie(id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"SELECT * FROM movie m where m.movie_id = {id}")

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "movie_id": row[0], 
            "title": row[1],
            "release_date":row[2],
            "poster_path":row[3]
        })
    else:
        return jsonify({"error": "Not found"}), 404
    
@app.route("/people/<int:id>/", methods=["GET"])
def get_person(id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"SELECT * FROM person p where p.person_id = {id}")

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "person_id": row[0], 
            "name": row[1],
            "image_path":row[2],
            "known_for_department":row[3][:-1]
        })
    else:
        return jsonify({"error": "Not found"}), 404

@app.route("/link/movieperson/<int:movie_id>/<int:person_id>/", methods=["GET"])
def movie_person(movie_id, person_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from cast_and_crew c where c.movie_id = {movie_id} and c.person_id = {person_id}")

    row = cursor.fetchall()

    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "result":"success"
        })
    else:
        return jsonify({"result": "failure"})

@app.route("/link/moviemovie/<int:id1>/<int:id2>/", methods=["GET"])
def movie_movie(id1, id2):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select person_id from cast_and_crew c where c.movie_id = {id1}")
    row1 = cursor.fetchall()

    cursor.execute(f"select person_id from cast_and_crew c where c.movie_id = {id2}")
    row2 = cursor.fetchall()

    cursor.close()
    connection.close()


    if row1 and row2:
        retn_list = []
        for i in row1:
            if i in row2:
                retn_list.append(i)

        if len(retn_list) == 0:
            return jsonify({
                "result":"failure",
                "list": retn_list
            })
        else:
            return jsonify({
                "result":"success",
                "list": retn_list
            })
            
    else:
        return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    dsn = cx_Oracle.makedsn('localhost', '1521')
    username = 'guest'
    password = 'guest'

    app.run(host="0.0.0.0", port=8000) # host="0.0.0.0" makes Flask app accessible from external hosts

