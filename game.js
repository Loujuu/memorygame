import "./modal.js";

class MemoryGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Attach a shadow root to the element.
    this.backFace = "img/js-badge.svg";
    // this.showModal = true;
    this.cardsData = [
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
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.seconds = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.pairedCards = 0;
    this.timer = null;
    this.startTime = null;
    this.bestTime = localStorage.getItem("bestTime") || null;
    this.displayBestTime();
  }

  connectedCallback() {
    console.log("ConnectedCallback - MemoryGame");
    this.render(); // Call render first to create the initial structure

    // Ensure elements are rendered before initializing
    setTimeout(() => {
      this.init(); // Initialize component after ensuring elements are available
    }, 0);
  }

  init() {
    // Now that elements are rendered, you can query them
    this.gameContainer = this.shadowRoot.querySelector("#gameContainer");
    this.cardsSelect = this.shadowRoot.querySelector("#cards");
    this.modal = this.shadowRoot.querySelector("memory-modal");

    // Listen for the custom event from memory-card elements
    this.gameContainer.addEventListener("card-flipped", (event) => {
      // The event detail contains the card element that was flipped
      const flippedCard = event.detail.cardElement;
      this.flipCard(flippedCard);
    });

    // Ensure gameContainer is available before adding event listeners
    if (this.gameContainer) {
      this.gameContainer.addEventListener("card-flipped", (event) => {
        if (event.target.closest(".memory-card")) {
          this.flipCard(event.target.closest(".memory-card"));
        }
      });

      this.shadowRoot.querySelector("#btn").addEventListener("click", () => {
        this.updateCards();
      });
    } else {
      console.error("Element #gameContainer not found");
    }

    //this.updateCards();
    //this.hideModal();

    // Access the modal element
    this.modal = this.shadowRoot.querySelector("memory-modal");
    console.log("Modal element:", this.modal); // Check if the modal is found

    // if (!this.modal) {
    //   console.error("Modal element not found");
    //   return; // Exit the function if modal is not found
    // }

    // Now you can safely add event listeners or interact with the modal
    //this.modal.onNewGame(() => this.resetGame());

    // this.updateCards();
    this.displayBestTime();
    // this.checkForMatch();
  }

  flipCard(cardElement) {
    if (this.lockBoard) return;
    if (cardElement === this.firstCard) return;

    cardElement.classList.add("flip");

    if (!this.hasFlippedCard) {
      // Start timer on first flip
      this.startTimer();
      this.hasFlippedCard = true;
      this.firstCard = cardElement;
      console.log("First Card Flipped: ", this.firstCard);
    } else {
      // Second card flip
      this.secondCard = cardElement;
      console.log("Second Card Flipped: ", this.secondCard);
      this.checkForMatch();
    }
  }

  generateCards(filteredCardsData) {
    const pairedCardsData = filteredCardsData.concat(filteredCardsData);
    const shuffledCardsData = this.shuffle(pairedCardsData);

    this.gameContainer.innerHTML = shuffledCardsData
      .map(
        (cardData) => `
        <memory-card 
          framework="${cardData.framework}" 
          frontFace="${cardData.frontFace}" 
          backFace="${this.backFace}">
        </memory-card>
      `
      )
      .join("");

    this.totalPairs = filteredCardsData.length;
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

  checkForMatch() {
    // Ensure both cards are not null
    if (!this.firstCard || !this.secondCard) {
      console.error("One or both cards are not set.");
      return;
    }
    let isMatch =
      this.firstCard.dataset.framework === this.secondCard.dataset.framework;
    isMatch ? this.disableCards() : this.unflipCards();
  }

  showModal() {
    const modal = this.shadowRoot.querySelector("memory-modal");
    const usedTime = this.seconds;
    this.updateBestTime(usedTime);

    // if (this.modal) {
    //   this.modal.show(usedTime); // Call the show method of MemoryModal
    //   this.modal.onNewGame(() => this.resetGame());
    // } else {
    //   console.warn("Modal element not available when showModal called");
    // }
    //const modal = this.shadowRoot.querySelector("memory-modal");
    // modal.show(seconds);
    clearInterval(this.timer);
    this.timer = null;

    //modal.onNewGame(() => this.resetGame());
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
    const modal = this.shadowRoot.querySelector("memory-modal");
    const usedTime = this.seconds;
    this.updateBestTime(usedTime);

    if (modal) {
      modal.show(usedTime); // Call the show method of MemoryModal
      modal.onNewGame(() => this.resetGame());
    } else {
      console.warn("Modal element not available when showModal called");
    }

    clearInterval(this.timer);
    this.timer = null;
  }

  // showModal() {
  //   clearInterval(this.timer); // Stop the timer

  //   const usedTime = Date.now() - this.startTime;
  //   const seconds = Math.floor(usedTime / 1000);
  //   this.updateBestTime(seconds);

  //   const timeSpentElement = this.shadowRoot.querySelector("timeSpent");
  //   timeSpentElement.textContent = `${seconds}`;

  //   const modal = this.shadowRoot.querySelector("memory-modal");
  //   modal.style.display = "block";

  //   // Reset the timer variable
  //   this.timer = null;

  //   // Ensure the event listener for the new game button is attached
  //   // (This is assuming the button is always present in the modal and doesn't get dynamically added/removed)
  //   const newGameBtn = this.shadowRoot.querySelector("newGameBtn");
  //   newGameBtn.onclick = () => this.resetGame();
  // }

  // showModal() {
  //   const usedTime = Date.now() - this.startTime;
  //   const seconds = Math.floor(usedTime / 1000);
  //   this.updateBestTime(seconds);

  //   if (this.modal) {
  //     this.modal.show(seconds); // Call the show method of MemoryModal
  //   } else {
  //     console.warn("Modal instance not found");
  //   }

  //   const modal = this.shadowRoot.querySelector("memory-modal");
  //   modal.show(seconds);
  //   clearInterval(this.timer);
  //   this.timer = null;

  //   modal.onNewGame(() => this.resetGame());
  // }

  // hideModal() {
  //   if (this.modal) {
  //     this.modal.hide();
  //   } else {
  //     console.warn("Modal element not found");
  //   }
  // }

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

  // startTimer() {
  //   if (this.timer === null) {
  //     this.startTime = Date.now();
  //     this.timer = setInterval(() => {
  //       const usedTime = Date.now() - this.startTime;
  //       const seconds = Math.floor(usedTime / 1000);
  //       document.getElementById("timer").innerText = `Time: ${seconds} seconds`;
  //     }, 1000);
  //   }
  // }

  startTimer() {
    if (this.timer === null) {
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        this.seconds = Math.floor((Date.now() - this.startTime) / 1000);
        const timerElement =
          this.shadowRoot.getElementById("timer") ||
          document.getElementById("timer");
        if (timerElement) {
          timerElement.innerText = `Time: ${this.seconds} seconds`;
        }
      }, 1000);
    }
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  updateCards() {
    // Reset the game state if a game is in progress
    //  if (this.timer) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.seconds = 0;
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
    const timerElement = this.shadowRoot
      ? this.shadowRoot.querySelector("timer")
      : document.querySelector("timer");
    if (timerElement) {
      timerElement.innerText = `Time: ${this.seconds} seconds`;
    } else {
      console.error("Timer element not found");
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

  render() {
    // Use the shadow DOM to encapsulate the styles and structure
    this.shadowRoot.innerHTML = `
      <style>

      * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      /*border-box will keeps h and w while adding border and padding, default is content-box adding to total w and h*/
    }

    .memory-card:active {
      transform: scale(0.97);
      transition: transform 0.2s;
    }
    
    .memory-card.flip {
      transform: rotateY(180deg);
    }
    
      .memory-game {
        width: 1040px;
        height: 1040px;
        margin: auto;
        display: grid;
        flex-wrap: wrap;
        perspective: 1000px;
      }

    .btn-primary {
      width: 100px;
      height: 32px;
      background-color: #060ab2;
      color: white;
      padding: 8px;
      border-radius: 12px;
      border: 0;
      outline: none;
      cursor: pointer;
    }
    .btn-primary:hover {
      background-color: #090ded;
    }
    p {
      font-size: 16px;
    }
    
    body {

      display: flex;
      background: #060ab2;
    }
    
    .main-container {
      margin: auto;
    }
    
    .header {
      width: 100%;
      background: #1c7ccc;
      display: flex;
      padding: 20px;
      border-radius: 4px;
      margin: auto;
      justify-content: center;
      align-items: center;
    }
    
    #timer {
      font-family: Arial, Helvetica, sans-serif;
      color: white;
      text-align: end;
      font-size: 14px;
      flex: auto;
    }
    
    #bestTime {
      font-family: Arial, Helvetica, sans-serif;
      color: white;
      text-align: end;
      font-size: 14px;
      flex: auto;
    }
    
    .title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      color: white;
      padding-right: 4px;
    }
    
     .memory-game {
      width: 640px;
      height: 640px;
      margin: auto;
      display: flex;
      flex-wrap: wrap;
      perspective: 1000px;
    } 
    
    select {
      width: 56px;
      background-color: #060ab2;
      color: white;
      padding: 8px;
      border-radius: 12px;
      border: 0;
      outline: none;
    }
    
    option {
      border: 0;
      outline: none;
    }
      </style>
      <div class="main-container">
      <div class="header">
        <label class="title">Select cards</label>
        <div class="selection">
          <select name="cards" id="cards">
            <option id="filterFour" value="4">4</option>
            <option id="filterEight" value="8">8</option>
            <option id="filterTwelve" value="12">12</option>
          </select>
          <button class="btn-primary" id="btn" type="button">Select</button>
        </div>
        <div id="bestTime"></div>
        <div id="timer">Time: 0 seconds</div>
      </div>
      <section class="memory-game" id="gameContainer">
      <memory-card 
  framework="vue" 
  frontFace="img/vue.svg" 
  backFace="img/js-badge.svg">
</memory-card>
<memory-modal></memory-modal>
      </section>
    
`;
  }
}

customElements.define("memory-game", MemoryGame);
