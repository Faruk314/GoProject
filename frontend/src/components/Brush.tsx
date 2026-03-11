import { useGameStore } from "../store/game";
import { BrushIcon } from "../components/ui/BrushIcon";

function Brush() {
  const tool = useGameStore((state) => state.tool);
  const setTool = useGameStore((state) => state.setTool);
  const isActive = tool === "brush";

  return (
    <button
      onClick={() => setTool("brush")}
      className={`
        w-14 h-14 rounded-lg border-2 flex items-center justify-center
        transition-all active:scale-95 shadow-sm
        ${
          isActive
            ? "bg-purple-100 border-purple-500 text-purple-600"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-purple-400"
        }
      `}
    >
      <BrushIcon className="w-7 h-7" />
    </button>
  );
}

export default Brush;
