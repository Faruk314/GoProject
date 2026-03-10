import { useRef, useEffect, useState, type MouseEvent } from "react";
import { useGameStore } from "../store/game";
import CustomCursor from "./CustomCursor";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [showCursor, setShowCursor] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { brushColor, brushSize, isDrawingMode } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      contextRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="flex justify-center p-5">
      {showCursor && <CustomCursor />}

      <canvas
        onMouseEnter={() => setShowCursor(true)}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={() => {
          setShowCursor(false);
          stopDrawing();
        }}
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-black bg-white cursor-none shadow-lg"
      />
    </div>
  );
}

export default DrawingCanvas;
