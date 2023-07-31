import { useState, useEffect } from "react";

const BOARD_SIZE = 10; // 10x10 grid

const SnakeGame = () => {
  const [board, setBoard] = useState(createBoard());
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]); // Initial snake position
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [food, setFood] = useState(generateFood());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (checkCollision(head, newSnake)) {
          alert(`Game over! Your score is: ${score}`);
          resetGame();
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => prevScore + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 200);

    return () => clearInterval(intervalId);
  }, [direction, food, score]);

  useEffect(() => {
    const newBoard = createBoard();
    snake.forEach((segment) => {
      if (
        segment.x >= 0 &&
        segment.x < BOARD_SIZE &&
        segment.y >= 0 &&
        segment.y < BOARD_SIZE
      ) {
        newBoard[segment.y][segment.x] = "S";
      }
    });
    if (food) {
      newBoard[food.y][food.x] = "F";
    }
    setBoard(newBoard);
  }, [snake, food]);

  const checkCollision = (head, snake) => {
    return (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setDirection({ x: 0, y: 0 });
    setFood(generateFood());
    setScore(0);
  };

  return (
    <div>
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`cell ${
                  cell === "S" ? "snake" : cell === "F" ? "food" : ""
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const createBoard = () => {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
};

const generateFood = () => {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };
};

export default SnakeGame;
