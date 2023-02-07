# html5-game-server

![](https://tokei.rs/b1/github/Zaydo123/html-game-server?category=code) ![](https://tokei.rs/b1/github/Zaydo123/html-game-server?category=files)                                                                                                                                                                                                                                              

This is a quick and simple WebGL/Html5 game server. 
The index.ejs file in the /views directory is editable to customize the website home page.

## Setup:
1. Install <a href='https://nodejs.org/en/'>Node JS</a>
2. Run ```npm install``` in the cloned repository's directory (using terminal, cmd, etc...)
3. Create or use a SQL database and remember the credentials
4. Create environment variables (listed below)
5. Run server.js to start program ```node server.js```
6. Run sample SQL Queries in SQL_SETUP.txt
**boom now you have games**

<h5>Live app at https://physics-central.com</h5>

I RECCOMEND RUNNING with https://github.com/foreversd/forever because the website MIGHT close itself to update.

## .env file config example MANDATORY
```
# Webserver Port
PORT=3000

# For /admin endpoint set password. Default username is admin
ADMIN_COOKIE=PASSWORD

# You must create or use a SQL server (preferrably MariaDB) and enter information to store game data
DB_HOST=127.0.0.1
DB_USER=zaydo123
DB_PASS=password
DB_NAME=html-game-server
URL=URL-OR-IP-ToYourWebsite

# Only allow chromebooks to use website
CHROMEBOOK_ONLY=True

# If running webserver on raspberry pi, /rpitemps endpoint opens up and allows you to monitor temperature
PI=True
```
