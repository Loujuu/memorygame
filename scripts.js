/*create list of all elements and store it inside const named card */
/*This returns a list of all <div> elements within the document with a class of memory-card*/
const cards = document.querySelectorAll(".memory-card");

function flipCard() {
  //   console.log("I was clicked!");
  //   console.log(this);
  this.classList.toggle("flip");
  /*toggle means if class is there add it, if not remove*/
}

/*loop throught the list. Add eventlistner to each card to listen for click event, whenever event is fired, will execute a flipcard function */
cards.forEach((card) => card.addEventListener("click", flipCard));
