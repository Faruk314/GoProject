import Brush from "./Brush";
import BrushSizes from "./BrushSizes";
import Bucket from "./Bucket";
import Clear from "./Clear";
import ColorPalette from "./ColorPalette";
import ColorSwapper from "./ColorSwapper";
import Undo from "./Undo";

function Tools() {
  return (
    <div className="flex">
      <ColorSwapper />
      <ColorPalette />
      <BrushSizes />
      <Brush />
      <Bucket />
      <Undo />
      <Clear />
    </div>
  );
}

export default Tools;
