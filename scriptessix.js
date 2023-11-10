class MemoryGame {
  constructor(gameContainer, backFace, cardsData, cardsSelect) {
    this.gameContainer = gameContainer;
    this.backFace = backFace;
    this.cardsData = cardsData;
    this.cardsSelect = cardsSelect;
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
    this.pairedCards = 0;

    this.init();
  }

  init() {
    //adding eventlistener to gamecontainer instead of on card
    this.gameContainer.addEventListener("click", (event) => {
      // Check if the clicked element is a memory card
      if (event.target.closest(".memory-card")) {
        this.flipCard(event.target.closest(".memory-card"));
      }
    });

    this.updateCards();
    this.hideModal();
  }

  generateCards(filteredCardsData) {
    console.log("Filtered cards length:", filteredCardsData.length);
    const pairedCardsData = filteredCardsData.concat(filteredCardsData);
    const shuffledCardsData = this.shuffle(pairedCardsData);

    this.gameContainer.innerHTML = shuffledCardsData
      .map(
        (cardData) => `
        <div class="memory-card" data-framework="${cardData.framework}">
          <img class="front-face" src="${cardData.frontFace}" alt="${cardData.framework}">
          <img class="back-face" src="${this.backFace}" alt="Memory Card">
        </div>
      `
      )
      .join("");

    this.totalPairs = filteredCardsData.length; // Set the total number of pairs
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  flipCard(card) {
    if (this.lockBoard) return;
    if (card === this.firstCard) return;

    card.classList.add("flip");

    if (!this.hasFlippedCard) {
      this.hasFlippedCard = true;
      this.firstCard = card;
    } else {
      this.secondCard = card;
      this.checkForMatch();
    }
  }

  checkForMatch() {
    let isMatch =
      this.firstCard.dataset.framework === this.secondCard.dataset.framework;
    isMatch ? this.disableCards() : this.unflipCards();
  }

  disableCards() {
    this.firstCard.removeEventListener("click", this.flipCard);
    this.secondCard.removeEventListener("click", this.flipCard);
    this.pairedCards += 1; // Increment the count of matched pairs

    if (this.pairedCards === this.totalPairs) {
      setTimeout(() => {
        this.showModal();
      }, 1000);
    }

    this.resetBoard();
  }

  showModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.classList.remove("flip");
      this.secondCard.classList.remove("flip");
      this.resetBoard();
    }, 1500);
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  updateCards() {
    console.log("Update cards called");
    const numberOfCards = parseInt(this.cardsSelect.value);
    console.log("Number of cards:", numberOfCards);
    const filteredCardsData = this.cardsData.slice(0, numberOfCards / 2); // Divide by 2 because each card appears twice
    this.generateCards(filteredCardsData);
    console.log("filtered:", filteredCardsData);

    this.pairedCards = 0; // Reset the paired cards count
  }

  resetGame() {
    this.hideModal();
    this.pairedCards = 0;
    this.updateCards(); // Regenerate cards based on current selection
  }

  hideModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
}

// Initialize the game
const gameContainer = document.querySelector(".memory-game");
const cardsSelect = document.getElementById("cards");
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

const memoryGame = new MemoryGame(
  gameContainer,
  backFace,
  cardsData,
  cardsSelect
);

// Event listener for the update button
const updateButton = document.getElementById("btn");
updateButton.addEventListener("click", () => memoryGame.updateCards());

// Event listener for the new game button
const newGameBtn = document.getElementById("newGameBtn");
newGameBtn.addEventListener("click", () => memoryGame.resetGame());
