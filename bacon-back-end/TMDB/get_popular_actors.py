import json
import requests
from tqdm import tqdm
import cx_Oracle

def main():
    dsn = cx_Oracle.makedsn('localhost', '1521')
    connection = cx_Oracle.connect(user="guest", password="guest", dsn=dsn)
    cursor = connection.cursor()

    with open('person_ids_04_12_2024.json', encoding='utf-8') as f:
        actors = [json.loads(line) for line in f]

    actors.sort(key=lambda x: x['popularity'], reverse=True)

    top_actors = actors[:2000]

    with open('top_actors_unfiltered.csv', "w", encoding='utf-8') as f:
        for actor in top_actors:
            f.write(f"{actor['id']},{actor['name']},{actor['popularity']}\n")

    top_english_actors = []

    for actor in tqdm(top_actors, total=2000):
        cursor.execute(f"select known_for_department from person where person_id = {actor['id']}")
        result = cursor.fetchone()

        if not result or not result[0] or "Acting" not in result[0]: continue # not known for being an actor

        cursor.execute(f"select movie_id from cast_and_crew where person_id = {actor['id']}")
        movie_ids = [entry[0] for entry in cursor.fetchall()]

        if len(movie_ids) < 35: continue # not in enough movies

        english_movie_ct = 0
        for movie_id in movie_ids:
            result = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=e8b4a83c9722f3795277af240090a870")
            json_result = result.json()
            if "spoken_languages" in json_result:
                for spoken_language in json_result["spoken_languages"]:
                    if spoken_language["english_name"] == "English":
                        english_movie_ct += 1
                        continue

        if english_movie_ct/len(movie_ids) > 0.90:
            top_english_actors.append(actor)

    cursor.close()
    connection.close()

    with open('top_actors.csv', "w", encoding='utf-8') as f:
        for actor in top_english_actors:
            f.write(f"{actor['id']},{actor['name']},{actor['popularity']}\n")


if __name__ == "__main__":
    main()
