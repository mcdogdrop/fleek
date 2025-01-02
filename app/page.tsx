"use client";

import React, { useState, useEffect, useCallback } from "react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
const TILE_SIZE = 50;

const Frogger: React.FC = () => {
  const [frogPosition, setFrogPosition] = useState({
    x: GAME_WIDTH / 2 - TILE_SIZE / 2,
    y: GAME_HEIGHT - TILE_SIZE,
  });
  const [cars, setCars] = useState([
    { x: 0, y: GAME_HEIGHT - 150, speed: 3, width: TILE_SIZE * 2 },
    { x: 200, y: GAME_HEIGHT - 200, speed: 4, width: TILE_SIZE * 3 },
    { x: 400, y: GAME_HEIGHT - 250, speed: 5, width: TILE_SIZE * 2 },
  ]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const resetFrogPosition = () => {
    setFrogPosition({ x: GAME_WIDTH / 2 - TILE_SIZE / 2, y: GAME_HEIGHT - TILE_SIZE });
  };

  const moveFrog = (direction: "up" | "down" | "left" | "right") => {
    setFrogPosition((prev) => {
      if (gameOver) return prev;

      let newX = prev.x;
      let newY = prev.y;

      if (direction === "up") newY -= TILE_SIZE;
      if (direction === "down") newY += TILE_SIZE;
      if (direction === "left") newX -= TILE_SIZE;
      if (direction === "right") newX += TILE_SIZE;

      newX = Math.max(0, Math.min(GAME_WIDTH - TILE_SIZE, newX));
      newY = Math.max(0, Math.min(GAME_HEIGHT - TILE_SIZE, newY));

      return { x: newX, y: newY };
    });
  };

  const updateCars = useCallback(() => {
    setCars((prevCars) =>
      prevCars.map((car) => ({
        ...car,
        x: (car.x + car.speed) % GAME_WIDTH,
      }))
    );
  }, []);

  const checkCollisions = useCallback(() => {
    const frogRect = {
      x: frogPosition.x,
      y: frogPosition.y,
      width: TILE_SIZE,
      height: TILE_SIZE,
    };

    cars.forEach((car) => {
      const carRect = {
        x: car.x,
        y: car.y,
        width: car.width,
        height: TILE_SIZE,
      };

      if (
        frogRect.x < carRect.x + carRect.width &&
        frogRect.x + frogRect.width > carRect.x &&
        frogRect.y < carRect.y + carRect.height &&
        frogRect.y + frogRect.height > carRect.y
      ) {
        setLives((prev) => prev - 1);
        resetFrogPosition();
        if (lives <= 1) {
          setGameOver(true);
        }
      }
    });

    // Check if frog reached the goal
    if (frogPosition.y <= 0) {
      setScore((prev) => prev + 1);
      resetFrogPosition();
    }
  }, [frogPosition, cars, lives]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      updateCars();
      checkCollisions();
    }, 100);

    return () => clearInterval(interval);
  }, [updateCars, checkCollisions, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveFrog("up");
      if (e.key === "ArrowDown") moveFrog("down");
      if (e.key === "ArrowLeft") moveFrog("left");
      if (e.key === "ArrowRight") moveFrog("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Frogger</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Controls:</strong> Arrow Keys to Move
        </p>
      </div>
      <h2>
        Score: {score} | Lives: {lives}
      </h2>
      {gameOver && <h3>Game Over! Refresh to play again.</h3>}
      <div
        style={{
          position: "relative",
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          backgroundColor: "#222",
          border: "2px solid #fff",
        }}
      >
        {/* Goal */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${TILE_SIZE}px`,
            backgroundColor: "lightgreen",
          }}
        />
        {/* Frog */}
        <div
          style={{
            position: "absolute",
            left: frogPosition.x,
            top: frogPosition.y,
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            backgroundColor: "green",
          }}
        />
        {/* Cars */}
        {cars.map((car, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: car.x,
              top: car.y,
              width: `${car.width}px`,
              height: `${TILE_SIZE}px`,
              backgroundColor: "red",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Frogger;
