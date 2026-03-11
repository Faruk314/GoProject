import { useState } from "react";
import { useCanvas } from "../hooks/useCanvas";
import CustomCursor from "./CustomCursor";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/constants";

function DrawingCanvas() {
  const [showCursor, setShowCursor] = useState(false);
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();

  return (
    <div className="flex justify-center p-5 bg-gray-50 h-max">
      {showCursor && <CustomCursor />}

      <div
        className="relative border-2 border-black bg-white shadow-xl rounded-sm"
        style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
      >
        <canvas
          ref={canvasRef}
          onMouseEnter={() => setShowCursor(true)}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={() => {
            setShowCursor(false);
            stopDrawing();
          }}
          className="w-full h-full block cursor-none touch-none"
        />
      </div>
    </div>
  );
}

export default DrawingCanvas;
