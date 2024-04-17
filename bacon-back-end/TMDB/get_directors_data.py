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
    if exists("directors_checkpoint.json"):
        with open("directors_checkpoint.json", "r") as checkpoint_file:
            line = checkpoint_file.readline()
            last_processed_line = json.loads(line)["last_processed_line"]

    directors_metadata = [] # movie_id, id, role
    with open("movie_ids_04_12_2024.json", encoding='utf-8') as movie_ids_file:
        for line_number, line in enumerate(tqdm(movie_ids_file, total=916746)):
            if line_number <= last_processed_line:
                continue

            id = json.loads(line)["id"]
            response = requests.get(f"{host}/3/movie/{id}/credits?api_key={api_key}")
            if "crew" not in response.json():
                continue
            crew = response.json()["crew"]

            for member in crew:
                if member["job"] == "Director":
                    directors_metadata.append([id, member["id"], "director"])
                    break # exit look (assumes each movie only has 1 director

            if line_number % 5000 == 0: # checkpoint: dump batch of director data into csv file
                with open("directors_data.csv", "a") as output_file:
                    csv_writer = csv.writer(output_file, delimiter=",", quotechar='"')
                    for entry in directors_metadata:
                        csv_writer.writerow(entry)

                directors_metadata.clear()

                with open("directors_checkpoint.json", "w") as checkpoint_file:
                    json.dump({"last_processed_line": line_number, "status": "incomplete"}, checkpoint_file)
                
        # run complete
        with open("directors_checkpoint.json", "w") as checkpoint_file:
            json.dump({"last_processed_line": line_number, "total_lines": 916746, "status": "complete"}, checkpoint_file)

if __name__ == "__main__":
    main()

