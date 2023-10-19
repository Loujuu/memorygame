/*create list of all elements and store it inside const named card */
/*This returns a list of all <div> elements within the document with a class of memory-card*/
//document.querySelector(cards);

const gameContainer = document.querySelector(".memory-game");

const cardsData = [
  {
    framework: "aurelia",
    frontFace: "img/aurelia.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "aurelia",
    frontFace: "img/aurelia.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "vue",
    frontFace: "img/vue.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "vue",
    frontFace: "img/vue.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "angular",
    frontFace: "img/angular.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "angular",
    frontFace: "img/angular.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "backbone",
    frontFace: "img/backbone.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "backbone",
    frontFace: "img/backbone.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "ember",
    frontFace: "img/ember.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "ember",
    frontFace: "img/ember.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "react",
    frontFace: "img/react.svg",
    backFace: "img/js-badge.svg",
  },
  {
    framework: "react",
    frontFace: "img/react.svg",
    backFace: "img/js-badge.svg",
  },
];

// Get references to the selection and button elements
const cardsSelect = document.getElementById("cards");
const updateButton = document.getElementById("btn");

// Function to handle updating the number of cards displayed
function updateCards() {
  const numberOfCards = parseInt(cardsSelect.value);

  // Filter the cards data to get the desired number of card pairs
  const filteredCardsData = cardsData.slice(0, numberOfCards);

  // Clear the game container
  gameContainer.innerHTML = "";

  // Generate and display the cards
  generateCards(filteredCardsData);
  addEventListeners();
  shuffleCards(numberOfCards);
}

// Add an event listener to the update button
updateButton.addEventListener("click", updateCards);

// Initial call to display the cards
updateCards();

// Function to generate the card HTML and add it to the DOM
function generateCards(cardsData) {
  cardsData.forEach((cardData) => {
    const cardHTML = `
      <div class="memory-card" data-framework="${cardData.framework}">
        <img class="front-face" src="${cardData.frontFace}" alt="${cardData.framework}">
        <img class="back-face" src="${cardData.backFace}" alt="Memory Card">
      </div>
    `;
    gameContainer.innerHTML += cardHTML;
  });
}

// Function to add event listeners to the cards
function addEventListeners() {
  const cardsData = document.querySelectorAll(".memory-card");
  cardsData.forEach((cardData) => cardData.addEventListener("click", flipCard));
}

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

// Call the functions
generateCards();
addEventListeners();

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

// Shuffle cards
function shuffleCards(numberOfCards) {
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * numberOfCards);
    card.style.order = randomPos;
  });
}

shuffleCards();
