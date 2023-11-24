import "../modal/modalnew.js";
import "../card/cardnew.js";

class MemoryGame extends HTMLElement {
  constructor() {
    super();
    this.backFace = "img/js-badge.svg";
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
    this.firstCard = null;
    this.secondCard = null;
    this.pairedCards = 0;
    this.modalOpen = false;
  }

  connectedCallback() {
    this.render();

    // Now that elements are rendered, you can query them
    this.gameContainer = this.querySelector("#gameContainer");
    this.cardsSelect = this.querySelector("#cards");

    // Listen for the custom event from memory-card elements
    this.gameContainer.addEventListener("card-flipped", (event) => {
      // The event detail contains the card element that was flipped
      const flippedCard = event.detail.cardElement;
      this.flipCard(flippedCard);
    });

    // Listen for the custom event from memory-modal elements
    this.gameContainer.addEventListener("modal-open", (event) => {
      // The event detail contains the card element that was flipped
      const flippedCard = event.detail.modalElement;
    });
    // Ensure elements are rendered before initializing
    // setTimeout(() => {
    //   this.init(); // Initialize component after ensuring elements are available
    // }, 0);

    this.updateCards();
  }

  init() {
    this.modal = this.querySelector("memory-modal");
    this.newGameBtn = this.querySelector("newGameBtn");
  }

  flipCard(cardElement) {
    if (this.lockBoard) return;
    if (cardElement === this.firstCard) return;

    cardElement.setAttribute("flipped", "true");

    if (!this.hasFlippedCard) {
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
    console.log("Filtered cards length:", filteredCardsData.length);
    const pairedCardsData = filteredCardsData.concat(filteredCardsData);
    const shuffledCardsData = this.shuffle(pairedCardsData);

    this.gameContainer.innerHTML = shuffledCardsData
      .map(
        (cardData) => `
        <memory-card 
          framework="${cardData.framework}" 
          frontFace="${cardData.frontFace}" 
          backFace="${this.backFace}" 
          flipped="false">
        </memory-card>
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

  checkForMatch() {
    // Ensure both cards are not null
    if (!this.firstCard || !this.secondCard) {
      console.error("One or both cards are not set.");
      return;
    }

    // Log the framework attributes of both cards
    console.log(
      "First Card Framework:",
      this.firstCard.getAttribute("framework")
    );
    console.log(
      "Second Card Framework:",
      this.secondCard.getAttribute("framework")
    );

    let isMatch =
      this.firstCard.getAttribute("framework") ===
      this.secondCard.getAttribute("framework");
    // isMatch ? this.disableCards() : this.unflipCards();
    if (isMatch) {
      console.log("Cards Match");
      this.disableCards();
    } else {
      console.log("Cards Do Not Match");
      this.unflipCards();
    }
  }

  disableCards() {
    //CHECK I changed pairedCards to 2 instead og one. Not sure if this is correct
    this.pairedCards += 1; // Increment the count of matched pairs

    console.log(
      "Paired Cards:",
      this.pairedCards,
      "of Total Pairs:",
      this.totalPairs
    );

    if (this.pairedCards === this.totalPairs) {
      console.log("we got pairs");
      setTimeout(() => {
        const modal = document.querySelector("memory-modal");
        modal.setAttribute("open", true);
        //this.modalOpen = true;
      }, 1000);
    }
    this.resetBoard();
  }

  // disableCards() {
  //   this.firstCard.removeEventListener("click", this.flipCard);
  //   this.secondCard.removeEventListener("click", this.flipCard);
  //   this.pairedCards += 1; // Increment the count of matched pairs

  //   if (this.pairedCards === this.totalPairs) {
  //     setTimeout(() => {
  //       this.showModal();
  //     }, 1000);
  //   }
  //   this.resetBoard();
  // }

  // showModal() {
  //   // clearInterval(this.timer); // Stop the timer

  //   // const usedTime = Date.now() - this.startTime;
  //   // const seconds = Math.floor(usedTime / 1000);
  //   // this.updateBestTime(seconds);

  //   // const timeSpentElement = document.getElementById("timeSpent");
  //   // timeSpentElement.textContent = `${seconds}`;

  //   const modal = document.createElement("memory-modal");
  //   gameContainer.appendChild(modal);

  //   // const modal = this.shadowRoot.querySelector("memory-modal");
  //   // if (!modal) {
  //   //   console.error("Modal element not found");
  //   //   return; // Exit the function if modal is not found
  //   // }

  //   modal.style.display = "block";

  //   // Reset the timer variable
  //   //this.timer = null;

  //   // Ensure the event listener for the new game button is attached
  //   // (This is assuming the button is always present in the modal and doesn't get dynamically added/removed)
  //   const newGameBtn = this.shadowRoot.querySelector("newGameBtn");
  //   newGameBtn.onclick = () => this.resetGame();
  // }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.setAttribute("flipped", "false");
      this.secondCard.setAttribute("flipped", "false");
      this.resetBoard();
    }, 1500);
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  updateCards() {
    const numberOfCards = parseInt(this.cardsSelect.value);
    const filteredCardsData = this.cardsData.slice(0, numberOfCards / 2); // Divide by 2 because each card appears twice

    this.generateCards(filteredCardsData);
  }

  render() {
    // Use the shadow DOM to encapsulate the styles and structure
    this.innerHTML = `
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
        </div>
      <section class="memory-game" id="gameContainer"></section>  
      <memory-modal open=${this.modalOpen}></memory-modal>
     
 
`;
  }
}

customElements.define("memory-game", MemoryGame);
