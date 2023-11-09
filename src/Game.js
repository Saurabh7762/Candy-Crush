import React, { useState, useEffect } from "react";
import "./Game.css";

const NUM_ROWS = 10;
const NUM_COLS = 10;
const WINNING_SCORE = 10; 

function Game() {
  const [gameState, setGameState] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    score: 0,
    grid: [],
    moves: 20,
  });

  useEffect(() => {
    initializeGameGrid();
  }, []);

  const initializeGameGrid = () => {
    // Initialize the game grid with random candies
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      const rowArray = [];
      for (let col = 0; col < NUM_COLS; col++) {
        const candy = Math.floor(Math.random() * 3); // 3 different types of candies
        rowArray.push(candy);
      }
      grid.push(rowArray);
    }
    setGameState((prevState) => ({
      ...prevState,
      grid,
    }));
  };

  const handleClick = (row, col) => {
    const clickedCandy = gameState.grid[row][col];

    if (clickedCandy !== null) {
      const newGrid = [...gameState.grid];

      // Store the color of the initially clicked candy
      const initialColor = newGrid[row][col];
      const movesLeft = gameState.moves - 1;

      // Function to find connected candies of the same color
      const findConnectedCandies = (r, c, candyType, connected) => {
        if (
          r < 0 ||
          r >= NUM_ROWS ||
          c < 0 ||
          c >= NUM_COLS ||
          newGrid[r][c] !== candyType
        ) {
          return;
        }

        connected.push({ row: r, col: c });
        newGrid[r][c] = null; // Mark the candy as burst

        findConnectedCandies(r - 1, c, candyType, connected);
        findConnectedCandies(r + 1, c, candyType, connected);
        findConnectedCandies(r, c - 1, candyType, connected);
        findConnectedCandies(r, c + 1, candyType, connected);
      };

      // Function to reset any mistakenly burst candies
      const resetMistakenCandies = (connected) => {
        connected.forEach((candy) => {
          newGrid[candy.row][candy.col] = initialColor;
        });
      };

      // Array to store connected candies
      const connectedCandies = [];
      findConnectedCandies(row, col, initialColor, connectedCandies);

      if (connectedCandies.length >= 3) {
        // Burst connected candies and update the score
        const newScore = gameState.score + connectedCandies.length;

        setGameState((prevState) => ({
          ...prevState,
          grid: newGrid,
          score: newScore,
          moves: movesLeft,
        }));
        if (newScore >= WINNING_SCORE) {
          handleWin();
        }
      } else {
        // Reset mistakenly burst candies
        resetMistakenCandies(connectedCandies);
      }
      // Check for loss condition
      if (movesLeft <= 0) {
        handleLoss();
      }
    }
  };
  const handleLoss = () => {
    setGameState((prevState) => ({
      ...prevState,
      gamesLost: prevState.gamesLost + 1,
      gamesPlayed: prevState.gamesPlayed + 1,
    }));
  };
  const handleWin = () => {
    setGameState((prevState) => ({
      ...prevState,
      gamesWon: prevState.gamesWon + 1,
      gamesPlayed: prevState.gamesPlayed + 1,
    }));
    // Implement logic for winning the game, e.g., showing a message or starting a new game.
  };








  const getCandyColor = (candyType) => {
    const candyColors = ["orange", "blue", "green"]; // Define your colors
    return candyColors[candyType];
  };

  return (
    <div className="game">
      <div className="game-info">
        <h2>Games Played: {gameState.gamesPlayed}</h2>
        <h2>Games Won: {gameState.gamesWon}</h2>
        <h2>Games Lost: {gameState.gamesLost}</h2>
        <h2>Score: {gameState.score}</h2>
      </div>
      <div className="game-grid">
        {gameState.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((candy, colIndex) => (
              <div
                key={colIndex}
                className="candy"
                style={{ backgroundColor: getCandyColor(candy) }}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
