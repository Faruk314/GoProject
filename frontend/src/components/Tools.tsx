import BrushSizes from "./BrushSizes";
import ClearButton from "./ClearButton";
import ColorPalette from "./ColorPalette";
import ColorSwapper from "./ColorSwapper";
import UndoButton from "./UndoButton";

function Tools() {
  return (
    <div className="flex">
      <ColorSwapper />
      <ColorPalette />
      <BrushSizes />
      <UndoButton />
      <ClearButton />
    </div>
  );
}

export default Tools;
