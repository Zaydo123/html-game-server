const fs = require('fs');
let savedData = {"main":{"visitors":0,"apps":[]}};


setInterval(()=>{
    fs.readFile(__dirname + '/public/visits.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try{
                json = JSON.parse(data);
                savedData = json;
                process.stdout.write("[KEEPALIVE] Heartbeat \r");
            } catch(e){
                console.log('health check [ERROR]');
                fs.writeFile(__dirname + '/public/visits.json',JSON.stringify(savedData),(err)=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    });
}
,1000);
