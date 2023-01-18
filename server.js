//import express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const sharp = require('sharp');
const exec = require('child_process').exec;
const sql = require('./database');
const e = require('express');
const { data } = require('jquery');
const crypto = require('crypto');
const githookVerifier = require('verify-github-webhook-secret');
const process = require('process');


database = new sql();
database.createTable();
dotenv.config();
let port = process.env.PORT || 3000;

visitsBuffer = 5;
visitsBufferCounter = 0;
home_visits = 0;


//random string generator
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

let admin_creds = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const ADMIN_COOKIE = process.env.ADMIN_COOKIE || admin_creds;

//see which static files most popular and how many times they are requested

//make json files if not exist on startup 

//games.json
if(fs.existsSync('./public/games.json')){
}else{
    console.log("games.json does not exist, creating...");
    fs.writeFileSync('./public/games.json', '{"main":{"apps":[],"visitors":0}}');
}

//./public/visits.csv
if(fs.existsSync('./public/visits.csv')){
}else{
    console.log("visits.csv does not exist, creating...");
    fs.writeFileSync('./public/visits.csv', 'visitors,date,time\n');
}

//middleware to parse user agent and block accordingly
app.use(function(req, res, next) {
    if(process.env.CHROMEBOOK_ONLY==undefined){
        next();
    }else{
        if((req.get('user-agent').indexOf('CrOS')==-1)&&(process.env.CHROMEBOOK_ONLY == "True")){
            if(process.env.ALLOWED_USER_AGENTS != undefined){
                if((process.env.ALLOWED_USER_AGENTS.indexOf(req.get('user-agent')) == -1)){
                    console.log("User-Agent: "+req.get('user-agent')+" is not allowed to access this site.");
                    if(req.path.indexOf('/script.js') == -1&&req.path.indexOf('/styles.css') == -1){
                        res.sendFile(path.join(__dirname+'/public/fakesite/index.html'));
                    } else{
                        if(req.path.indexOf('/script.js') != -1){
                            res.sendFile(path.join(__dirname+'/public/fakesite/script.js'));
                        }else{
                            res.sendFile(path.join(__dirname+'/public/fakesite/styles.css'));
                        }
                    }
                } else {
                next();
                }
            } else {
                if(process.env.CHROMEBOOK_ONLY == "True"){
                    console.log("User-Agent: "+req.get('user-agent')+" is not allowed to access this site.");
                    if(req.path.indexOf('/script.js') == -1&&req.path.indexOf('/styles.css') == -1){
                        res.sendFile(path.join(__dirname+'/public/fakesite/index.html'));
                    } else{
                        if(req.path.indexOf('/script.js') != -1){
                            res.sendFile(path.join(__dirname+'/public/fakesite/script.js'));
                        }else{
                            res.sendFile(path.join(__dirname+'/public/fakesite/styles.css'));
                        }
                    }
                } else{
                    next();
                }
            }
        } else {
            next();
        }
    }
});

    
//visitor counter middleware
app.use(function (req, res, next) {
    if(req.path=="/"){
        if(visitsBufferCounter>=visitsBuffer){
            database.updateHomeVisits(process.env.URL,visitsBuffer);
            visitsBufferCounter=0;
        } else{
            visitsBufferCounter++;
        }
    }
    next();
});



app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');


let lastVisit = new Date();

app.get('/', (req, res) => {
    if(new Date()-lastVisit>1000*5){
        updateGamesJson();
        lastVisit = new Date();
    }
    //res.sendFile(__dirname + '/index.html');
        //read games.json
        let apps =  JSON.parse(fs.readFileSync("public/games.json", "utf8"));
        apps.games.sort((a, b) => parseFloat(a.ranking) - parseFloat(b.ranking));
        res.render('index.ejs',{"appList":apps});
});


app.get('/app/:app', (req, res) => {

    let app = req.params.app;
    database.getGame(app, function(result){
        if(result[0]){  
            res.render('appPage.ejs',{'app':result[0],'visits':home_visits});
            database.updateGame("visits",result[0].visits+1,app);
        } else{
            res.send("Sorry, this game does not exist. </br> <a href='/'>Go Home</a>");
            return;
        }
    });

});

app.get('/visits',(req,res)=>{
    res.sendFile(__dirname + '/public/games.json');
});

app.get('/requestapp',(req,res)=>{
    fs.readFile('public/games.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            let json=JSON.parse(data);
            res.render('requestapp.ejs',{visits:json.home_visits});
        }
    });
    
});


app.post('/git-update',async (req,res)=>{
    console.log("Git update request received");
    const valid = await githookVerifier.verifySecret(req, process.env.GIT_SECRET);
    if(valid){
        // git stash then git pull
        console.log("Git update request verified. RESTARTING SERVER...");

        //git reset --hard HEAD
        //git pull

        exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

            setTimeout(function(){
                console.log("Waiting to restart server...");
            },5000);
            process.exit(0);

        });
        res.status(200).send("Git update request verified. Restarting server...");
        //wait 5 secs

    } else {
        res.status(403).send("Git update request not verified");
    }
});


//accept post request
app.post('/requestapp',(req,res)=>{

    let app = req.body;
    let id = Date.now();
    database.addRequest(app.name,app.email,app['App Name'],id);
    res.redirect('/');

});

app.get('/rpitemps', function (req, res) {
    if(process.env.PI === 'True'){
        let cpuTemp = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
        let cpuTempC = cpuTemp/1000;
        res.send({'cpu':cpuTempC});  
    } else {
        let cpuTempC = 0;
        res.send({'cpu':cpuTempC});  
    }
    
    
}
);

//admin page
//every hour read games.json and write to visits.csv
setInterval(()=>{
    fs.readFile(__dirname + '/public/games.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('reading games.json');
            let file = JSON.parse(data);
            let csv = file.home_visits+ ',' + new Date().toLocaleString() + '\n';
            fs.appendFile(__dirname + '/public/visits.csv',csv,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
    });
},3600000);

//every hour delete first line of visits.csv
setInterval(()=>{
    fs.readFile(__dirname + '/public/visits.csv', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('reading visits.csv');
            let file = data.toString();
            let lines = file.split('\n');
            lines.shift();
            let newFile = lines.join('\n');
            fs.writeFile(__dirname + '/public/visits.csv',newFile,(err)=>{
                if(err){
                    console.log(err);
                }
            }
            );
        }
    });
} ,3600000);



app.get('/admin',(req,res)=>{
    //open requestapps.json
    if(req.cookies == undefined||req.cookies.admin != ADMIN_COOKIE){
        res.render('admin.ejs',{'authorized':false});
    }
    if(req.cookies.admin == ADMIN_COOKIE){
        database.getRequests((result)=>{
            fs.readFile(__dirname + '/public/games.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let apps = JSON.parse(data);
                    res.render('admin.ejs',{'authorized':true,'apps':apps.games,'suggestions':result});
                }
            });
        });
    }
});

app.post('/admin/removesuggestion/:id',(req,res)=>{
    if(req.cookies == undefined||req.cookies.admin != ADMIN_COOKIE){
        res.send('not authorized');
    } else{
        database.deleteRequest(req.params.id);
    }
});

let safety = 0;
function updateGamesJson(){
    database.updateRankings();
    database.getGames((dbResult)=>{
        database.getHomeVisits(process.env.URL,(result)=>{
            try{
                home_visits = result[0].home_visits;
            } catch (err){
                console.log(err);
                home_visits = safety;
                console.log("safety");
            } finally{
                let games = [];
                for(let i = 0; i < dbResult.length; i++){
                    let name = dbResult[i].name;
                    let id = dbResult[i].id;
                    let image = dbResult[i].image;
                    let visits = dbResult[i].visits;
                    let ranking = dbResult[i].ranking;
                    let description = dbResult[i].description;
                    let game = {'name':name,'id':id,'image':image,'visits':visits,'ranking':ranking,'description':description};
                    games.push(game);
                }
                let gamesJson = {"home_visits": home_visits,'games':games};
                fs.writeFileSync(__dirname + '/public/games.json', JSON.stringify(gamesJson), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            
        });
    });
}

app.get('/ping',(req,res)=>{
    res.send('pong: '+ Date.now().toString());
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

