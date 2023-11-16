import MemoryGame from "./game.js";

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
memoryGame.init();

// Event listeners for the buttons
const updateButton = document.getElementById("btn");
updateButton.addEventListener("click", () => memoryGame.updateCards());

const newGameBtn = document.getElementById("newGameBtn");
newGameBtn.addEventListener("click", () => memoryGame.resetGame());
