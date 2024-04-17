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
    if exists("person_checkpoint.json"):
        with open("person_checkpoint.json", "r") as checkpoint_file:
            line = checkpoint_file.readline()
            last_processed_line = json.loads(line)["last_processed_line"]

    person_metadata = [] # id, name, image_path, known_for_department
    with open("person_ids_04_12_2024.json", encoding='utf-8') as person_ids_file:
        for line_number, line in enumerate(tqdm(person_ids_file, total=3357799)):
            if line_number <= last_processed_line:
                continue

            id = json.loads(line)["id"]
            response = requests.get(f"{host}/3/person/{id}?api_key={api_key}")
            person = response.json()
            if "name" not in person or "profile_path" not in person or "known_for_department" not in person:
                continue

            if person["known_for_department"] != "Acting" and person["known_for_department"] != "Directing":
                continue

            person_metadata.append([id, person["name"], person["profile_path"], person["known_for_department"]])

            if line_number % 5000 == 0: # checkpoint: dump batch of people into csv file
                with open("person_data.csv", "a") as output_file:
                    csv_writer = csv.writer(output_file, delimiter=",", quotechar='"')
                    for entry in person_metadata:
                        csv_writer.writerow(entry)

                person_metadata.clear()

                with open("person_checkpoint.json", "w") as checkpoint_file:
                    json.dump({"last_processed_line": line_number, "total_lines": 3357799, "status": "incomplete"}, checkpoint_file)
                
        # run complete
        with open("person_checkpoint.json", "w") as checkpoint_file:
            json.dump({"last_processed_line": line_number, "status": "complete"}, checkpoint_file)

if __name__ == "__main__":
    main()
