import { create } from "zustand";
import type { Stroke } from "../types/game";

interface GameState {
  tool: "brush" | "bucket";
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  isDrawingMode: boolean;

  history: Stroke[];
  redoStack: Stroke[];

  setPrimaryColor: (color: string) => void;
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
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  brushSize: 5,
  isDrawingMode: true,
  history: [],
  redoStack: [],

  setTool: (tool) => set({ tool }),

  setPrimaryColor: (color) => set({ primaryColor: color }),

  setBrushSize: (size) => set({ brushSize: size }),

  swapColors: () =>
    set((state) => ({
      primaryColor: state.secondaryColor,
      secondaryColor: state.primaryColor,
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
