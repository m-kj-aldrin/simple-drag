import type { DragEnterEvent, DragFinishEvent, DragStartEvent } from "./index.js";

declare global {
  interface HTMLElementEventMap {
    "draggable-start": DragStartEvent;
    "draggable-enter": DragEnterEvent;
    "draggable-finish": DragFinishEvent;
  }
}

export {};


