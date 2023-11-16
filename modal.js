class Modal {
  constructor() {
    this.modalElement = document.getElementById("modal");
    this.timeSpentElement = document.getElementById("timeSpent");
    this.newGameBtn = document.getElementById("newGameBtn");
  }

  show(timeSpent) {
    this.timeSpentElement.textContent = `${timeSpent}`;
    this.modalElement.style.display = "block";
  }

  hide() {
    this.modalElement.style.display = "none";
  }

  onNewGame(callback) {
    this.newGameBtn.onclick = callback;
  }
}

export default Modal; // Export the Modal class
