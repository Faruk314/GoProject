import { create } from "zustand";
import type { Stroke } from "../types/game";

interface GameState {
  tool: "brush" | "bucket";
  brushColor: string;
  secondaryColor: string;
  brushSize: number;
  isDrawingMode: boolean;

  history: Stroke[];
  redoStack: Stroke[];

  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setTool: (tool: "brush" | "bucket") => void;
  swapColors: () => void;

  pushStroke: (stroke: Stroke) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  tool: "brush",
  brushColor: "#000000",
  secondaryColor: "#FFFFFF",
  brushSize: 5,
  isDrawingMode: true,
  history: [],
  redoStack: [],

  setTool: (tool) => set({ tool }),

  setBrushColor: (color) => set({ brushColor: color }),

  setBrushSize: (size) => set({ brushSize: size }),

  swapColors: () =>
    set((state) => ({
      brushColor: state.secondaryColor,
      secondaryColor: state.brushColor,
    })),

  pushStroke: (stroke) =>
    set((state) => ({
      history: [...state.history, stroke],
      redoStack: [],
    })),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;

      const newHistory = [...state.history];
      const lastStroke = newHistory.pop();

      if (!lastStroke) return state;

      return {
        history: newHistory,
        redoStack: [lastStroke, ...state.redoStack],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;

      const [nextStroke, ...remainingRedo] = state.redoStack;

      return {
        redoStack: remainingRedo,
        history: [...state.history, nextStroke],
      };
    }),

  clearHistory: () => set({ history: [], redoStack: [] }),
}));
