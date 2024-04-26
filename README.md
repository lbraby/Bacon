# The Bacon Project
## Setup Steps
### Installing and running React App
1. Navigate to the bacon-front-end directory
2. Install Node.js
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    nvm install 16
    node -v
    ```
3. Install packages
   ```bash
   npm install react-router-dom --save
   npm install styled-components
   ```
4. Start server
    ```bash
    npm start
    ```
### Setting up test API
1. Install miniconda following [quick command line install instructions for Linux](https://docs.anaconda.com/free/miniconda/index.html):
    ```bash
    mkdir -p ~/miniconda3
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
    rm -rf ~/miniconda3/miniconda.sh
    ~/miniconda3/bin/conda init bash
    ```
2. Activate conda environment
   ```
   conda activate
   ```
   - use `conda info --envs` to check which miniconda environment is activated
3. Create new conda environment using requirements for backend:
    ```bash
    cd bacon-back-end/
    conda create –-name {env_name} --file requirements.txt
    ```
    - use `conda activate {env_name}` and `conda deactivate {env_name}` to enter and leave miniconda environment
4. Set the `LD_LIBRARY_PATH` environment variable to include the directory where the Instant Client libraries are located. As long as Oracle Database Express Edition (XE) was properly installed, these libraries will already be on your machine
    ```bash
    export LD_LIBRARY_PATH=/u01/app/oracle/product/11.2.0/xe/lib$LD_LIBRARY_PATH
    ```
6. Load test data into sqlplus database
    ```bash
    cd test/
    bash build_db.sh
    ```
    - assumes you have an existing user setup with username 'guest' and password 'guest'
7. Launch Flask API
    ```bash
    python testAPI.py
    ```
    - `GET /` returns all entries in test table
    - `GET /<id>` returns entry with specified id

Steps for setting up movie db
1. Navigate to `bacon-back-end/`
2. Create and activate new conda environment using requirements file
    ```bash
    conda activate
    conda create –-name {env_name} --file requirements.txt
    conda activate {env_name}
    ```
3. unzip csv files containing data to be loaded
    ```bash
    cd build-movie-db/csvfiles/
    unzip cast_data.zip
    unzip directors_data.zip
    unzip movie_data.zip
    unzip person_data.zip
    cd ../
    ```
4. Allow sqlplus database to autoextend (otherwise sqlplus will not be able to fully load) and grant guest user permissions to create materialized views
    ```bash
    su oracle
    sqlplus / as sysdba
    SQL> ALTER DATABASE DATAFILE '/u01/app/oracle/oradata/XE/system.dbf' AUTOEXTEND ON MAXSIZE unlimited;
    SQL> grant create materialized view to guest;
    ```
5. Build Bacon database
    ```bash
    source buildmoviedb.sh
    ```
    - buildmoviedb.sh assumes that there exists a sqlplus user with username 'guest' and password 'guest'.
## API Endpoints
### Basic Queries
#### Get Movie: GET `/movies/<int:movie_id>/`
- Return metadata associated with `movie_id`
- Content example:
    ```json
    {
        "actors": [
            {
                "name": "Ayako Fujitani",
                "person_id": 84029
            },
            ...
        ],
        "director": {
            "name": "Leos Carax",
            "person_id": 27977
        },
        "movie_id": 8938,
        "poster_path": "https://image.tmdb.org/t/p/original//6xbq2EBAOwy0V7bzd1um3sJX1jd.jpg",
        "release_date": "Sat, 16 Aug 2008 00:00:00 GMT",
        "title": "Tokyo!"
    }
    ```
#### Get Person: GET `/people/<int:person_id>/`
- Return metadata associated with `person_id`
- Content example
    ```json
    {
        "person_id": 3896,
        "name": "Liam Neeson",
        "image_path": "https://image.tmdb.org/t/p/original/bboldwqSC6tdw2iL6631c98l2Mn.jpg",
        "known_for_department": "Acting"
    }
    ```
### Searching
#### Search for movie: GET `/movies/search/<str:search>/<int:count>/`
- Return `count` entries of movie metadata with titles similar to `search`
- where there are spaces in `search`, convert to underscores for request
- Content example:
    ```json
    {
        "result": "success",
        "data": [
                    {
                        "movie_id": 1830,
                        "title": "Lord of War",
                        "release_date": "Fri, 16 Sep 2005 00:00:00 GMT",
                        "poster_path": "https://image.tmdb.org/t/p/original/3MGQD4yXokufNlW1AyRXdiy7ytP.jpg"
                    },
                    ...
                ]
    }
    ```
#### Search for person: GET `/people/search/<str:search>/<int:count>/`
- Return `count` entries of person metadata with names similar to `search`
- where there are spaces in `search`, convert to underscores for request
- Content example:
    ```json
    {
        "result": "success",
        "data": [
                    {
                        "person_id": 3896,
                        "name": "Liam Neeson",
                        "image_path": "https://image.tmdb.org/t/p/original/bboldwqSC6tdw2iL6631c98l2Mn.jpg",
                        "known_for_department": "Acting"
                    },
                    ...
                ]
    }
    ```
### Gameplay
#### Check Movie-Person Link: GET `/link/movieperson/<int:movie_id>/<int:person_id>/`
- Return whether ot not a person is a member of a movie's cast
    ```json
    {"result": "failure"}
    ```
#### Check Movie-Movie Links: GET `/link/moviemovie/<int:movie_id1>/<int:movie_id2>/`
- Return whether or not two movies share cast members and the `person_id`s for those members
- Content example:
    ```json
    {
        "result": "success",
        "data": [[3896], ...]
    }
    ```
#### Get Actors for Dailymode: GET `/dailymode/`
- Return metadata for actors of today's challenge
- Content example:
    ```json
    {
        "person1": {
            "name": "Harrison Ford",
            "person_id": 3,
            "poster_path": "https://image.tmdb.org/t/p/original/ActhM39LTxgx3tnJv3s5nM6hGD1.jpg"
        },
        "person2": {
            "name": "Steven Spielberg",
            "person_id": 488,
            "poster_path": "https://image.tmdb.org/t/p/original/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg"
        },
        "result": "success"
    }
    ```
#### Create Multiplayer Game: POST `/multiplayer/newgame/`
- Create a new multiplayer game identified by passed `userhost_name` and unique `game_id`
- Request body example:
    ```json
    {"userhost_name": "CheekyRabbit89"}
    ```
- Content example:
    ```json
    {"status": "success", "game_id": 4837}
    ```
#### Get Joinable Multiplayer Games: GET `/multiplayer/joinablegames/<int:pulse_timeout_s>/`
- Get a list of multiplayer games where host is waiting for another user
- `pulse_timeout_s` limits returned games to those where host has pinged the server less than `pulse_timeout_s` seconds ago.
- Content exmple:
    ```json
    {
        "result":"success",
        "data":[
            {"game_id":4837,"userhost_name":"User2487"},
            ...
        ],
    }
    ```
#### Join a Multiplayer Game: PUT `/multiplayer/<int:game_id>/joingame/`
- Join multiplayer game identified by `game_id`
- Request body example:
    ```json
    {"otheruser_name": "SkittishPossum27"}
    ```
- Content example:
    ```json
    {"status": "success"}
    ```
#### Check if Multiplayer Game is Ready: GET `/multiplayer/<int:game_id>/checkready/`
- Get value of ready for game with `game_id`. Ready is 1 if game has been joined by another user, 0 otherwise
- Content example:
    ```json
    {"ready":1, "status":"success"}
    ```
#### Send a pulse as userhost: PUT `/multiplayer/<int:game_id>/pulse/userhost/`
- Set userhost_last_pulse to current time
- Content example:
    ```json
    {"status": "success"}
    ```
#### Get time since userhost's last pulse: GET `/multiplayer/<int:game_id>/pulsecheck/userhost/`
- Get difference (in seconds) from now to userhost's last pulse
- Content example:
    ```json
    {"status": "success", "elapsed_seconds": 5}
    ```
#### Send a pulse as otheruser: PUT `/multiplayer/<int:game_id>/pulse/otheruser/`
- Set otheruser_last_pulse to current time
- Content example:
    ```json
    {"status": "success"}
    ```
#### Get time since otheruser's last pulse: GET `/multiplayer/<int:game_id>/pulsecheck/otheruser/`
- Get difference (in seconds) from now to otheruser's last pulse
- Content example:
    ```json
    {"status": "success", "elapsed_seconds": 5}
    ```
#### Select userhost's starting person: PUT `/multiplayer/<int:game_id>/selectperson/userhost/<int:person_id>/`
- Set `userhost_person_id` to `person_id` for game identified by `game_id`
- Content example: 
    ```json
    {"status": "success"}
    ```
#### Select otheruser's starting person: PUT `/multiplayer/<int:game_id>/selectperson/otheruser/<int:person_id>/`
- Set `otheruser_person_id` to `person_id` for game identified by `game_id`
- Content example:
    ```json
    {"status": "success"}
    ```
#### Submit score for userhost: PUT `/multiplayer/<int:game_id>/score/userhost/<int:seconds>/<int:links>/`
- Set `userhost_time_seconds` and `userhost_link_count` for game identified by `game_id`
- Content example:
    ```json
    {"status": "success"}
    ```
#### Submit score for otheruser: PUT `/multiplayer/<int:game_id>/score/otheruser/<int:seconds>/<int:links>/`
- Set `otheruser_time_seconds` and `otheruser_link_count` for game identified by `game_id`
- Content example:
    ```json
    {"status": "success"}
    ```
#### Get final game score: GET `/multiplayer/<int:game_id>/getscores/`
- Get final score of game identified by `game_id`
- Content example:
    ```json
    {
        "otheruser_link_count":6,
        "otheruser_name":"CheekyRabbit89",
        "otheruser_time_seconds":89,
        "userhost_link_count":3,
        "userhost_name":"SkittishPossum27",
        "userhost_time_seconds":15
    }
    ```
