// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Log to console to confirm the script is running
    console.log("Game script loaded!");

    // --- DOM Elements ---
    // We will get references to our HTML elements here.
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');

    // --- Game State Variables ---
    // We will define variables to track the game state here.
    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];

    // --- Game Logic Functions ---
    // We will write functions to handle clicks, check for wins, etc. here.
    
    // --- Event Listeners ---
    // We will add event listeners to the cells and restart button here.
});
