import Card from "./card.js";
import Modal from "./modal.js";

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
    this.timer = null;
    this.startTime = null;
    this.bestTime = localStorage.getItem("bestTime") || null;
    this.displayBestTime();
    this.modal = new Modal();
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
    // Use the Card class to create card elements
    const cardElements = filteredCardsData
      .map((data) => new Card(data).getHtml())
      .join("");
    this.gameContainer.innerHTML = cardElements;

    const pairedCardsData = filteredCardsData.concat(filteredCardsData);
    const shuffledCardsData = this.shuffle(pairedCardsData);

    this.gameContainer.innerHTML = shuffledCardsData
      .map((cardData) =>
        new Card({ ...cardData, backFace: this.backFace }).getHtml()
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
      // Start timer on first flip
      this.startTimer();
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
    // Adjusted to use the Modal class
    const usedTime = Date.now() - this.startTime;
    const seconds = Math.floor(usedTime / 1000);
    this.updateBestTime(seconds);
    this.modal.show(seconds);
    clearInterval(this.timer);
    this.timer = null;

    // Ensure the event listener for the new game button is attached
    // (This is assuming the button is always present in the modal and doesn't get dynamically added/removed)
    const newGameBtn = document.getElementById("newGameBtn");
    newGameBtn.onclick = () => this.resetGame();
  }

  hideModal() {
    this.modal.hide();
  }

  updateBestTime(currentTime) {
    if (this.bestTime === null || currentTime < this.bestTime) {
      this.bestTime = currentTime;
      localStorage.setItem("bestTime", currentTime);
      this.displayBestTime();
    }
  }

  displayBestTime() {
    const bestTimeElement = document.getElementById("bestTime");
    if (bestTimeElement) {
      bestTimeElement.textContent = `Best Time: ${
        this.bestTime || "N/A"
      } seconds`;
    }
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.classList.remove("flip");
      this.secondCard.classList.remove("flip");
      this.resetBoard();
    }, 1500);
  }

  startTimer() {
    if (this.timer === null) {
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        const usedTime = Date.now() - this.startTime;
        const seconds = Math.floor(usedTime / 1000);
        document.getElementById("timer").innerText = `Time: ${seconds} seconds`;
      }, 1000);
    }
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  updateCards() {
    // Reset the game state if a game is in progress
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.pairedCards = 0;
      this.hasFlippedCard = false;
      this.lockBoard = false;
      this.firstCard = null;
      this.secondCard = null;
    }

    const numberOfCards = parseInt(this.cardsSelect.value);
    const filteredCardsData = this.cardsData.slice(0, numberOfCards / 2); // Divide by 2 because each card appears twice
    this.generateCards(filteredCardsData);

    // Update the timer display to 0
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = "Time: 0 seconds";
    }

    this.pairedCards = 0; // Reset the paired cards count
  }

  resetGame() {
    clearInterval(this.timer); // Clear the timer
    this.timer = null;
    this.hideModal();
    this.pairedCards = 0;
    this.updateCards(); // Regenerate cards based on current selection
  }
}

export default MemoryGame;
