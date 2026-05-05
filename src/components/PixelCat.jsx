import { useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 64;

const palettes = {
  dark: {
    body: "#e6f4ff",
    point: "#83a9c9",
    eye: "#35ddf2",
    pupil: "#183448",
    shine: "#ffffff",
    nose: "#e4a7ba",
    whisker: "#fff5d8",
    inner: "#b7d3e8",
  },
  light: {
    body: "#20212b",
    point: "#070913",
    eye: "#f0b51e",
    pupil: "#273141",
    shine: "#fff2b8",
    nose: "#b46670",
    whisker: "#d4c7ad",
    inner: "#30283c",
  },
};

function px(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawEyes(ctx, pal, hx, mood) {
  if (mood === "sleepy") {
    px(ctx, pal.whisker, hx + 6, 17, 4, 1);
    px(ctx, pal.whisker, hx + 16, 17, 4, 1);
    return;
  }

  if (mood === "happy") {
    px(ctx, pal.eye, hx + 6, 16, 4, 2);
    px(ctx, pal.eye, hx + 16, 16, 4, 2);
    px(ctx, pal.shine, hx + 8, 15, 1, 1);
    px(ctx, pal.shine, hx + 18, 15, 1, 1);
    return;
  }

  const eyeOffset = mood === "thinking" ? 1 : 0;
  px(ctx, pal.eye, hx + 6 + eyeOffset, 15, 4, 4);
  px(ctx, pal.eye, hx + 16 + eyeOffset, 15, 4, 4);
  px(ctx, pal.pupil, hx + 7 + eyeOffset, 16, 2, 2);
  px(ctx, pal.pupil, hx + 17 + eyeOffset, 16, 2, 2);
  px(ctx, pal.shine, hx + 8 + eyeOffset, 15, 1, 1);
  px(ctx, pal.shine, hx + 18 + eyeOffset, 15, 1, 1);
}

function drawSittingCat(ctx, pal, mood) {
  const headTilt = mood === "thinking" ? 1 : 0;
  const hx = 19 + headTilt;

  // Tail tucked beside the body, matching the reference proportions.
  px(ctx, pal.point, 16, 38, 4, 12);
  px(ctx, pal.point, 12, 44, 4, 8);
  px(ctx, pal.point, 12, 51, 10, 3);

  // Body.
  px(ctx, pal.body, 20, 28, 24, 22);
  px(ctx, pal.body, 21, 26, 22, 6);
  px(ctx, pal.point, 20, 36, 6, 12);
  px(ctx, pal.point, 38, 36, 6, 12);
  px(ctx, pal.point, 22, 46, 7, 4);
  px(ctx, pal.point, 35, 46, 7, 4);
  px(ctx, pal.point, 22, 50, 7, 2);
  px(ctx, pal.point, 35, 50, 7, 2);

  // Head and ears.
  px(ctx, pal.body, hx, 10, 26, 20);
  px(ctx, pal.point, hx, 8, 6, 6);
  px(ctx, pal.point, hx + 1, 6, 4, 4);
  px(ctx, pal.inner, hx + 2, 9, 2, 3);
  px(ctx, pal.point, hx + 20, 8, 6, 6);
  px(ctx, pal.point, hx + 21, 6, 4, 4);
  px(ctx, pal.inner, hx + 22, 9, 2, 3);

  // Face mask.
  px(ctx, pal.point, hx + 5, 13, 16, 8);
  drawEyes(ctx, pal, hx, mood);

  // Nose and whiskers.
  px(ctx, pal.nose, hx + 11, 20, 4, 3);
  px(ctx, pal.whisker, hx + 2, 21, 8, 1);
  px(ctx, pal.whisker, hx + 2, 23, 8, 1);
  px(ctx, pal.whisker, hx + 16, 21, 8, 1);
  px(ctx, pal.whisker, hx + 16, 23, 8, 1);

  if (mood === "happy") {
    px(ctx, pal.point, hx + 12, 24, 2, 1);
    px(ctx, pal.point, hx + 14, 25, 2, 1);
  }
}

function drawLoafCat(ctx, pal) {
  px(ctx, pal.point, 14, 40, 4, 8);
  px(ctx, pal.point, 14, 47, 7, 3);

  px(ctx, pal.body, 18, 32, 28, 18);
  px(ctx, pal.body, 20, 30, 24, 8);
  px(ctx, pal.point, 18, 46, 28, 4);

  px(ctx, pal.body, 20, 12, 24, 20);
  px(ctx, pal.point, 20, 8, 6, 8);
  px(ctx, pal.inner, 22, 10, 2, 4);
  px(ctx, pal.point, 38, 8, 6, 8);
  px(ctx, pal.inner, 40, 10, 2, 4);
  px(ctx, pal.point, 24, 16, 16, 8);
  px(ctx, pal.whisker, 26, 20, 4, 1);
  px(ctx, pal.whisker, 34, 20, 4, 1);
  px(ctx, pal.nose, 30, 25, 4, 3);
  px(ctx, pal.whisker, 20, 26, 8, 1);
  px(ctx, pal.whisker, 36, 26, 8, 1);
}

function drawCat(ctx, mood, theme) {
  const pal = theme === "light" ? palettes.light : palettes.dark;
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.imageSmoothingEnabled = false;

  if (mood === "sleepy") {
    drawLoafCat(ctx, pal);
  } else {
    drawSittingCat(ctx, pal, mood);
  }
}

function useThemeName() {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setTheme(root.dataset.theme || "dark");
    const observer = new MutationObserver(updateTheme);

    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    updateTheme();

    return () => observer.disconnect();
  }, []);

  return theme;
}

export default function PixelCat({ mood = "curious", message }) {
  const canvasRef = useRef(null);
  const theme = useThemeName();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) {
      return;
    }

    drawCat(ctx, mood, theme);
  }, [mood, theme]);

  return (
    <div className={`cat-scene cat-${mood}`}>
      <canvas
        ref={canvasRef}
        className="pixel-cat"
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-label={`${mood} pixel cat assistant`}
      />
      <div className="cat-shadow" aria-hidden="true" />
      {message && <p className="cat-bubble">{message}</p>}
    </div>
  );
}
