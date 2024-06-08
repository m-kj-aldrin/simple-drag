/**
 * @param {NodeListOf<HTMLElement> | HTMLCollectionOf<HTMLElement>} children
 * @param {number} y
 */
function getClosest(children, y) {
  let closestElement = null;
  let closestoffsetY = Number.NEGATIVE_INFINITY;

  for (const child of children) {
    const childBox = child.getBoundingClientRect();
    const offsetY = y - childBox.top - childBox.height / 2;

    if (offsetY < 0 && offsetY > closestoffsetY) {
      closestElement = child;
      closestoffsetY = offsetY;
    }
  }

  return closestElement;
}

/**
 * @typedef {Object} HTMLTargetCurrentTarget
 * @property {HTMLElement} target
 * @property {HTMLElement} currentTarget
 */

/**
 * @typedef {Object} DragData
 * @property {DraggableElement} dragged
 * @property {DraggableElement | null} closest
 * @property {DraggableElement} fromZone
 * @property {DraggableElement} toZone
 */

export class DragStartEvent extends Event {
  /**@type {DraggableElement} */
  #startZone;
  /**@type {DraggableElement} */
  #dragged;

  /**@param {{startZone:DraggableElement,dragged:DraggableElement}} o */
  constructor({ startZone, dragged }) {
    super("draggable-start", { bubbles: true });
    this.#startZone = startZone;
    this.#dragged = dragged;
  }

  get dragged() {
    return this.#dragged;
  }

  get startZone() {
    return this.#startZone;
  }
}

export class DragEnterEvent extends Event {
  /**@type {DraggableElement | null} */
  #closest;
  /**@type {DraggableElement} */
  #dragged;

  /**@type {DraggableElement} */
  #fromZone;
  /**@type {DraggableElement} */
  #toZone;

  /**@param {DragData} data */
  constructor({ closest, dragged, fromZone, toZone }) {
    super("draggable-enter", { bubbles: true });

    this.#dragged = dragged;
    this.#closest = closest;
    this.#fromZone = fromZone;
    this.#toZone = toZone;
  }

  get closest() {
    return this.#closest;
  }
  get dragged() {
    return this.#dragged;
  }
  get fromZone() {
    return this.#fromZone;
  }
  get toZone() {
    return this.#toZone;
  }
}

export class DragFinishEvent extends Event {
  /**@type {DraggableElement} */
  #endZone;
  /**@type {DraggableElement} */
  #dragged;

  /**@param {{endZone:DraggableElement,dragged:DraggableElement}} o */
  constructor({ endZone, dragged }) {
    super("draggable-finish", {
      bubbles: true,
    });

    this.#endZone = endZone;
    this.#dragged = dragged;
  }

  get dragged() {
    return this.#dragged;
  }

  get endZone() {
    return this.#endZone;
  }
}

/**@typedef {DraggableTargetCurrentTarget & DragEvent} HTMLDragEvent */

const draggableBrand = Symbol("draggable-brand");

/**
 * @typedef {HTMLElement & {[draggableBrand]?:any}} DraggableElement
 */

/**@typedef {{target:DraggableElement,currentTarget:DraggableElement}} DraggableTargetCurrentTarget */

/**
 * Sets a element as a draggable
 * @param {DraggableElement} target element that should be draggable
 * @returns {(()=>void) | void} remove draggable from element
 */
export function draggable(target) {
  if (target[draggableBrand]?.draggable) {
    return;
  }

  target.draggable = true;
  target[draggableBrand] = { ...target[draggableBrand], draggable: true };

  return () => {
    target.draggable = false;
    target[draggableBrand].draggable = false;
  };
}

/**
 *
 * @this {DraggableElement}
 * @param {DragEvent} e
 */
function zoneDragStart(e) {
  let startZone = this;

  /**@type {DraggableElement} */ // @ts-ignore
  const target = e.target;
  if (!target[draggableBrand]?.draggable) return;

  target.setAttribute("data-dragged", "true");
  document.documentElement.setAttribute("data-dragging", "true");

  target.dispatchEvent(new DragStartEvent({ startZone }));
}

/**
 *
 * @this {DraggableElement}
 * @param {DragEvent} e
 */
function zoneDragEnd(e) {
  let endZone = this;
  /**@type {DraggableElement} */ // @ts-ignore
  const target = e.target;
  if (!target[draggableBrand]?.draggable) return;

  if (!target?.draggable) return;

  target.removeAttribute("data-dragged");
  document.documentElement.removeAttribute("data-dragging");

  target.dispatchEvent(new DragFinishEvent({ endZone }));
}

/**
 * @this {DraggableElement}
 * @param {DragEvent} e
 */
function zoneDragOver(e) {
  e.preventDefault();

  /**@type {HTMLElement | null} */
  const dragged = document.querySelector("[draggable][data-dragged='true']");
  if (!dragged) return;

  const toZone = this;
  /**@type {DraggableElement | null} */
  const fromZone = dragged.closest("[data-draggable-zone]");

  if (!fromZone || !fromZone[draggableBrand]?.draggableZone) return;
  if (!toZone[draggableBrand]?.draggableZone) return;

  /**@type {NodeListOf<HTMLElement>} */
  const children = toZone.querySelectorAll(`:scope > [draggable]:not([data-dragged="true"])`);

  let closest = getClosest(children, e.clientY);

  if (closest == null) {
    if (dragged == toZone.lastElementChild) return;
    toZone.dispatchEvent(new DragEnterEvent({ closest, dragged, fromZone, toZone }));
  } else {
    let next_siblings = toZone.querySelectorAll("[data-dragged='true'] ~ *");
    if (next_siblings[0] == closest) return;
    toZone.dispatchEvent(new DragEnterEvent({ closest, dragged, fromZone, toZone }));
  }
}

/**
 * Sets target as a dragzone, draggable elements inside the zone will trigger DraggableStart,DraggableEneter,DraggableFinish events
 * @template {DraggableElement} T
 * @param {T} target
 * @returns {[T,()=>void] | [T,undefined]} cleanup function, removes the zone
 */
export function dragZone(target) {
  if (!target[draggableBrand]?.draggableZone) {
    let controller = new AbortController();
    target.toggleAttribute("data-draggable-zone", true);

    target.addEventListener("dragover", zoneDragOver.bind(target), { signal: controller.signal });
    target.addEventListener("dragstart", zoneDragStart.bind(target), { signal: controller.signal });
    target.addEventListener("dragend", zoneDragEnd.bind(target), { signal: controller.signal });

    target[draggableBrand] = {
      ...target[draggableBrand],
      draggableZone: true,
    };

    return [
      target,
      () => {
        controller.abort();
        target.removeAttribute("data-draggable-zone");
        target[draggableBrand].draggableZone = false;
      },
    ];
  }

  return [target, undefined];
}
