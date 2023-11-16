class Card {
  constructor(data) {
    this.data = data;
  }

  getHtml() {
    return `
        <div class="memory-card" data-framework="${this.data.framework}">
          <img class="front-face" src="${this.data.frontFace}" alt="${this.data.framework}">
          <img class="back-face" src="${this.data.backFace}" alt="Memory Card">
        </div>
      `;
  }
}

export default Card; // Export the Card class
