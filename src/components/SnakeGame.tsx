import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': if (currentDir.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': if (currentDir.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': if (currentDir.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': if (currentDir.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true); return prevSnake;
        }

        const bodyToCheck = prevSnake.slice(0, -1);
        if (bodyToCheck.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - score * 2);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black border-4 border-[#00FFFF] relative">
      <div className="flex justify-between w-full max-w-md mb-2 px-2 border-b-2 border-[#FF00FF] pb-2">
        <div className="text-[#00FFFF] font-mono text-2xl uppercase glitch-text">
          SECTORS_CLEARED: {score.toString().padStart(3, '0')}
        </div>
        <div className="text-[#FF00FF] font-mono text-xl uppercase blink">
          {isPaused ? 'STATUS: IDLE' : 'STATUS: ACTIVE'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#FF00FF] overflow-hidden"
        style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBGRkZGIiBzdHJva2Utb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50" />

        <div
          className="absolute bg-[#FF00FF] glitch-text"
          style={{
            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        />

        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${index === 0 ? 'bg-white' : 'bg-[#00FFFF]'}`}
            style={{
              width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`, top: `${(segment.y / GRID_SIZE) * 100}%`,
              border: '1px solid black'
            }}
          />
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl font-black text-[#FF00FF] mb-2 uppercase glitch-text" style={{ textShadow: '2px 2px 0 #00FFFF' }}>
              FATAL_ERR
            </h2>
            <p className="text-[#00FFFF] font-mono text-xl mb-6 uppercase">DATA_LOST: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-[#00FFFF] text-black font-bold uppercase hover:bg-[#FF00FF] hover:text-white transition-colors"
            >
              [REINITIALIZE]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-[#00FFFF] font-mono text-sm text-center uppercase border border-[#FF00FF] p-2">
        INPUT: [W,A,S,D] OR [ARROWS] | INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
