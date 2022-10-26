# html5-game-server

This is a quick and simple WebGL/Html5 game server. 
The index.ejs file in the /views directory is editable to customize the website home page.

## Setup is simple:
1. Install <a href='https://nodejs.org/en/'>Node JS</a>
2. Run ```npm install``` in the cloned repository's directory (using terminal, cmd, etc...)
5. Run server.js to start program ```node server.js```
**boom now you have games**

<h5>Live app at https://physics-central.com</h5>

## .env file config example (optional)
```
# Webserver Port
PORT=3000
# Only allow chromebooks to use website
CHROMEBOOK_ONLY=True
# If chromebook only, add specific exceptions to certain useragents.
ALLOWED_USER_AGENTS=["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"]
# For /admin endpoint set password. Default username is admin
ADMIN_COOKIE="PASSWORD"
# If running webserver on raspberry pi, /rpitemps endpoint opens up and allows you to monitor temperature
PI="True"
```
