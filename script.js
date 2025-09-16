// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');

    // --- Game State Variables ---
    let gameActive = true;
    let currentPlayer = "X";
    // The gameState array represents the 3x3 board. Empty strings mean an empty cell.
    let gameState = ["", "", "", "", "", "", "", "", ""];

    // --- Functions ---

    // This function updates the UI and our gameState array
    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    }

    // This function handles the player switch
    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        gameStatus.innerHTML = `Player ${currentPlayer}'s turn`;
    }

    // This is the main function that runs when a cell is clicked
    const handleCellClick = (event) => {
        // Get the actual cell that was clicked from the event
        const clickedCell = event.target;
        // Get the 'data-index' attribute of the clicked cell (0-8)
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // Check if the cell has already been played or if the game is over
        // If either is true, we do nothing.
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        // If the move is valid, we proceed
        handleCellPlayed(clickedCell, clickedCellIndex);
        handlePlayerChange();
    }
    
    // Simple restart function to reset the game
    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameStatus.innerHTML = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.innerHTML = "");
    }

    // --- Event Listeners ---
    
    // Add a click event listener to each cell on the board
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    // Add a click event listener to the restart button
    restartButton.addEventListener('click', handleRestartGame);
});
