import requests
import csv
import json
from os.path import exists
from tqdm import tqdm

host = "https://api.themoviedb.org"
api_key = "e8b4a83c9722f3795277af240090a870"

def main():
    # if checkpoint exists, get line where previous run ended
    last_processed_line = -1
    if exists("movie_checkpoint.json"):
        with open("movie_checkpoint.json", "r") as checkpoint_file:
            line = checkpoint_file.readline()
            last_processed_line = json.loads(line)["last_processed_line"]

    movie_metadata = [] # id, title, release_date, poster_path
    with open("movie_ids_04_12_2024.json", encoding='utf-8') as movie_ids_file:
        for line_number, line in enumerate(tqdm(movie_ids_file, total=916746)):
            if line_number <= last_processed_line:
                continue

            id = json.loads(line)["id"]
            response = requests.get(f"{host}/3/movie/{id}?api_key={api_key}")
            movie = response.json()
            if "title" not in movie or "poster_path" not in movie or "release_date" not in movie:
                continue

            movie_metadata.append([id, movie["title"], movie["poster_path"], movie["release_date"]])

            if line_number % 5000 == 0: # checkpoint: dump batch of movies into csv file
                with open("movie_data.csv", "a") as output_file:
                    csv_writer = csv.writer(output_file, delimiter=",", quotechar='"')
                    for entry in movie_metadata:
                        csv_writer.writerow(entry)

                movie_metadata.clear()

                with open("movie_checkpoint.json", "w") as checkpoint_file:
                    json.dump({"last_processed_line": line_number, "status": "incomplete"}, checkpoint_file)
                
        # run complete
        with open("movie_checkpoint.json", "w") as checkpoint_file:
            json.dump({"last_processed_line": line_number, "status": "complete"}, checkpoint_file)

if __name__ == "__main__":
    main()

