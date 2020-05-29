import React, { useState } from 'react';
import './App.css';
import Board from './board/board';

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const onScorePoint = () => {
    setScore((prev) => {
      setHighScore((prevHs) => Math.max(prevHs, prev + 1));
      return prev + 1;
    });
  };

  const onGameOver = () => {
    setScore(0);
  };

  return (
    <div className="App">
      <div className="boardContainer">
        <h4>
          <strong>Current Score: </strong>
          {score}
        </h4>
        <h4>
          <strong>High Score: </strong>
          {highScore}
        </h4>
        <Board
          height={20}
          width={20}
          difficulty={3}
          pointScored={onScorePoint}
          gameOver={onGameOver}
        />
      </div>
    </div>
  );
}

export default App;
