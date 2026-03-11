import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game";
import { BucketIcon } from "../components/ui/BucketIcon";

function CustomCursor() {
  const { brushSize, primaryColor, tool } = useGameStore();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isBucket = tool === "bucket";
  const size = isBucket ? 32 : brushSize;

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
      {isBucket ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-[1.5px] h-4 bg-black shadow-[0_0_1px_white]" />
          <div className="absolute h-[1.5px] w-4 bg-black shadow-[0_0_1px_white]" />

          <BucketIcon
            className="w-6 h-6 text-gray-800"
            style={{
              filter: `drop-shadow(0 0 2px white)`,

              transform: "translate(10px, -10px)",
            }}
          />
        </div>
      ) : (
        <div
          className="w-full h-full rounded-full border border-gray-400"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </div>
  );
}

export default CustomCursor;
