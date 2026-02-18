import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getSize = () => ({
      w: Math.max(canvas.clientWidth || window.innerWidth, 1),
      h: Math.max(canvas.clientHeight || window.innerHeight, 1),
    });

    const resizeCanvas = () => {
      const { w, h } = getSize();
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    // Bubble properties
    const bubbles: {
      x: number
      y: number
      radius: number
      opacity: number
      speed: number
      wobble: number
      wobbleSpeed: number
      wobbleDirection: number
      color: string
    }[] = []

    // Create initial bubbles
    const createBubbles = () => {
      const density = Math.floor((canvas.width * canvas.height) / 50000) // Increased density
      const colors = [
        "rgba(173, 216, 230, 0.7)", // Light blue
        "rgba(135, 206, 235, 0.7)", // Sky blue
        "rgba(0, 191, 255, 0.7)", // Deep sky blue
        "rgba(127, 255, 212, 0.7)", // Aquamarine
        "rgba(64, 224, 208, 0.7)", // Turquoise
      ]

      for (let i = 0; i < density; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100, // Start below the screen
          radius: Math.random() * 25 + 10, // Larger bubbles
          opacity: Math.random() * 0.6 + 0.2, // More visible
          speed: Math.random() * 2 + 0.5,
          wobble: 0,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          wobbleDirection: Math.random() > 0.5 ? 1 : -1,
          color: colors[Math.floor(Math.random() * colors.length)]!,
        })
      }
    }

    const init = () => {
      resizeCanvas();
      if (canvas.width > 0 && canvas.height > 0 && bubbles.length === 0) {
        createBubbles();
      }
    };

    init();
    requestAnimationFrame(init);

    window.addEventListener('resize', resizeCanvas);

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resizeCanvas);
    });
    ro.observe(canvas);

    // Animation loop
    let animationFrameId: number
    const render = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i]
        if (!bubble) continue

        // Update wobble
        bubble.wobble += bubble.wobbleSpeed
        const wobbleOffset = Math.sin(bubble.wobble) * 2 * bubble.wobbleDirection

        // Draw bubble with gradient
        const gradient = ctx.createRadialGradient(
          bubble.x + wobbleOffset - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x + wobbleOffset,
          bubble.y,
          bubble.radius,
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.2, bubble.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)")

        // Draw bubble
        ctx.beginPath()
        ctx.arc(bubble.x + wobbleOffset, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Add highlight to bubble
        ctx.beginPath()
        ctx.arc(
          bubble.x + wobbleOffset - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.2,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity + 0.3})`
        ctx.fill()

        // Move the bubble
        bubble.y -= bubble.speed

        // Reset bubble when it goes off screen
        if (bubble.y < -bubble.radius * 2) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Cleanup
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [])

  const bubbleEl = (
    <div className="bubble-background">
      <canvas ref={canvasRef} className="bubble-background__canvas" aria-hidden />
    </div>
  );

  return createPortal(bubbleEl, document.body);
}
