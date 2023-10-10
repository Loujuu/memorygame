/*create list of all elements and store it inside const named card */
/*This returns a list of all <div> elements within the document with a class of memory-card*/
const cards = document.querySelectorAll(".memory-card");

/*Has to know if player clicks first or second card */
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  /*toggle means if class is there add it, if not remove*/
  this.classList.add("flip");

  if (!hasFlippedCard) {
    //first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  //second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  //do cards match?
  /*now we can identify cards. Check if framework from first and second card are the same. If they are remove eventlistener to prevent from click again */
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  //ternary operator: First = condition
  // second if true. Theird if false
  isMatch ? disableCards() : unflipCards();

  function disableCards() {
    //its a match!!
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
  }

  function unflipCards() {
    // not a match
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");

      resetBoard();
    }, 1500);
  }
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//generate random number from 0-11
// math.floor rounds up and returns largest integer
//function inside () + () at end = immediately invoked function - executed right after definition
(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Marth.random() * 12);
    card.style.order = randomPos;
  });
})();

/*loop throught the list. Add eventlistner to each card to listen for click event, whenever event is fired, will execute a flipcard function */
cards.forEach((card) => card.addEventListener("click", flipCard));
