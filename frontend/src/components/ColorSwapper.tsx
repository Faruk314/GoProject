import { useGameStore } from "../store/game";

function ColorSwapper() {
  const { brushColor, secondaryColor, swapColors } = useGameStore();

  return (
    <button
      onClick={swapColors}
      className="w-14 h-14 rounded-lg border-2 border-gray-300 shadow-sm transition-all hover:scale-105 active:scale-95 overflow-hidden"
      title="Swap Colors (X)"
      style={{
        background: `linear-gradient(135deg, ${brushColor} 50%, ${secondaryColor} 50%)`,
      }}
    />
  );
}

export default ColorSwapper;
