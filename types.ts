import { DraggableEvent } from "./drag";

interface DragEventMap {
  "draggable-enter": DraggableEvent<"enter">;
  "draggable-finish": DraggableEvent<"finish">;
}

export interface HTMLDragZoneElement<E extends HTMLElement> extends E {
  addEventListener<K extends keyof HTMLElementEventMap | keyof DragEventMap>(
    type: K,
    listener: (
      this: HTMLElement,
      ev: (HTMLElementEventMap & DragEventMap)[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}
