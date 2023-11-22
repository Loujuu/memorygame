class MemoryModal extends HTMLElement {
  constructor() {
    super(); // Always call super() first in the constructor.
    this.attachShadow({ mode: "open" }); // Attach a shadow root to the element.
    //this.seconds = 0;
  }

  connectedCallback() {
    // Setup the card when the element is added to the document
    this.render();
    // this.show(); // Show the modal with a default time spent of 0 seconds

    // this.hide();
  }

  show(timeSpent) {
    this.shadowRoot.querySelector(".modal").style.display = "block";
    this.shadowRoot.querySelector(
      "#timeSpent"
    ).textContent = `${timeSpent} seconds`;
  }

  // hide() {
  //   this.shadowRoot.querySelector(".modal").style.display = "none";
  // }

  onNewGame() {
    // Attach an event listener to the new game button
    const newGameBtn = this.shadowRoot.querySelector("#newGameBtn");
    newGameBtn.onclick = resetGame();
  }

  render() {
    // Use the shadow DOM to encapsulate the styles and structure
    this.shadowRoot.innerHTML = `
      <style>
      .modal {
        width: 400px;
        height: 200px;
        margin: auto; 
        background-color: white;
        border-radius: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backgrounf-color: white;
      }  
      .modal-content {
        padding-top: 10px;
        width: 100%;
        height: 100%;
        left: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 26px;
        color: #060ab2;
        text-align: center;
      }   
      .modal-title {
        margin-bottom: 20px;
      }  
      .modal-test {
        width: 400px;
        height: 400 px;
        background-color: #3cc63e;
        margin: auto;
      }
      .txt-container {
        margin-bottom: 20px;
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
      </style>
  <div class="modal">
  <div class="modal-content">
    <h5 class="modal-title">You are a winner!!!</h5>
    <div class="txt-container">
      <p>Time spent:<span id="timeSpent"></span>seconds</p>
    </div>
    <button class="btn-primary" id="newGameBtn">New game</button>
  </div>
</div>
`;
  }
}

customElements.define("memory-modal", MemoryModal);
