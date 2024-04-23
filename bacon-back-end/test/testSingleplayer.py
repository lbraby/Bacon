import requests

def main():
    host = input("enter root path of API: ")
    print("connect Turo Pajala (54768) to Tomi Samela (4829)")
    connected = False

    while not connected:
        movie_id = input("enter id of movie to connect actors: ")
        response = requests.get(f"{host}/movies/{movie_id}")

        if response.status_code == 200:
            data = response.json()
            print(f"Movie title guessed: {data['title']}")
        else:
            continue

        response = requests.get(f"{host}/link/movieperson/{movie_id}/54768")
        if response.status_code == 200:
            response = requests.get(f"{host}/link/movieperson/{movie_id}/4829")
            if response.status_code == 200:
                print("you successfully connected the actors!")
                connected = True

if __name__ == "__main__":
    main()
