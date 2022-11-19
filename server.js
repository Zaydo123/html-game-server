//import express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const sharp = require('sharp');

//all app images are 600x600 by default

dotenv.config();
let ignoredRoutes = ['visits','requestapp','admin'];
let port = process.env.PORT || 3000;

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
//requestapps.json
if(fs.existsSync('./requestapps.json')){
}else{
    console.log("requestapps.json does not exist, creating...");
    fs.writeFileSync('./requestapps.json', '{"requests":[]}');
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
    let filename = path.basename(req.url);
    let extension = path.extname(filename);
    if (extension === ''&& ignoredRoutes.indexOf(filename) == -1) {
        //console.log('Request for ' + filename + ' received');
        //open games.json file and update main.apps
        fs.readFile('public/games.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                try{
                    obj = JSON.parse(data); //now it an object
                    let found = false;
                    if(filename==""){
                        obj.home_visits++;
                    } else{
                        for(let i = 0; i < obj.games.length; i++){
                            if(obj.games[i].name==filename){
                                obj.games[i].visits++;
                                found = true;
                                break;
                            }
                        }
                    }
                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFileSync('public/games.json', json, 'utf8', (err)=>{
                        if(err){
                            console.log(err);
                        }
                    }); // write it back 
                } catch{
                    console.log('ERROR parsing in visits middleware');
                }
                //if cant find app in obj.games[index].route_name then add it
            }
        });
            
    }
    next();
});
app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
        //read games.json
        let apps =  JSON.parse(fs.readFileSync("public/games.json", "utf8"));
        apps.games.sort((a, b) => parseFloat(a.ranking) - parseFloat(b.ranking));
        res.render('index.ejs',{"appList":apps});
        //open games.json
});


app.get('/app/:app', (req, res) => {
    let app = req.params.app;
    fs.readFile('public/games.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            let json=JSON.parse(data);
            res.render('appPage.ejs',{'app':app,'visits':json.home_visits});
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


//accept post request
app.post('/requestapp',(req,res)=>{
    //log data from form request
    //append data to requestapps.json file
    fs.readFile(__dirname + '/requestapps.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let file = JSON.parse(data);
            req.body.id = Date.now();
            file.requests.push(req.body);
            fs.writeFile(__dirname + '/requestapps.json', JSON.stringify(file), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    //
                }
            });
        }
    });
    //send response
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


//every week delete contents of visits.csv and write header
setInterval(()=>{
    console.log('deleting visits.csv contents');
    fs.writeFile(__dirname + '/public/visits.csv','visitors,date,time\n',(err)=>{
        if(err){
            console.log(err);
        }
    });
},604800000);

app.get('/admin',(req,res)=>{
    //open requestapps.json
    if(req.cookies == undefined||req.cookies.admin != ADMIN_COOKIE){
        res.render('admin.ejs',{'authorized':false});
    }
    if(req.cookies.admin == ADMIN_COOKIE){
        fs.readFile(__dirname + '/requestapps.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let file = JSON.parse(data);
                
                fs.readFile(__dirname + '/public/games.json', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let apps = JSON.parse(data);
                        res.render('admin.ejs',{'authorized':true,'apps':apps.games,'suggestions':file.requests});
                    }
                });
            }
        });
    }
});

app.post('/admin/removesuggestion/:id',(req,res)=>{
    if(req.cookies == undefined||req.cookies.admin != ADMIN_COOKIE){
        res.send('not authorized');
    } else{
        //find item by id and remove it
        fs.readFile(__dirname + '/requestapps.json', (err, data) => {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                let file = JSON.parse(data);
                for(let i = 0; i < file.requests.length; i++){
                    if(file.requests[i].id == req.params.id){
                        file.requests.splice(i,1);
                        break;
                    }
                }
                fs.writeFile(__dirname + '/requestapps.json', JSON.stringify(file), (err) => {
                    if (err) {
                        console.log(err);
                        res.send('error');
                    } else {
                        res.send('success');
                    }
                });
            }
        });
    }
});

app.post('/admin/removevisits/:id',(req,res)=>{
    if(req.cookies == undefined||req.cookies.admin != ADMIN_COOKIE){
        res.send('not authorized');
    } else{
        console.log('got rq '+req.params.id);
        //open /public/games.json and delete main.apps entry
        //find item by roue_name and remove it
        fs.readFile(__dirname + '/public/games.json', (err, data) => {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                let file = JSON.parse(data);
                for(let i = 0; i < file.games.length; i++){
                    if(file.games[i].id == req.params.id){
                        file.games[i].visits = 0;
                        break;
                    }
                }
                fs.writeFileSync(__dirname + '/public/games.json', JSON.stringify(file), (err) => {
                    if (err) {
                        console.log(err);
                        res.send('error');
                    } else {
                        res.send('success');
                    }
                });
            }
        });
    }
});
const keepAlive = require('./keepalive.js');
const e = require('express');

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
