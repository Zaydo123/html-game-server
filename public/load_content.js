
function getVisits(){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'/visits',
            type:'GET',
            success:function(data){
                resolve(data);
                document.getElementById('visitorsCounter').innerHTML = "Total Visits : "+data.main.visitors;
                //sort all in data.main.apps by visits
                data.main.apps.sort((a,b)=>{
                    return a.visits - b.visits;
                });
                for(let i=0;i<data.main.apps.length;i++){
                    if(document.getElementById(data.main.apps[i].route_name)!=null){
                        console.log(document.getElementById(data.main.apps[i].route_name));
                        $('#'+data.main.apps[i]['route_name']).prependTo('#app-list');
                    }
                }  
            }
        });
    });
}



//getApps()
getVisits()
