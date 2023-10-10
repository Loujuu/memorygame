/*create list of all elements and store it inside const named card */
/*This returns a list of all <div> elements within the document with a class of memory-card*/
const cards = document.querySelectorAll(".memory-card");

/*Has to know if player clicks first or second card */
let hasFlippedCard = false;
let firstCard, secondCard;

function flipCard() {
  //   console.log("I was clicked!");
  //   console.log(this);
  /*toggle means if class is there add it, if not remove*/
  this.classList.add("flip");

  if (!hasFlippedCard) {
    //first click
    hasFlippedCard = true;
    firstCard = this;
    //console.log({hasFlippedCard, firstCard});
  } else {
    //second click
    hasFlippedCard = false;
    secondCard = this;
    //console.log({ firstCard, secondCard});

    //do cards match?
    //console.log(firstCard.dataset.framework);
    //console.log(secondCard.dataset.framework);
    /*now we can identify cards. Check if framework from first and second card are the same. If they are remove eventlistener to prevent from click again */
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      //its a match!!
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
    }
    //console.log("Function was executed");
    else {
      // not a match
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
      }, 1500);
    }
  }
}

/*loop throught the list. Add eventlistner to each card to listen for click event, whenever event is fired, will execute a flipcard function */
cards.forEach((card) => card.addEventListener("click", flipCard));
