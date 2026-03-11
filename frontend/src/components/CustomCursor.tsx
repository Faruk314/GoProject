import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game";

function CustomCursor() {
  const { brushSize, brushColor } = useGameStore();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-gray-400"
      style={{
        width: `${brushSize}px`,
        height: `${brushSize}px`,
        backgroundColor: brushColor,
        willChange: "transform",
      }}
    />
  );
}

export default CustomCursor;
