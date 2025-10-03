# The Bacon Project
**Bacon** is a web-based game inspired by the *Six Degrees of Kevin Bacon* concept, where players connect actors through shared film appearances in as few steps as possible. The game features two modes:
- **Daily Mode**: Players are given two randomly selected actors and must find the shortest connection path between them.
- **PvP Mode**: Each player selects and actor, and they race to see who can connect their pair more quickly and efficiently.
This game was developed as a final project for *CSE 40746: Advanced Database Projects*, where it earned second place in the end-of-semester class competition.
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
