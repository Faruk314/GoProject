import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../store/game";
import type { Point } from "../types/game";
import { renderStroke, executeFloodFill } from "../utils/helpers";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentStroke = useRef<Point[]>([]);

  const tool = useGameStore((state) => state.tool);
  const brushColor = useGameStore((state) => state.brushColor);
  const brushSize = useGameStore((state) => state.brushSize);
  const history = useGameStore((state) => state.history);
  const pushStroke = useGameStore((state) => state.pushStroke);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
    history.forEach((stroke) => renderStroke(ctx, stroke));
  }, [history]);

  const startDrawing = useCallback(
    (e: React.MouseEvent) => {
      const { offsetX, offsetY } = e.nativeEvent;
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      const x = Math.floor(offsetX);
      const y = Math.floor(offsetY);

      if (tool === "bucket") {
        executeFloodFill(canvas, x, y, brushColor);
        pushStroke({
          type: "bucket",
          points: [],
          color: brushColor,
          size: 0,
          startX: x,
          startY: y,
        });
        return;
      }

      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      currentStroke.current = [{ x: offsetX, y: offsetY }];
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    },
    [brushColor, brushSize, tool, pushStroke],
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
        type: "brush",
        points: [...currentStroke.current],
        color: brushColor,
        size: brushSize,
      });
      currentStroke.current = [];
    }
  }, [brushColor, brushSize, pushStroke]);

  return { canvasRef, startDrawing, draw, stopDrawing };
};
