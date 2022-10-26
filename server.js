//import express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const sharp = require('sharp');

dotenv.config();
let ignoredRoutes = ['','visits','requestapp','admin'];
let port = process.env.PORT || 3000;

//random string generator
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

let admin_creds = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
console.log("Admin Credentials (if not specified in .env file): "+admin_creds);
const ADMIN_COOKIE = process.env.ADMIN_COOKIE || admin_creds;

//see which static files most popular and how many times they are requested

//make json files if not exist on startup 

//visits.json
if(fs.existsSync('./public/visits.json')){
}else{
    console.log("visits.json does not exist, creating...");
    fs.writeFileSync('./public/visits.json', '{"main":{"apps":[],"visitors":0}}');
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
                    res.send('chromebook only! email themanishereinch@gmail.com if you want to access this site from your device');
                } else {
                next();
                }
            } else {
                if(process.env.CHROMEBOOK_ONLY == "True"){
                    console.log("User-Agent: "+req.get('user-agent')+" is not allowed to access this site.");
                    res.send('chromebook only! email themanishereinch@gmail.com if you want to access this site from your device');
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
        //open visits.json file and update main.apps
        fs.readFile('public/visits.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                try{
                    obj = JSON.parse(data); //now it an object
                    let found = false;
                    for(let i = 0; i < obj.main.apps.length; i++){
                        if(obj.main.apps[i].route_name == filename){
                            obj.main.apps[i].visits++;
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        obj.main.apps.push({route_name:filename,description:"",image:"",visits:1});
                    }
    
                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile('public/visits.json', json, 'utf8', (err)=>{
                        if(err){
                            console.log(err);
                        }
                    }); // write it back 
                } catch{
                    console.log('ERROR parsing in visits middleware');
                }
                //if cant find app in obj.main.apps[index].route_name then add it
            }
        });
            
    }
    next();
});
app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');


//look if appImage exists in public/games/appName/
function appImageEdit(appName){
    let appImage = false;
    let dirs = fs.readdirSync('./public/games/'+appName);
    //dont continue if resized image already exists
    for(let i = 0; i < dirs.length; i++){
        if(dirs[i].includes("resized")){
            appImage = true;
        }
    }
    dirs.forEach(file => {
        if((file.indexOf('resized_appImage.')==-1)&&(file.indexOf('appImage.') != -1)&&(appImage == false)){
            appImage = false;
            sharp('./public/games/'+appName+'/'+file)
            .resize(600,600)
            .toFile('./public/games/'+appName+'/'+'resized_'+file, (err, info) => {
                if(err){
                    console.log(err);
                } else {
                    console.log('resizing '+file+' to '+info.width+'x'+info.height);
                }
            });

        }
    });
    return appImage;
}

//open all directories in public/app
fs.readdirSync('./public/games').forEach(file => {
    if(file[0] != '.'){
        appImageEdit(file);
    }
});



//function that reads visits.json and returns the json object
function getVisits(){
    return new Promise((resolve,reject)=>{
        fs.readFile('public/visits.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    }
    );  
}

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    fs.readdir(__dirname + '/public/games', (err, files) => {
        if (err) {
            console.log(err);
            res.send('error')
        } else {
            //turn files into a dictionary
            let apps = {'apps':[]};
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let app_name = file.split('.')[0];
                //replace hyphens with spaces
                while(app_name.indexOf('-') != -1){
                    app_name = app_name.replace('-',' ');
                }
                //capitalize first letter of each word
                app_name = app_name.charAt(0).toUpperCase() + app_name.slice(1);
                let appInfo = {'id':files[i],'name': app_name,'description':"",photos:[]};
                //get photos and videos
                //see if folder has resized_appImage.jpg or resized_appImage.png
                if(fs.existsSync(__dirname + '/public/games/'+file+'/resized_appImage.jpg')){
                    appInfo.photos.push('/games/'+file+'/resized_appImage.jpg');
                }else if(fs.existsSync(__dirname + '/public/games/'+file+'/resized_appImage.png')){
                    appInfo.photos.push('/games/'+file+'/resized_appImage.png');
                }else if(fs.existsSync(__dirname + '/public/games/'+file+'/resized_appImage.gif')){
                    appInfo.photos.push('/games/'+file+'/resized_appImage.gif');
                } else if(fs.existsSync(__dirname + '/public/games/'+file+'/resized_appImage.jpeg')){
                    appInfo.photos.push('/games/'+file+'/resized_appImage.jpeg');
                } else if(fs.existsSync(__dirname + '/public/games/'+file+'/resized_appImage.webp')){
                    appInfo.photos.push('/games/'+file+'/resized_appImage.webp');
                }

                //if description.txt exists, add it to appInfo
                if(fs.existsSync(__dirname + '/public/games/'+file+'/description.txt')){
                    appInfo.description = fs.readFileSync(__dirname + '/public/games/'+file+'/description.txt', 'utf8');
                }
                //append app info to apps.apps
                if(files[i] != '.DS_Store'){
                    apps.apps.push(appInfo);
                }   
            }
            //read visits then send to index.ejs

            //add 1 to visits
            fs.readFile(__dirname + '/public/visits.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let file = JSON.parse(data);
                    file.main.visitors++
                    fs.writeFile(__dirname + '/public/visits.json', JSON.stringify(file), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            getVisits().then((visits)=>{
                                //sort apps by visits
                                apps.apps.sort((a,b)=>{
                                    let aVisits = 0;
                                    let bVisits = 0;
                                    for(let i = 0; i < visits.main.apps.length; i++){
                                        if(visits.main.apps[i].route_name == a.id.split('.')[0]){
                                            aVisits = visits.main.apps[i].visits;
                                        }
                                        if(visits.main.apps[i].route_name == b.id.split('.')[0]){
                                            bVisits = visits.main.apps[i].visits;
                                        }
                                    }
                                    return bVisits - aVisits;
                                });
                                res.render('index.ejs',{'appList':apps,visits:visits.main.visitors});
                            });
                        }
                    });
                }
            });
        }
    });

});


app.get('/app/:app', (req, res) => {
    let app = req.params.app;
    //check if app exists
    getVisits().then((visits)=>{
        res.render('appPage.ejs',{'app':app,visits:visits.main.visitors});
    });
});



app.get('/visits',(req,res)=>{
    res.sendFile(__dirname + '/public/visits.json');
});

app.get('/requestapp',(req,res)=>{
    getVisits().then((visits)=>{
        res.render('requestapp.ejs',{visits:visits.main.visitors});
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
//every hour read visits.json and write to visits.csv
setInterval(()=>{
    fs.readFile(__dirname + '/public/visits.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('reading visits.json');
            let file = JSON.parse(data);
            let csv = file.main.visitors + ',' + new Date().toLocaleString() + '\n';
            fs.appendFile(__dirname + '/public/visits.csv',csv,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
    });
},3600000);


//every 24 hours delete contents of visits.csv and write header
setInterval(()=>{
    console.log('deleting visits.csv contents');
    fs.writeFile(__dirname + '/public/visits.csv','visitors,date,time\n',(err)=>{
        if(err){
            console.log(err);
        }
    });
},86400000);






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
                
                fs.readFile(__dirname + '/public/visits.json', (err, data) => {
                    if (err) {
                        console.loyg(err);
                    } else {
                        let apps = JSON.parse(data);
                        res.render('admin.ejs',{'authorized':true,'apps':apps.main.apps,'suggestions':file.requests});
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
        //open /public/visits.json and delete main.apps entry
        //find item by roue_name and remove it
        fs.readFile(__dirname + '/public/visits.json', (err, data) => {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                let file = JSON.parse(data);
                for(let i = 0; i < file.main.apps.length; i++){
                    if(file.main.apps[i].route_name == req.params.id){
                        file.main.apps[i].visits = 0;
                        break;
                    }
                }
                fs.writeFile(__dirname + '/public/visits.json', JSON.stringify(file), (err) => {
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
