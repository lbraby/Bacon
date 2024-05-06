import json
import csv
from flask import Flask, request, jsonify
import cx_Oracle
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# define dsn, username, password for when API launched using gunicorn:
# to run using gunicorn: gunicorn API:app --name baconAPI --workers 2 --bind 0.0.0.0:8000 --daemon
dsn = cx_Oracle.makedsn('localhost', '1521')
username = 'guest'
password = 'guest'

@app.route("/", methods=["GET"])
def test():
    return jsonify({"status": "success"})

@app.route("/movies/<int:id>/", methods=["GET"])
def get_movie(id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"SELECT * FROM movie m where m.movie_id = :id", id=id)

    row = cursor.fetchone()
    if not row: return jsonify({"error": "Not found"}), 404

    result = {
        "movie_id": row[0],
        "title": row[1],
        "release_date": row[2],
        "poster_path": "https://image.tmdb.org/t/p/original/" + row[3] if row[3] else "https://drive.google.com/file/d/1VxMSoCUpcnHlcjKY3kpHZYGcRhdvlgoi/view?usp=sharing"
    }

    # get actors in movie
    cursor.execute(f"select person_id, name from cast_and_crew natural join person where movie_id = :id and role like 'actor%' order by id", id=id)
    rows = cursor.fetchall()

    result["actors"] = list(map(lambda x : {
            "person_id": x[0],
            "name": x[1]
        }, rows))

    cursor.execute(f"select person_id, name from cast_and_crew natural join person where movie_id = :id and role like 'director%'", id=id)
    row = cursor.fetchone()
    result["director"] = {"person_id": row[0], "name": row[1]} if row else None

    cursor.close()
    connection.close()

    return jsonify(result)

@app.route("/people/<int:id>/", methods=["GET"])
def get_person(id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"SELECT * FROM person p where p.person_id = :id", id=id)

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "person_id": row[0],
            "name": row[1],
            "image_path": "https://image.tmdb.org/t/p/original/" + row[2] if row[2] else "https://drive.google.com/file/d/1VxMSoCUpcnHlcjKY3kpHZYGcRhdvlgoi/view?usp=sharing",
            "known_for_department": row[3][:-1]
        })
    else:
        return jsonify({"error": "Not found"}), 404

@app.route("/link/movieperson/<int:movie_id>/<int:person_id>/", methods=["GET"])
def movie_person(movie_id, person_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from cast_and_crew c where c.movie_id = :movie_id and c.person_id = :person_id", movie_id=movie_id, person_id=person_id)

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

    cursor.execute(f"select person_id from cast_and_crew c where c.movie_id = :id1", id1=id1)
    row1 = cursor.fetchall()

    cursor.execute(f"select person_id from cast_and_crew c where c.movie_id = :id2", id2=id2)
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

# pass search term in body of request
@app.route("/movies/search/", methods=["PUT"])
def search_movie():
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type not application/json"}), 404

    try:
        search = json.loads(request.data)["search"].lower().strip() + "%"
        count = int(json.loads(request.data)["count"])
    except:
        return jsonify({"error": "search and/or count not in request body"}), 404

    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from (select * from movie where lower(title) like :search order by length(title)) where rownum <= :count", search=search, count=count)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    if rows:
        # convert rows from list of tuples to list of objects
        rows = list(map(lambda x : {
            "movie_id": x[0],
            "title":x[1],
            "release_date":x[2],
            "poster_path": "https://image.tmdb.org/t/p/original/" + x[3] if x[3] else "https://drive.google.com/file/d/1VxMSoCUpcnHlcjKY3kpHZYGcRhdvlgoi/view?usp=sharing"
        }, rows))
        return jsonify({
            "result":"success",
            "data": rows
        })
    else:
        return jsonify({"error": "Not found"}), 404

# pass search term in body of request
@app.route("/people/search/", methods=["PUT"])
def search_person():
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type not application/json"}), 404

    try:
        search = json.loads(request.data)["search"].lower().strip() + "%"
        count = int(json.loads(request.data)["count"])
    except:
        return jsonify({"error": "search and/or count not in request body"}), 404
    
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from (select * from popular_actors_mv where lower(name) like :search order by length(name)) where rownum <= :count", search=search, count=count)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    if rows:
        # convert rows from list of tuples to list of objects
        rows = list(map(lambda x : {
            "person_id": x[0],
            "name":x[1],
            "image_path": "https://image.tmdb.org/t/p/original/" + x[2] if x[2] else "https://drive.google.com/file/d/1VxMSoCUpcnHlcjKY3kpHZYGcRhdvlgoi/view?usp=sharing",
            "known_for_department":x[3][:-1]
        }, rows))
        return jsonify({
            "result":"success",
            "data": rows
        })
    else:
        return jsonify({"error": "Not found"}), 404

def query_person(id, cursor):
    cursor.execute(f"SELECT * FROM person p where p.person_id = :id", id=id)
    p = cursor.fetchone()
    return({
        "person_id":p[0],
        "name":p[1],
        "poster_path": "https://image.tmdb.org/t/p/original" + p[2] if p[2] else "https://drive.google.com/file/d/1VxMSoCUpcnHlcjKY3kpHZYGcRhdvlgoi/view?usp=sharing"
    })

@app.route("/dailymode", methods=["GET"])
def dailymode():
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select * from dailymode where todays_date=trunc(sysdate)")
    row = cursor.fetchone()

    if row:
        person1 = query_person(row[1], cursor)
        person2 = query_person(row[2], cursor)
    else:
        with open("TMDB/top_actors.csv", encoding="utf-8") as csvfile:
            reader = csv.reader(csvfile)
            rows = list(reader)
            row1, row2 = random.sample(rows, 2)
            person1 = query_person(row1[0], cursor)
            person2 = query_person(row2[0], cursor)

        try:
            cursor.execute("insert into dailymode (person1_id, person2_id, todays_date) \
                           values (:person1_id, :person2_id, trunc(sysdate))",
                                                   person1_id=person1["person_id"], person2_id=person2["person_id"])
            connection.commit()
        except cx_Oracle.DatabaseError as e:
            connection.rollback()
            cursor.close()
            connection.close()
            return jsonify({"error": "error commiting to table multiplayer"}), 500

    cursor.execute("select max(id) from dailymode")
    game_id = cursor.fetchone()[0]

    cursor.close()
    connection.close()

    return jsonify({
        "result": "success",
        "person1": person1,
        "person2": person2,
        "game_id": game_id
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

@app.route("/multiplayer/<int:game_id>/checkready/", methods=["GET"])
def check_ready(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute("select ready from multiplayer where game_id=:game_id", game_id=game_id)

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        return jsonify({"status": "success", "ready": row[0]})
    else:
        return jsonify({"error": "Not found"}), 404

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

@app.route("/multiplayer/<int:game_id>/getselectedpeople/", methods=["GET"])
def getselectedpeople(game_id):
    connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
    cursor = connection.cursor()

    cursor.execute(f"select userhost_person_id, otheruser_person_id \
                   from multiplayer where game_id=:game_id", game_id=game_id)

    row = cursor.fetchone()
    cursor.close()
    connection.close()

    if row:
        return jsonify({
            "userhost_person_id": row[0],
            "otheruser_person_id": row[1],
            "default1_person_id": 4724, # Kevin Bacon
            "default2_person_id": 518 # Danny DeVito
        })
    else:
        return jsonify({"error": "Not found"}), 404

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
