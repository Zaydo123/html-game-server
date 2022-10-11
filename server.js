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
//ips.json
if(fs.existsSync('./ips.json')){
}else{
    console.log("ips.json does not exist, creating...");
    fs.writeFileSync('./ips.json', '{"ips":[]}');
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
                    obj.main.apps.push({route_name:filename,visits:1});
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
                let appInfo = {'id':files[i],'name': app_name,photos:[],videos:[]};
                //append app info to apps.apps
                if(files[i] != '.DS_Store'){
                    apps.apps.push(appInfo);
                }   
            }

            res.render('index.ejs',{'appList':apps});

        }
    });

});

//gets visitor count but want to add reports count

function getVisits(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'/visits',
            type:'GET',
            success:function(data){
                resolve(data);
                document.getElementById('visitorsCounter').innerHTML = "Total Visits : "+data.main.visitors;
            }
        });
    }
    );
}

app.get('/visits',(req,res)=>{
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
                    //
                }
            });
        }
    });
    fs.readFile(__dirname + '/ips.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let file2 = JSON.parse(data);
            let ip = new Object();
            ip.ip = req.ip;
            ip.visits = 1;
            ip.geo=null;
            //see if ip is in file2.ips
            let found = false;
            for(let i = 0; i < file2.ips.length; i++){
                if(file2.ips[i].ip == ip.ip){
                    file2.ips[i].visits++;
                    found = true;
                    break;
                }
            }
            if(!found){
                file2.ips.push(ip);
            }
            fs.writeFile(__dirname + '/ips.json', JSON.stringify(file2), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    //
                }
            });
        }
    });
    res.sendFile(__dirname + '/public/visits.json');
});

app.get('/requestapp',(req,res)=>{
    res.render('requestapp.ejs');
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
                        fs.readFile(__dirname + '/ips.json', (err, ipfile) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let ipdata = JSON.parse(ipfile);
                                res.render('admin.ejs',{'authorized':true,'apps':apps.main.apps,'suggestions':file.requests,'ips':ipdata.ips});
                            }
                        });
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
