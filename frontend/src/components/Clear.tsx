import { useGameStore } from "../store/game";

function Clear() {
  const historyLength = useGameStore((state) => state.history.length);
  const clearHistory = useGameStore((state) => state.clearHistory);

  return (
    <button
      onClick={clearHistory}
      disabled={historyLength === 0}
      className={`
        w-14 h-14 rounded-lg border-2 border-gray-300 flex items-center justify-center
        transition-all active:scale-95 shadow-sm
        ${
          historyLength === 0
            ? "bg-gray-100 opacity-50 cursor-not-allowed"
            : "bg-white hover:bg-red-50 hover:border-red-400 text-gray-700 hover:text-red-500"
        }
      `}
      title="Clear Canvas"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}

export default Clear;
