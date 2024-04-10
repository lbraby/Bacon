# Bacon

Steps for installing and running the React App
1. Navigate to the bacon-front-end directory

2. Install Node.js \n
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \n
    nvm install 16 \n
    node -v

4. npm install react-router-dom --save
5. npm install styled-components
   
7. Start server: npm start
8. Open http://172.22.132.192:8006/

Steps for setting up test db and running its associated Flask API
1. Install miniconda following [quick command line install instructions for Linux](https://docs.anaconda.com/free/miniconda/index.html):
    ```bash
    mkdir -p ~/miniconda3
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
    rm -rf ~/miniconda3/miniconda.sh
    ```
    - use `conda activate [env_name]` and `conda deactivate [env_name]` to enter and leave miniconda environment respectively
    - use `conda info --envs` to check which miniconda environment is activated
2. activate conda environment
3. Create new conda environment using requirements for backend:
    ```bash
    cd bacon-back-end/test/
    conda create –-name {env name} --file requirements.txt
    ```
4. Make sure to set the `LD_LIBRARY_PATH` environment varibale to include the directory where the Instant Client libraries are located. As long as Oracle Database Express Edition (XE) was properly installed, these libraries will already be on your machine
    ```bash
    export LD_LIBRARY_PATH=/u01/app/oracle/product/11.2.0/xe/lib$LD_LIBRARY_PATH
    ```
5. load test data into sqlplus database
    ```bash
    bash build_db.sh
    ```
    - assumes you have an existing user setup with username 'guest' and password 'guest'
6. launch Flask API
    ```bash    
    python testAPI.py
    ```
    - `GET /` returns all entries in test table
    - `GET /<id>` returns entry with specified id

