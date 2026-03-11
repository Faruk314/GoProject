import { useEffect } from "react";
import { useGameStore } from "../store/game";

function Undo() {
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const historyLength = useGameStore((state) => state.history.length);
  const canUndo = historyLength > 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        if (event.shiftKey) {
          event.preventDefault();
          redo?.();
        } else {
          event.preventDefault();
          if (canUndo) undo();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        event.preventDefault();
        redo?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo]);

  return (
    <button
      onClick={undo}
      disabled={!canUndo}
      className={`
        w-14 h-14 rounded-lg border-2 border-gray-300 flex items-center justify-center
        transition-all active:scale-95 shadow-sm
        ${
          !canUndo
            ? "bg-gray-100 opacity-50 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 hover:border-purple-400"
        }
      `}
      title="Undo (Ctrl+Z)"
    >
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    </button>
  );
}

export default Undo;
