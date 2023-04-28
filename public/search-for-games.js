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

