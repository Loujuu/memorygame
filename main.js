// // Import the custom elements
// import "./game.js";
// import "./card.js";
// import "./modal.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const memoryGame = document.querySelector("memory-game");

//   // Set properties or attributes
//   memoryGame.backFace = "img/js-badge.svg";
//   memoryGame.cardsData = [
//     {
//       framework: "aurelia",
//       frontFace: "img/aurelia.svg",
//     },
//     {
//       framework: "vue",
//       frontFace: "img/vue.svg",
//     },
//     {
//       framework: "angular",
//       frontFace: "img/angular.svg",
//     },
//     {
//       framework: "backbone",
//       frontFace: "img/backbone.svg",
//     },
//     {
//       framework: "ember",
//       frontFace: "img/ember.svg",
//     },
//     {
//       framework: "react",
//       frontFace: "img/react.svg",
//     },
//   ];

//   // Set event listeners using the Shadow DOM
//   memoryGame.shadowRoot
//     .querySelector("#btn")
//     .addEventListener("click", () => memoryGame.updateCards());
//   memoryGame.shadowRoot
//     .querySelector("#newGameBtn")
//     .addEventListener("click", () => memoryGame.resetGame());
// });
