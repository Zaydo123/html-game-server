let slides = document.getElementsByClassName("slides");
let dots = document.getElementsByClassName("dot");

let currentIndex = 0;

setBubble(0);
setImage(0);

function setBubble(index){
  for(let i=0;i<dots.length;i++){
    if(i!=index){
      dots[i].className = dots[i].className.replace(" active", "");
    } else{
      dots[i].className += " active";
    }
    
  }
}

function setImage(index){
  for(let i=0;i<dots.length;i++){
    if(i!=index){
      slides[i].style.display = "none";
    } else{
      slides[i].style.display = "block";
    }
    
  }
}

function incrementSlide(){
  if(currentIndex==slides.length-1){
    currentIndex = 0;
  } else{
    currentIndex++;
  }

  setBubble(currentIndex);
  setImage(currentIndex);

}

function decrementSlide(){
  if(currentIndex==0){
    currentIndex=slides.length-1;
  } else{
    currentIndex--;
  }

  setBubble(currentIndex);
  setImage(currentIndex);

}
// temporarily off -
//setInterval(incrementSlide,7000);


