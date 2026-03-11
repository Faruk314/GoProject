import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game";
import { BucketIcon } from "../components/ui/BucketIcon";

function CustomCursor() {
  const { brushSize, brushColor, tool } = useGameStore();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const size = tool === "bucket" ? 32 : brushSize;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-[width,height] duration-150 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        willChange: "transform",
      }}
    >
      {tool === "bucket" ? (
        <div className="relative animate-in fade-in zoom-in duration-200">
          <BucketIcon
            className="w-8 h-8 text-gray-800"
            style={{
              filter: `drop-shadow(0 0 2px white)`,

              transform: "translate(4px, -4px)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: brushColor }}
          />
        </div>
      ) : (
        <div
          className="w-full h-full rounded-full border border-gray-400 animate-in fade-in zoom-in duration-200"
          style={{ backgroundColor: brushColor }}
        />
      )}
    </div>
  );
}

export default CustomCursor;
