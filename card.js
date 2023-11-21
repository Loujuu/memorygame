class MemoryCard extends HTMLElement {
  static get observedAttributes() {
    return ["framework", "frontFace", "backFace"];
  }

  constructor() {
    super(); // Always call super() first in the constructor.
    this.attachShadow({ mode: "open" }); // Attach a shadow root to the element.
  }

  connectedCallback() {
    // Setup the card when the element is added to the document
    this.render();

    //Add click listener to the inner memory-card div
    const cardDiv = this.shadowRoot.querySelector(".memory-card");
    cardDiv.addEventListener("click", () => {
      cardDiv.classList.toggle("flip");
      // Dispatch an event with details about the flipped card
      this.dispatchEvent(
        new CustomEvent("card-flipped", {
          bubbles: true,
          composed: true,
          detail: { cardElement: this }, // Pass the card element as detail
        })
      );
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Update the component when attributes change
    this.render();
  }

  render() {
    // Use the shadow DOM to encapsulate the styles and structure
    this.shadowRoot.innerHTML = `
      <style>
      .memory-card {
        width: calc(25% - 10px);
        height: calc(33.333% - 10px);
        margin: 5px;
        position: relative;
        transform: scale(1);
        transform-style: preserve-3d;
        transition: transform 0.5s;
        z-index: 20;
      }

      body { 
        display: flex;
        background: #060ab2;
      }
      
      .memory-card:active {
        transform: scale(0.97);
        transition: transform 0.2s;
      }
      
      .memory-card.flip {
        transform: rotateY(180deg);
      }
      
      .front-face,
      .back-face {
        width: 100%;
        width: 100px;
        height: 100%;
        padding: 20px;
        position: absolute;
        border-radius: 5px;
        background: #1c7ccc;
        backface-visibility: hidden;
      }
      
      .front-face {
        transform: rotateY(180deg);
      }
      </style>
      <div class="memory-card" data-framework="${this.getAttribute(
        "framework"
      )}">
        <img class="front-face" src="${this.getAttribute(
          "frontFace"
        )}" alt="${this.getAttribute("framework")}">
        <img class="back-face" src="${this.getAttribute(
          "backFace"
        )}" alt="Memory Card">
      </div>
    `;
  }

  getHtml() {
    return this.outerHTML;
  }
}

customElements.define("memory-card", MemoryCard);
