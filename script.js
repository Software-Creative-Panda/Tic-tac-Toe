
        class TicTacToe {
            constructor() {
                this.playerScore = 0;
                this.aiScore = 0;
                this.username = 'Player';
                this.promptForUsername();
            }

            promptForUsername() {
                const modal = document.getElementById('username-modal');
                const input = document.getElementById('username-input');
                const startBtn = document.getElementById('start-game-btn');
                const gameContainer = document.querySelector('.container');
                
                const startGame = () => {
                    const username = input.value.trim();
                    if (username) {
                        this.username = username;
                    }
                    modal.classList.add('hidden');
                    gameContainer.classList.remove('hidden');
                    this.initGame();
                };

                startBtn.addEventListener('click', startGame);
                input.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        startGame();
                    }
                });
            }

            initGame() {
                this.setupGameSettings();
                this.board = Array(this.boardSize * this.boardSize).fill(null);
                this.currentPlayer = 'X';
                this.gameActive = true;
                
                this.createBoard();
                this.setupEventListeners();
                this.updateScore();
                this.updateStatus();
            }

            setupGameSettings() {
                this.boardSize = 4;
                this.winCondition = 4;
                this.difficulty = 'hard'; // Locked to hard mode
            }

            createBoard() {
                const boardElement = document.getElementById('board');
                boardElement.innerHTML = '';

                for (let i = 0; i < this.boardSize * this.boardSize; i++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.index = i;
                    boardElement.appendChild(cell);
                }
            }

            setupEventListeners() {
                if (!this.boardListener) {
                    this.boardListener = (e) => {
                        if (!e.target.classList.contains('cell') || !this.gameActive) return;
                        const index = e.target.dataset.index;
                        if (this.board[index] || this.currentPlayer !== 'X') return;
                        this.makeMove(parseInt(index), 'X');
                    };
                    document.getElementById('board').addEventListener('click', this.boardListener);
                }
                
                document.getElementById('reset').addEventListener('click', () => this.resetGame());
            }

            makeMove(index, player) {
                if (!this.gameActive || this.board[index] !== null) return;

                this.board[index] = player;
                const cell = document.querySelector(`[data-index="${index}"]`);
                cell.textContent = player;
                cell.classList.add(player.toLowerCase());

                const winnerInfo = this.checkWinner();
                if (winnerInfo) {
                    this.endGame(winnerInfo);
                    return;
                }
                if (!this.board.includes(null)) {
                    this.endGame({ winner: 'draw' });
                    return;
                }

                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateStatus();

                if (this.currentPlayer === 'O') {
                    document.getElementById('board').style.pointerEvents = 'none';
                    this.aiMove();
                }
            }
            
            aiMove() {
                // Since it's always hard mode, we directly call the strategic move
                const move = this.getStrategicMove();

                setTimeout(() => {
                    this.makeMove(move, 'O');
                    document.getElementById('board').style.pointerEvents = 'auto';
                }, 600);
            }

            getStrategicMove() {
                // 1. Check for a winning move for AI
                let winningMove = this.findWinningMove('O');
                if (winningMove !== null) return winningMove;
                
                // 2. Block player's winning move
                let blockingMove = this.findWinningMove('X');
                if (blockingMove !== null) return blockingMove;

                // 3. Simple heuristic: pick a move near existing 'O's or 'X's
                const availableMoves = this.getAvailableMoves();
                const centerMoves = this.getCenterBiasedMoves(availableMoves);
                if (centerMoves.length > 0) return centerMoves[Math.floor(Math.random() * centerMoves.length)];

                // 4. Fallback to random move
                return this.getRandomMove();
            }

            findWinningMove(player) {
                const availableMoves = this.getAvailableMoves();
                for (const move of availableMoves) {
                    const tempBoard = [...this.board];
                    tempBoard[move] = player;
                    if (this.checkWinner(tempBoard)) {
                        return move;
                    }
                }
                return null;
            }

            getCenterBiasedMoves(moves) {
                const scoredMoves = moves.map(move => {
                    let score = 0;
                    const { row, col } = this.getCoords(move);
                    for (let r = -1; r <= 1; r++) {
                        for (let c = -1; c <= 1; c++) {
                            if (r === 0 && c === 0) continue;
                            const neighbor = this.board[this.getIndex(row + r, col + c)];
                            if (neighbor) score++;
                        }
                    }
                    return { move, score };
                });
                scoredMoves.sort((a, b) => b.score - a.score);
                const bestScore = scoredMoves[0].score;
                return scoredMoves.filter(m => m.score === bestScore).map(m => m.move);
            }

            getRandomMove() {
                const available = this.getAvailableMoves();
                return available[Math.floor(Math.random() * available.length)];
            }
            
            getAvailableMoves() {
                return this.board.reduce((acc, val, idx) => (val === null ? [...acc, idx] : acc), []);
            }
            
            getCoords(index) {
                return { row: Math.floor(index / this.boardSize), col: index % this.boardSize };
            }

            getIndex(row, col) {
                if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return -1;
                return row * this.boardSize + col;
            }

            checkWinner(boardState = this.board) {
                for (let i = 0; i < boardState.length; i++) {
                    if (boardState[i] === null) continue;

                    const player = boardState[i];
                    const { row, col } = this.getCoords(i);
                    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

                    for (const [dr, dc] of directions) {
                        const combination = [i];
                        let count = 1;
                        for (let j = 1; j < this.winCondition; j++) {
                            const newRow = row + dr * j;
                            const newCol = col + dc * j;
                            const index = this.getIndex(newRow, newCol);
                            if (index !== -1 && boardState[index] === player) {
                                combination.push(index);
                                count++;
                            } else {
                                break;
                            }
                        }
                        if (count === this.winCondition) {
                            return { winner: player, combination };
                        }
                    }
                }
                return null;
            }

            highlightWinningCells(combination) {
                combination.forEach(index => {
                    const cell = document.querySelector(`[data-index="${index}"]`);
                    cell.classList.add('win');
                });
            }

            endGame(result) {
                this.gameActive = false;
                const { winner, combination } = result;

                if (winner === 'X') {
                    this.playerScore++;
                    this.updateStatus(`${this.username} wins! 🎉`);
                    this.highlightWinningCells(combination);
                } else if (winner === 'O') {
                    this.aiScore++;
                    this.updateStatus('AI wins! 🤖');
                    this.highlightWinningCells(combination);
                } else {
                    this.updateStatus('It\'s a Draw!');
                }
                this.updateScore();
            }

            resetGame() {
                this.initGame();
            }

            updateStatus(text) {
                document.getElementById('status').textContent = text ||
                    `${this.currentPlayer === 'X' ? `${this.username}'s` : "AI's"} turn (${this.currentPlayer})`;
            }

            updateScore() {
                document.getElementById('player-name-display').textContent = this.username;
                document.getElementById('player-score').textContent = this.playerScore;
                document.getElementById('ai-score').textContent = this.aiScore;
            }
        }

        document.addEventListener('DOMContentLoaded', () => new TicTacToe());
