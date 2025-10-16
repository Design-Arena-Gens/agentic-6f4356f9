import React, { useRef, useEffect, useState } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const mousePosition = useRef({ x: 400, y: 300 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    const player = {
      x: 400,
      y: 300,
      radius: 10,
      color: 'white',
    };

    let foods = [];
    for (let i = 0; i < 50; i++) {
      foods.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 5,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }

    const update = () => {
      // Move player towards mouse
      const dx = mousePosition.current.x - player.x;
      const dy = mousePosition.current.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1) {
        player.x += dx * 0.05;
        player.y += dy * 0.05;
      }

      // Collision detection
      foods.forEach((food, index) => {
        const dist = Math.hypot(player.x - food.x, player.y - food.y);
        if (dist - food.radius - player.radius < 1) {
          foods.splice(index, 1);
          setScore(prevScore => prevScore + 1);
          player.radius += 0.1;
          foods.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          });
        }
      });
    };

    const draw = (time) => {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Background gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${time / 100}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${(time / 100) + 180}, 100%, 50%)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);


      // Draw food
      foods.forEach(food => {
        context.beginPath();
        context.arc(food.x, food.y, food.radius, 0, Math.PI * 2, false);
        context.fillStyle = food.color;
        context.fill();
      });

      // Draw player
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
      context.fillStyle = player.color;
      context.fill();
    };

    const gameLoop = (time) => {
      update();
      draw(time);
      animationFrameId = window.requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative">
        <div className="absolute top-2 left-2 text-white font-bold text-2xl">Score: {score}</div>
        <canvas ref={canvasRef} width={window.innerWidth * 0.9} height={window.innerHeight * 0.9} className="rounded-lg" />
    </div>
  );
};

export default GameCanvas;