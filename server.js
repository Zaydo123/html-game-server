//import express
const express = require('express');
const app = express();
let bodyParser = require('body-parser');
const fs = require('fs');


let port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
//use ejs to render
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

app.get('/app/:item',(req,res)=>{
    let item = req.params.item;
    res.sendFile(__dirname + '/public/app/'+item+'/index.html');
});


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
    res.sendFile(__dirname + '/public/visits.json');
});

app.get('/requestapp',(req,res)=>{
    res.render('requestapp.ejs');
});

//accept post request
app.post('/requestapp',(req,res)=>{
    //log data from form request
    console.log(req.body);
    //append data to requestapps.json file
    fs.readFile(__dirname + '/public/requestapps.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let file = JSON.parse(data);
            file.requests.push(req.body);
            fs.writeFile(__dirname + '/public/requestapps.json', JSON.stringify(file), (err) => {
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

app.listen(port, () => {
    console.log('Server is running on port ' + port);
} );
