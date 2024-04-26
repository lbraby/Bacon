import json
from flask import Flask, request, jsonify
import cx_Oracle
import random

app = Flask(__name__)

@app.route("/", methods=["GET"])
def test():
    return jsonify({"status": "success"})

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

@app.route("/movies/search/<string:search>/<int:count>", methods=["GET"])
def search_movie(search, count):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    # clean search input
    search = search.lower().replace('_', ' ')

    cursor.execute(f"select * from movie where lower(title) like '{search}%' and rownum <= {count}")

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    if rows:
        # convert rows from list of tuples to list of objects
        rows = list(map(lambda x : {
            "movie_id": x[0],
            "title":x[1],
            "release_date":x[2],
            "poster_path":x[3]
        }, rows))
        return jsonify({
            "result":"success",
            "data": rows
        })
    else:
        return jsonify({"error": "Not found"}), 404

@app.route("/people/search/<string:search>/<int:count>", methods=["GET"])
def search_person(search, count):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    # clean search input
    search = search.lower().replace('_', ' ')

    cursor.execute(f"select * from person where lower(name) like '{search}%' and rownum <= {count}")

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    if rows:
        # convert rows from list of tuples to list of objects
        rows = list(map(lambda x : {
            "person_id": x[0],
            "name":x[1],
            "poster_path":x[2],
            "known_for_department":x[3]
        }, rows))
        return jsonify({
            "result":"success",
            "data": rows
        })
    else:
        return jsonify({"error": "Not found"}), 404

def query_person(id, cursor):
    cursor.execute(f"SELECT * FROM person p where p.person_id = {id}")
    p = cursor.fetchone()
    return({
        "person_id":p[0],
        "name":p[1],
        "poster_path":p[2]
    })

def get_random_person(cursor):
    cursor.execute(f"select person_id from ( select * from person order by dbms_random.value ) where rownum <= 1")
    row = cursor.fetchone()
    return row[0]

@app.route("/dailymode",methods=["GET"])
def dailymode():
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from dailymode where todays_date=trunc(sysdate)")
    row = cursor.fetchone()


    if row:
        person1 = query_person(row[1], cursor)
        person2 = query_person(row[2], cursor)
    else:
        get_random_person(cursor)
        try:
            cursor.execute(f"insert into dailymode(person1_id, person2_id, todays_date) \
                           values({get_random_person(cursor)}, {get_random_person(cursor)}, trunc(sysdate))")
            connection.commit()
        except cx_Oracle.DatabaseError as e:
            connection.rollback()
            cursor.close()
            connection.close()
            return jsonify({"error": "error commiting to table dailymode"}), 500

        cursor.execute(f"select * from dailymode where todays_date=trunc(sysdate)")
        row = cursor.fetchone()
        person1 = query_person(row[1], cursor)
        person2 = query_person(row[2], cursor)

    cursor.close()
    connection.close()

    return jsonify({
        "result":"success",
        "person1":person1,
        "person2":person2
    })

# pass userhost_name in body of request
@app.route("/multiplayer/newgame/", methods=["POST"])
def new_game():
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type not application/json"}), 404
    
    try:
        userhost_name = json.loads(request.data)["userhost_name"]
    except:
        return jsonify({"error": "userhost_name not in request body"}), 404
    
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("SELECT game_id_sequence.nextval from dual")
    game_id = cursor.fetchone()[0]

    try:
        cursor.execute("INSERT into multiplayer (game_id, ready, userhost_name, userhost_last_pulse) \
                       values (:id, 0, :name, sysdate)", id=game_id, name=userhost_name)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success", "game_id": game_id})

@app.route("/multiplayer/joinablegames/<int:pulse_timeout_s>/", methods=["GET"])
def get_joinable_games(pulse_timeout_s):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("SELECT game_id, userhost_name from multiplayer \
                   where ready = 0 and userhost_last_pulse + (:timeout * (1/24/60/60)) >= sysdate", timeout=pulse_timeout_s)

    rows = cursor.fetchall()
    cursor.close()
    connection.close()

    if rows:
        rows = list(map(lambda x : {
            "game_id": x[0],
            "userhost_name":x[1]
        }, rows))
        return jsonify({
            "result":"success",
            "data": rows
        })
    else:
        return jsonify({"error": "Not found"}), 404

# pass otheruser_name in body of request
@app.route("/multiplayer/<int:game_id>/joingame/", methods=["PUT"])
def join_game(game_id):
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type not application/json"}), 404
    
    try:
        otheruser_name = json.loads(request.data)["otheruser_name"]
    except:
        return jsonify({"error": "otheruser_name not in request body"}), 404
    
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set ready=1, otheruser_name=:name, otheruser_last_pulse=sysdate \
                       where game_id=:game_id", name=otheruser_name, game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/pulse/userhost/", methods=["PUT"])
def userhost_pulse(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set userhost_last_pulse=sysdate where game_id=:game_id", game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/pulse/otheruser/", methods=["PUT"])
def otheruser_pulse(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set otheruser_last_pulse=sysdate where game_id=:game_id", game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/pulsecheck/userhost/", methods=["GET"])
def userhost_pulsecheck(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("select (sysdate - userhost_last_pulse) * 24 * 60 * 60 from multiplayer where game_id=:game_id", game_id=game_id)
    
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({"status": "success", "elapsed_seconds": int(row[0])})
    else:
        return jsonify({"error": "Not found"}), 404
    
@app.route("/multiplayer/<int:game_id>/pulsecheck/otheruser/", methods=["GET"])
def otheruser_pulsecheck(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("select (sysdate - otheruser_last_pulse) * 24 * 60 * 60 from multiplayer where game_id=:game_id", game_id=game_id)
    
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({"status": "success", "elapsed_seconds": int(row[0])})
    else:
        return jsonify({"error": "Not found"}), 404
    
@app.route("/multiplayer/<int:game_id>/selectperson/userhost/<int:person_id>/", methods=["PUT"])
def selectperson_userhost(game_id, person_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set userhost_person_id=:person_id, userhost_last_pulse=sysdate \
                       where game_id=:game_id", person_id=person_id, game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/selectperson/otheruser/<int:person_id>/", methods=["PUT"])
def selectperson_otheruser(game_id, person_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set otheruser_person_id=:person_id, otheruser_last_pulse=sysdate \
                       where game_id=:game_id", person_id=person_id, game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/score/userhost/<int:seconds>/<int:links>/", methods=["PUT"])
def score_userhost(game_id, seconds, links):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set userhost_time_seconds=:time, userhost_link_count=:links, userhost_last_pulse=sysdate \
                       where game_id=:game_id", time=seconds, links=links, game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/score/otheruser/<int:seconds>/<int:links>/", methods=["PUT"])
def score_otheruser(game_id, seconds, links):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    try:
        cursor.execute("update multiplayer set otheruser_time_seconds=:time, otheruser_link_count=:links, otheruser_last_pulse=sysdate \
                       where game_id=:game_id", time=seconds, links=links, game_id=game_id)
        connection.commit()
    except cx_Oracle.DatabaseError as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({"error": "error commiting to table multiplayer"}), 500
    
    cursor.close()
    connection.close()
    
    return jsonify({"status": "success"})

@app.route("/multiplayer/<int:game_id>/getscores/", methods=["GET"])
def get_scores(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select userhost_name, userhost_time_seconds, userhost_link_count, otheruser_name, otheruser_time_seconds, otheruser_link_count \
                   from multiplayer where game_id=:game_id", game_id=game_id)

    row = cursor.fetchone()
    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "userhost_name": row[0],
            "userhost_time_seconds": row[1],
            "userhost_link_count":row[2],
            "otheruser_name":row[3],
            "otheruser_time_seconds": row[4],
            "otheruser_link_count":row[5]
        })
    else:
        return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    dsn = cx_Oracle.makedsn('localhost', '1521')
    username = 'guest'
    password = 'guest'

    app.run(host="0.0.0.0", port=8000) # host="0.0.0.0" makes Flask app accessible from external hosts
