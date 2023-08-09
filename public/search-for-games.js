//set search-bar opacity to 0 then when clicked slowly increase opacity to 1
document.getElementById('search-bar').style.opacity = 0;

let opacity = 0;

function wait(){
    setTimeout(function(){
        opacity += 0.1;
        document.getElementById('search-bar').style.opacity = opacity;
        if(opacity < 1){
            wait();
        }
    }, 50);
}


document.getElementById('search-icon').addEventListener('click', function(){

    if(opacity == 0){
        //add show class to search bar
        document.getElementById('search-bar').classList.remove('hidden');
        wait();
    } else {
        opacity = 0;
        document.getElementById('search-bar').style.opacity = 0;
        document.getElementById('search-bar').classList.add('hidden');
    }


});




function searchGames(){
    let allCards = document.getElementsByClassName("game-card");
    let searchQuery = document.getElementById('search-bar');
    searchQuery = searchQuery.value.toLowerCase();
    for(let i = 0; i < allCards.length; i++){
        if(allCards[i].innerHTML.toLowerCase().includes(searchQuery)){
            allCards[i].style.display = "flex";
        } else {
            allCards[i].style.display = "none";
        }
    }
    if(searchQuery.length == 0){
        for(let i = 0; i < allCards.length; i++){
            allCards[i].style.display = "flex";
        }
    }
}

