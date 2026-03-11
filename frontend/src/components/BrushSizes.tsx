import { useState } from "react";
import { useGameStore } from "../store/game";
import { BRUSH_SIZES } from "../utils/constants";

function BrushDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const brushSize = useGameStore((state) => state.brushSize);
  const setBrushSize = useGameStore((state) => state.setBrushSize);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-white rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
      >
        <div
          style={{
            width: `${brushSize}px`,
            height: `${brushSize}px`,
          }}
          className="rounded-full bg-black"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col bg-white border-2 border-gray-300 rounded-xl shadow-2xl overflow-hidden">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setBrushSize(size.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-center 
                  w-14 h-14 
                  transition-colors border-b last:border-b-0 border-gray-100
                  ${brushSize === size.value ? "bg-purple-400" : "hover:bg-gray-100"}
                `}
              >
                <div
                  style={{
                    width: `${size.value}px`,
                    height: `${size.value}px`,
                  }}
                  className="rounded-full bg-black transition-all"
                />
              </button>
            ))}

            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-gray-300 rotate-45" />
          </div>
        </>
      )}
    </div>
  );
}

export default BrushDropdown;
