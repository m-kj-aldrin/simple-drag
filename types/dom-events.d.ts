import type { DragEnterEvent, DragFinishEvent, DragStartEvent } from "./index";

declare global {
  interface HTMLElementEventMap {
    "draggable-start": DragStartEvent;
    "draggable-enter": DragEnterEvent;
    "draggable-finish": DragFinishEvent;
  }
}

export {};

import type { DragEnterEvent, DragFinishEvent, DragStartEvent } from "./index";

declare global {
  interface HTMLElementEventMap {
    "draggable-start": DragStartEvent;
    "draggable-enter": DragEnterEvent;
    "draggable-finish": DragFinishEvent;
  }
}

export {};


