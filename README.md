# Bacon

Steps for installing and running the React App
1. Navigate to the bacon-front-end directory

2. Install Node.js
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    nvm install 16
    node -v
    ```

4. Install packages
   ```bash
   npm install react-router-dom --save
   npm install styled-components
   ```
7. Start server
    ```bash
    npm start
    ```
10. Open http://172.22.132.192:8006/

Steps for setting up test db and running its associated Flask API
1. Install miniconda following [quick command line install instructions for Linux](https://docs.anaconda.com/free/miniconda/index.html):
    ```bash
    mkdir -p ~/miniconda3
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
    rm -rf ~/miniconda3/miniconda.sh
    ~/miniconda3/bin/conda init bash
    ```
2. activate conda environment
   ```
   conda activate
   ```
   - use `conda info --envs` to check which miniconda environment is activated
4. Create new conda environment using requirements for backend:
    ```bash
    cd bacon-back-end/test/
    conda create –-name {env name} --file requirements.txt
    ```
    - use `conda activate {env_name}` and `conda deactivate {env_name}` to enter and leave miniconda environment respectively
5. Make sure to set the `LD_LIBRARY_PATH` environment varibale to include the directory where the Instant Client libraries are located. As long as Oracle Database Express Edition (XE) was properly installed, these libraries will already be on your machine
    ```bash
    export LD_LIBRARY_PATH=/u01/app/oracle/product/11.2.0/xe/lib$LD_LIBRARY_PATH
    ```
6. load test data into sqlplus database
    ```bash
    bash build_db.sh
    ```
    - assumes you have an existing user setup with username 'guest' and password 'guest'
7. launch Flask API
    ```bash    
    python testAPI.py
    ```
    - `GET /` returns all entries in test table
    - `GET /<id>` returns entry with specified id

