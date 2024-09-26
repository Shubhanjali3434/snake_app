import React, { useState, useEffect } from "react";
import "./App.css";

const CELL_SIZE = 20; // Size of each cell
const WIDTH = 500;    // Width of the board
const HEIGHT = 500;   // Height of the board
const INITIAL_SPEED = 200;
function App() {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(INITIAL_SPEED);// Snake speed
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false); // Paused state

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
          case " ":
          togglePause(); // Toggle pause when spacebar is pressed
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  // Move the snake based on the current direction
  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
        default:
          break;
      }

      // Check for collisions with walls or the snake itself
      if (
        head.x < 0 ||
        head.x >= WIDTH / CELL_SIZE ||
        head.y < 0 ||
        head.y >= HEIGHT / CELL_SIZE ||
        newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Add new head to the snake
      newSnake.unshift(head);

      // Check if the snake ate the food
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)),
          y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)),
        }); setScore(score + 1);  // Increment the score when food is eaten

        // Increase speed by decreasing the interval time (make snake faster)
        if (speed > 50) {  // Set a minimum speed limit
          setSpeed(speed - 10); // Decrease speed by 10ms (increase snake speed)
        }

      } else {
        newSnake.pop(); // Remove the tail if food wasn't eaten
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);

    return () => {
      clearInterval(interval);
    };
  }, [snake, direction, food, gameOver, speed]);

  const resetGame = () => {
    setSnake([{ x: 2, y: 2 }]);
    setFood({ x: 5, y: 5 });
     setSpeed(INITIAL_SPEED); 
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setPaused(false); 

  };
   // Toggle pause and resume
   const togglePause = () => {
    setPaused(!paused);
  };
  // Handle touch controls for mobile
  const handleMobileControl = (dir) => {
    if (paused) return;
    switch (dir) {
      case "UP":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "DOWN":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "LEFT":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "RIGHT":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <h1>Snake Game</h1>
       {/* Display Score */}
       <div className="scoreboard">
        <h2>Score: {score}</h2>
      </div>
      <div
        style={{
          position: "relative",
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          border: "1px solid black",
          backgroundColor: "lightgray",
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              backgroundColor: "green",
            }}
          />
        ))}

        {/* Render Food */}
        <div
          style={{
            position: "absolute",
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            backgroundColor: "red",
          }}
        />
      </div>

      {gameOver && (
        <div>
          <h2>Game Over!</h2>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
       {!gameOver && (
        <button onClick={togglePause}>
          {paused ? "Resume" : "Pause"}
        </button>
      )}
    
  

{/* Mobile Controls */}
<div className="controls">
<div className="control-row">
  <button onClick={() => handleMobileControl("UP")}>▲</button>
</div>
<div className="control-row">
  <button onClick={() => handleMobileControl("LEFT")}>◀</button>
  <button onClick={() => handleMobileControl("DOWN")}>▼</button>
  <button onClick={() => handleMobileControl("RIGHT")}>▶</button>
</div>
</div>
</div>
  );
}


export default App;
