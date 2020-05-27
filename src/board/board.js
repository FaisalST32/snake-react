import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from './box/box';
import './board.css';

const generateBoardCoord = (height, width) => {
  const boardCoords = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push({ xCoord: i, yCoord: j });
    }
    boardCoords.push(row);
  }
  return boardCoords;
};

const directions = {
  right: 'right',
  left: 'left',
  up: 'up',
  down: 'down',
};

const Board = (props) => {
  const [boardCoords, setBoardCoords] = useState([]);

  const [snakeCoords, setSnakeCoords] = useState([
    {
      xCoord: Math.floor(props.height / 2),
      yCoord: Math.max(0, Math.floor(props.width / 2 - 3)),
    },
    {
      xCoord: Math.floor(props.height / 2),
      yCoord: Math.max(1, Math.floor(props.width / 2 - 2)),
    },
    {
      xCoord: Math.floor(props.height / 2),
      yCoord: Math.max(2, Math.floor(props.width / 2 - 1)),
    },
  ]);

  const direction = useRef(directions.right);
  const baitPosition = useRef({
    xCoord: Math.floor(props.height / 2 + 1),
    yCoord: Math.floor(props.width / 2) + 2,
  });

  const interval = useRef(null);

  const startTimer = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(moveSnake, 500 / props.difficulty);
  };

  const getNextCoords = useCallback(
    (lastCoords) => {
      if (direction.current === directions.right) {
        if (lastCoords.yCoord === props.width - 1) {
          lastCoords.yCoord = 0;
        } else {
          lastCoords.yCoord += 1;
        }
      } else if (direction.current === directions.left) {
        if (lastCoords.yCoord === 0) {
          lastCoords.yCoord = props.width - 1;
        } else {
          lastCoords.yCoord -= 1;
        }
      } else if (direction.current === directions.up) {
        if (lastCoords.xCoord === 0) {
          lastCoords.xCoord = props.height - 1;
        } else {
          lastCoords.xCoord -= 1;
        }
      } else if (direction.current === directions.down) {
        if (lastCoords.xCoord === props.height - 1) {
          lastCoords.xCoord = 0;
        } else {
          lastCoords.xCoord += 1;
        }
      }
      return lastCoords;
    },
    [props.height, props.width]
  );

  const consumeBait = () => {
    let randomXcoord, randomYcoord;
    do {
      randomXcoord = Math.floor(Math.random() * props.height);
      randomYcoord = Math.floor(Math.random() * props.width);
    } while (
      snakeCoords.some(
        (coord) =>
          coord.xCoord === randomXcoord && coord.yCoord === randomYcoord
      ) ||
      (randomYcoord === baitPosition.current.sxc &&
        randomXcoord === baitPosition.current.xCoord)
    );
    baitPosition.current = { xCoord: randomXcoord, yCoord: randomYcoord };
    return { xCoord: randomXcoord, yCoord: randomYcoord };
  };

  const moveSnake = (forceMove) => {
    if (forceMove) {
      startTimer();
    }
    setSnakeCoords((prevCoords) => {
      console.log('test');
      const newCoords = [...prevCoords];
      const lastCoords = { ...newCoords[prevCoords.length - 1] };
      const nextCoords = getNextCoords(lastCoords);
      const isGameOver = checkGameOver(nextCoords, prevCoords);
      if (isGameOver) {
        clearInterval(interval.current);
        alert('Game Over');
        return prevCoords;
      }

      if (
        nextCoords.xCoord === baitPosition.current.xCoord &&
        nextCoords.yCoord === baitPosition.current.yCoord
      ) {
        consumeBait();
      } else {
        newCoords.shift();
      }
      newCoords.push(nextCoords);
      return newCoords;
    });
  };

  const checkGameOver = (nextCoords, currentSnakeCoords) => {
    console.log(nextCoords, snakeCoords);
    return currentSnakeCoords.some(
      (coords) =>
        coords.xCoord === nextCoords.xCoord &&
        coords.yCoord === nextCoords.yCoord
    );
  };

  const checkSnake = (xCoord, yCoord) => {
    return snakeCoords.some(
      (snakeBox) => snakeBox.xCoord === xCoord && snakeBox.yCoord === yCoord
    );
  };

  const checkBait = (xCoord, yCoord) => {
    return (
      baitPosition.current.xCoord === xCoord &&
      baitPosition.current.yCoord === yCoord
    );
  };

  const checkHead = (xCoord, yCoord) => {
    return (
      xCoord === snakeCoords[snakeCoords.length - 1].xCoord &&
      yCoord === snakeCoords[snakeCoords.length - 1].yCoord
    );
  };

  const setupListeners = () => {
    window.addEventListener('keydown', (e) => {
      let newDirection;
      if (e.keyCode === 38 && direction.current !== directions.down) {
        newDirection = directions.up;
      } else if (e.keyCode === 39 && direction.current !== directions.left) {
        newDirection = directions.right;
      } else if (e.keyCode === 40 && direction.current !== directions.up) {
        newDirection = directions.down;
      } else if (e.keyCode === 37 && direction.current !== directions.right) {
        newDirection = directions.left;
      }

      // else if (e.keyCode === 32) {
      //   moveSnake();
      //   return;
      // }

      if (!newDirection || newDirection === direction.current) return;
      direction.current = newDirection;
      moveSnake(true);
    });
  };

  useEffect(() => {
    setBoardCoords(generateBoardCoord(props.height, props.width));
    setupListeners();
  }, []);

  const boardJsx = boardCoords.map((row, i) => {
    return (
      <div key={'row-' + i} className="row">
        {row.map((box, j) => {
          return (
            <Box
              key={`box-${i}-${j}`}
              xCoord={box.xCoord}
              yCoord={box.yCoord}
              hasSnake={checkSnake(i, j)}
              hasBait={checkBait(i, j)}
              isHead={checkHead(i, j)}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className="board">
      <React.Fragment>
        {boardJsx}
        <button onClick={startTimer}>Start Game</button>
      </React.Fragment>
    </div>
  );
};

Board.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
};

export default Board;
