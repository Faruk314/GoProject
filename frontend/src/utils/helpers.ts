import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Stroke } from "../types/game";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function renderStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.type === "bucket") {
    if (stroke.startX !== undefined && stroke.startY !== undefined) {
      executeFloodFill(ctx.canvas, stroke.startX, stroke.startY, stroke.color);
    }
    return;
  }

  if (stroke.points.length === 0) return;

  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
}

function executeFloodFill(
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillColor: string,
) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const targetColor = getPixelColor(pixels, startX, startY, width);
  const fillColorRgb = parseHexToRgb(fillColor);

  if (isSameColor(targetColor, fillColorRgb)) return;

  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    let [x, y] = stack.pop()!;
    let currentPos = (y * width + x) * 4;

    while (
      y >= 0 &&
      isSameColor(getPixelAtPos(pixels, currentPos), targetColor)
    ) {
      y--;
      currentPos -= width * 4;
    }

    currentPos += width * 4;
    y++;

    let checkLeft = false;
    let checkRight = false;

    while (
      y < height &&
      isSameColor(getPixelAtPos(pixels, currentPos), targetColor)
    ) {
      pixels[currentPos] = fillColorRgb[0];
      pixels[currentPos + 1] = fillColorRgb[1];
      pixels[currentPos + 2] = fillColorRgb[2];
      pixels[currentPos + 3] = 255;

      if (x > 0) {
        const hasTargetColorLeft = isSameColor(
          getPixelAtPos(pixels, currentPos - 4),
          targetColor,
        );
        if (hasTargetColorLeft && !checkLeft) {
          stack.push([x - 1, y]);
          checkLeft = true;
        } else if (!hasTargetColorLeft) {
          checkLeft = false;
        }
      }

      if (x < width - 1) {
        const hasTargetColorRight = isSameColor(
          getPixelAtPos(pixels, currentPos + 4),
          targetColor,
        );
        if (hasTargetColorRight && !checkRight) {
          stack.push([x + 1, y]);
          checkRight = true;
        } else if (!hasTargetColorRight) {
          checkRight = false;
        }
      }

      y++;
      currentPos += width * 4;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(
  pixels: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
) {
  const i = (y * width + x) * 4;
  return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
}

function getPixelAtPos(pixels: Uint8ClampedArray, pos: number) {
  return [pixels[pos], pixels[pos + 1], pixels[pos + 2], pixels[pos + 3]];
}

function isSameColor(colorA: number[], colorB: number[]) {
  return (
    colorA[0] === colorB[0] &&
    colorA[1] === colorB[1] &&
    colorA[2] === colorB[2]
  );
}

function parseHexToRgb(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
}

export { cn, renderStroke, executeFloodFill };
