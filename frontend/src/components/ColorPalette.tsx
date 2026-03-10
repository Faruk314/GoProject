import { useGameStore } from "../store/game";
import { COLORS } from "../utils/constants";

function ColorPalette() {
  const { brushColor, setBrushColor } = useGameStore();

  return (
    <div className="grid grid-cols-5 gap-2 p-2.5 bg-gray-200 rounded-lg w-fit shadow-md">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => setBrushColor(color)}
          className={`
            w-8 h-8 rounded-md cursor-pointer transition-transform active:scale-95
            ${
              brushColor === color
                ? "border-4 border-gray-700 ring-2 ring-white"
                : "border border-gray-300 hover:border-gray-400"
            }
          `}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

export default ColorPalette;
