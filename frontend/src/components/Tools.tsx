import BrushSizes from "./BrushSizes";
import ColorPalette from "./ColorPalette";
import ColorSwapper from "./ColorSwapper";

function Tools() {
  return (
    <div className="flex">
      <ColorSwapper />
      <ColorPalette />
      <BrushSizes />
    </div>
  );
}

export default Tools;
