import DrawingCanvas from "../components/DrawingCanvas";
import Tools from "../components/Tools";

export default function Game() {
  return (
    <section className="flex flex-col items-center">
      <DrawingCanvas />

      <Tools />
    </section>
  );
}
