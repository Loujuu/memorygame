/*create list of all elements and store it inside const named card */
/*This returns a list of all <div> elements within the document with a class of memory-card*/
//document.querySelector(cards);

const gameContainer = document.querySelector(".memory-game");
const backFace = "img/js-badge.svg";

const cardsData = [
  {
    framework: "aurelia",
    frontFace: "img/aurelia.svg",
  },
  {
    framework: "vue",
    frontFace: "img/vue.svg",
  },
  {
    framework: "angular",
    frontFace: "img/angular.svg",
  },
  {
    framework: "backbone",
    frontFace: "img/backbone.svg",
  },
  {
    framework: "ember",
    frontFace: "img/ember.svg",
  },
  {
    framework: "react",
    frontFace: "img/react.svg",
  },
];

// Get references to the selection and button elements
const cardsSelect = document.getElementById("cards");
const filterFour = document.getElementById("filterFour");
const filterEight = document.getElementById("filterEight");
const updateButton = document.getElementById("btn");

// Add an event listener to the update button
updateButton.addEventListener("click", updateCards);

// Initial call to display the cards
updateCards();

hideModal();

function hideModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Function to generate the card HTML and add it to the DOM
function generateCards(cardsData) {
  // Create pairs of each card
  const pairedCardsData = cardsData.concat(cardsData);

  // Shuffle the paired cards
  const shuffledCardsData = shuffle(pairedCardsData);

  shuffledCardsData.forEach((cardData) => {
    const cardHTML = `
      <div class="memory-card" data-framework="${cardData.framework}">
        <img class="front-face" src="${cardData.frontFace}" alt="${cardData.framework}">
        <img class="back-face" src="${backFace}" alt="Memory Card">
      </div>
    `;
    gameContainer.innerHTML += cardHTML;
  });
  shuffleCards();
}

// Function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
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
  console.log(this);
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

  if (firstCard && secondCard) {
    // Get the number of cards from the select element
    const numberOfCards = parseInt(cardsSelect.value);

    // Filter the cards data to get the desired number of card pairs
    const filteredCardsData = cardsData.slice(0, numberOfCards);

    checkForMatch(filteredCardsData); // Pass the filteredCardsData as an argument
  }
}

let pairedCards = 0;

function checkForMatch(filteredCardsData) {
  //do cards match?
  /*now we can identify cards. Check if framework from first and second card are the same. If they are remove eventlistener to prevent from click again */
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    pairedCards += 2; // Increment the paired cards counter
    if (pairedCards === filteredCardsData.length) {
      showModal();
    }
    console.log("length", filteredCardsData.length);
  } else {
    unflipCards();
  }

  function disableCards() {
    //its a match!!
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
  }

  function showModal() {
    const modal = document.getElementById("modal");
    const newGameBtn = document.getElementById("newGameBtn");

    modal.style.display = "block";

    newGameBtn.onclick = function () {
      hideModal();
      resetGame();
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        hideModal();
        resetGame();
      }
    };
  }

  function resetGame() {
    // Clear the game container
    gameContainer.innerHTML = "";

    // Generate and display the initial set of cards
    generateCards(cardsData);
    addEventListeners();

    // Reset the paired cards counter
    pairedCards = 0;
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

// Function to handle updating the number of cards displayed
function updateCards() {
  const numberOfCards = parseInt(cardsSelect.value);

  // Log the value of numberOfCards
  console.log("Number of Cards: ", numberOfCards);

  // Filter the cards data to get the desired number of card pairs
  const filteredCardsData = cardsData.slice(0, numberOfCards);

  // Clear the game container
  gameContainer.innerHTML = "";

  // Generate and display the cards
  generateCards(filteredCardsData);

  // addEventListeners();

  //Update the checkForMatch function to use the filtered cards data
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      flipCard.call(this);
      //   checkForMatch(filteredCardsData);
    });
  });

  // Reset the paired cards counter
  //pairedCards = 0;
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Shuffle cards
function shuffleCards() {
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}
