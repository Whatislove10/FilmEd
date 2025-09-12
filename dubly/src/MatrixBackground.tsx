import { useEffect } from "react";

export default function useMatrixBackground(active: boolean) {
  useEffect(() => {
    const body = document.body;

    if (!active) {
      // Убираем эффект, возвращаем обычный фон
      body.style.backgroundImage = "linear-gradient(120deg, #1a1c23, #111315)";
      body.style.backgroundColor = "#111315";
      body.style.animation = "";
      return;
    }

    // Настройки матрицы
    const canvas = document.createElement("canvas");
    canvas.id = "matrixCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%";
    const matrix = str.split("");
    const font = 14;
    const col = Math.floor(W / font);
    const arr: number[] = Array(col).fill(1);

    let interval: number;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0f0";
      ctx.font = font + "px monospace";

      for (let i = 0; i < arr.length; i++) {
        const txt = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(txt, i * font, arr[i] * font);
        if (arr[i] * font > H && Math.random() > 0.975) arr[i] = 0;
        arr[i]++;
      }
    }

    interval = window.setInterval(draw, 70);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    };
  }, [active]);
}