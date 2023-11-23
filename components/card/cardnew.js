class MemoryCard extends HTMLElement {
  static get observedAttributes() {
    return ["flipped"];
  }

  constructor() {
    super(); // Always call super() first in the constructor.
    this.shadow = this.attachShadow({ mode: "open" }); // Attach a shadow root to the element.
  }

  connectedCallback() {
    // Setup the card when the element is added to the document
    this.render();

    //Add click listener to the inner memory-card div
    this.cardDiv = this.shadow.querySelector(".memory-card");
    this.cardDiv.addEventListener("click", () => {
      if (this.cardDiv.classList.contains("flip")) return;

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
    if (this.cardDiv && newValue === "true") {
      this.cardDiv.classList.add("flip");
    } else if (this.cardDiv && newValue === "false") {
      this.cardDiv.classList.remove("flip");
    }
  }

  render() {
    // Use the shadow DOM to encapsulate the styles and structure
    this.shadowRoot.innerHTML = `
      <style>    
        :host {
          width: calc(25% - 10px);
          height: calc(33.333% - 10px);
          margin: 5px;      
        }
   
        .memory-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform: scale(1);
          transform-style: preserve-3d;
          transition: transform 0.5s;
          z-index: 20;
        }
                
        .memory-card.flip {
          transform: rotateY(180deg);
        }
        
        .front-face,
        .back-face {
          width: 100%;
          height: 100%;
          padding: 20px;
          position: absolute;
          border-radius: 5px;
          background: #1c7ccc;
          backface-visibility: hidden;
          box-sizing: border-box;
        }
        
        .front-face {
          transform: rotateY(180deg);
        }
      </style>     
       
      <div class="memory-card ${
        this.getAttribute("flipped") == "false" ? "" : "flip"
      }">
        <img class="front-face" src="${this.getAttribute(
          "frontFace"
        )}" alt="${this.getAttribute("framework")}">
        <img class="back-face" src="${this.getAttribute(
          "backFace"
        )}" alt="Memory Card">
      </div>
    `;
  }
}

customElements.define("memory-card", MemoryCard);
