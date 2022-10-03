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
            let graphData = [];
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
            const ctx = document.getElementById('visitorsChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: times,
                    datasets: [{
                        label: '# of Visits',
                        data: visits,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
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
