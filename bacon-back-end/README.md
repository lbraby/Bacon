# Backend Documentation
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
#### Search for movie: GET `/movies/search/`
- Return `count` entries of movie metadata with titles similar to `search`
- Request body example:
    ```json
    {"search": "Lord of ", "count": 10}
    ```
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
#### Search for person: GET `/people/search/`
- Return `count` entries of person metadata with names similar to `search`
- Request body example:
    ```json
    {"search": "John ", "count": 10}
    ```
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
        "game_id": 31,
        "person1": {
            "name": "Jack Black",
            "person_id": 70851,
            "poster_path": "https://image.tmdb.org/t/p/original/rtCx0fiYxJVhzXXdwZE2XRTfIKE.jpg"
        },
        "person2": {
            "name": "Chris Pratt",
            "person_id": 73457,
            "poster_path": "https://image.tmdb.org/t/p/original/83o3koL82jt30EJ0rz4Bnzrt2dd.jpg"
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
#### Get selected starting persons: GET `/multiplayer/<int:game_id>/getselectedpeople/`
- Get person_ids of actors selected for game identified by `game_id` along with the default person_ids if either is null (default1 = Kevin Bacon, default2 = Danny DeVito)
- Content example:
    ```json
    {
        "default1_person_id": 1901628,
        "default2_person_id": 518,
        "otheruser_person_id": 100,
        "userhost_person_id": 110
    }
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
