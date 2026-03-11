import { useGameStore } from "../store/game";
import { BucketIcon } from "../components/ui/BucketIcon";

function Bucket() {
  const tool = useGameStore((state) => state.tool);
  const setTool = useGameStore((state) => state.setTool);
  const isActive = tool === "bucket";

  return (
    <button
      onClick={() => setTool("bucket")}
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
      <BucketIcon className="w-7 h-7" />
    </button>
  );
}

export default Bucket;
