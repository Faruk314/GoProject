import DrawingCanvas from "../components/game/DrawingCanvas";
import Tools from "../components/game/Tools";

export default function Game() {
  return (
    <section className="flex flex-col items-center">
      <DrawingCanvas />

      <Tools />
    </section>
  );
}
