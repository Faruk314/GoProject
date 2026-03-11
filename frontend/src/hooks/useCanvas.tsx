import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../store/game";
import type { Point, Stroke } from "../types/game";

const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
  if (stroke.points.length === 0) return;
  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.stroke();
};

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentStroke = useRef<Point[]>([]);

  const brushColor = useGameStore((state) => state.brushColor);
  const brushSize = useGameStore((state) => state.brushSize);
  const history = useGameStore((state) => state.history);
  const pushStroke = useGameStore((state) => state.pushStroke);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    contextRef.current = ctx;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.forEach((stroke) => drawStroke(ctx, stroke));
  }, [history]);

  const startDrawing = useCallback(
    (e: React.MouseEvent) => {
      const { offsetX, offsetY } = e.nativeEvent;
      const ctx = contextRef.current;
      if (!ctx) return;

      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      currentStroke.current = [{ x: offsetX, y: offsetY }];
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    },
    [brushColor, brushSize],
  );

  const draw = useCallback((e: React.MouseEvent) => {
    if (currentStroke.current.length === 0 || !contextRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;

    currentStroke.current.push({ x: offsetX, y: offsetY });
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }, []);

  const stopDrawing = useCallback(() => {
    if (currentStroke.current.length > 0) {
      pushStroke({
        points: [...currentStroke.current],
        color: brushColor,
        size: brushSize,
      });
      currentStroke.current = [];
    }
  }, [brushColor, brushSize, pushStroke]);

  return { canvasRef, startDrawing, draw, stopDrawing };
};
