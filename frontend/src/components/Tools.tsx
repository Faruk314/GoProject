import BrushSizes from "./BrushSizes";
import ColorPalette from "./ColorPalette";

function Tools() {
  return (
    <div className="flex">
      <ColorPalette />
      <BrushSizes />
    </div>
  );
}

export default Tools;
