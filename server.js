//import express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

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
                obj = JSON.parse(data); //now it an object
                //if cant find app in obj.main.apps[index].route_name then add it
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
            }
        });
            
    }
    next();
});
app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');



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
    fs.readdir(__dirname + '/public/app', (err, files) => {
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
                //see if folder has appImage.jpg or appImage.png
                if(fs.existsSync(__dirname + '/public/app/'+file+'/appImage.jpg')){
                    appInfo.photos.push('/app/'+file+'/appImage.jpg');
                }else if(fs.existsSync(__dirname + '/public/app/'+file+'/appImage.png')){
                    appInfo.photos.push('/app/'+file+'/appImage.png');
                }else if(fs.existsSync(__dirname + '/public/app/'+file+'/appImage.gif')){
                    appInfo.photos.push('/app/'+file+'/appImage.gif');
                } else if(fs.existsSync(__dirname + '/public/app/'+file+'/appImage.jpeg')){
                    appInfo.photos.push('/app/'+file+'/appImage.jpeg');
                } else if(fs.existsSync(__dirname + '/public/app/'+file+'/appImage.webp')){
                    appInfo.photos.push('/app/'+file+'/appImage.webp');
                }

                //if description.txt exists, add it to appInfo
                if(fs.existsSync(__dirname + '/public/app/'+file+'/description.txt')){
                    appInfo.description = fs.readFileSync(__dirname + '/public/app/'+file+'/description.txt', 'utf8');
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

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
