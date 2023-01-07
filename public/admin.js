function visitorsGraph(){
    //get request to /visits.csv
    const Http = new XMLHttpRequest();
    const url='/visits.csv';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if(Http.readyState==4&&Http.status==200){
            console.log('rq done');
            let data = Http.responseText;
            //pop first item from list
            //data to dictionary
            let lines = data.split('\n');

            let times = [];
            let visits = [];
            console.log(times);
            console.log(visits);
            for(let i=0;i<lines.length;i++){
                let line = lines[i].split(',');
                if(line[0]!=''){
                    if(line.indexOf('time')==-1){
                        times.push(line[2]);
                        visits.push(line[0]);
                    }
                }
            }


            console.log(visits);
            const ctx = document.getElementById('visitorsChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: times,
                    datasets: [{
                        label: '# of Visits',
                        data: visits,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    }
}

function removeSuggestion(id){
    const Http = new XMLHttpRequest();
    const url='/admin/removesuggestion/'+id;
    Http.open("POST", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if(Http.readyState==4&&Http.status==200){
            console.log('rq done');
            let data = Http.responseText;
            console.log(data);
            if(data=='success'){
                document.getElementById(id).remove();
            }
        }
    }
}

visitorsGraph();
