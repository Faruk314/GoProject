import { create } from "zustand";

interface GameState {
  brushColor: string;
  brushSize: number;
  isDrawingMode: boolean;

  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  brushColor: "#000000",
  brushSize: 5,
  isDrawingMode: true,

  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
}));
