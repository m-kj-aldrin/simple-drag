/**
 * @typedef {Object} HTMLTarget
 * @property {HTMLElement} target
 * @property {HTMLElement} currentTarget
 */

/**
 * @typedef {Object} DragData
 * @property {HTMLElement} [dragged]
 * @property {HTMLElement} [closest]
 */

/**
 * @template {"enter" | "finish"} T
 */
export class DraggableEvent extends Event {
  /**@type {T extends "enter" ? DragData : undefined} */
  #data;

  /**
   * @param {T} type
   * @param {DragData} data
   */
  constructor(type, data) {
    super(`draggable-${type}`, {
      bubbles: type == "finish",
    });
    this.#data = data;
  }

  get data() {
    return this.#data;
  }

  /**@type {T} */
  get type() {
    return super.type;
  }

  /**@type {HTMLElement} */
  get target() {
    return super.target;
  }

  /**@type {HTMLElement} */
  get currentTarget() {
    return super.currentTarget;
  }
}

/**
 * @template {DragEvent | InputEvent | MouseEvent} T
 * @typedef {T & HTMLTarget} HTMLEvent
 */

/**@param {HTMLEvent<DragEvent>} e */
function dragStart(e) {
  if (e.currentTarget != e.target) return;
  e.currentTarget.setAttribute("data-dragged", "true");
  document.documentElement.classList.add(e.currentTarget.tagName);
  document.documentElement.setAttribute("data-dragging", "true");
}

/**@param {HTMLEvent<DragEvent>} e */
function dragEnd(e) {
  e.currentTarget.removeAttribute("data-dragged");
  document.documentElement.classList.remove(e.currentTarget.tagName);
  document.documentElement.removeAttribute("data-dragging");

  e.currentTarget.dispatchEvent(new DraggableEvent("finish", {}));
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 */
export function draggable(target, drag_el = target) {
  drag_el.draggable = true;

  target.addEventListener("dragstart", dragStart);
  target.addEventListener("dragend", dragEnd);

  return target;
}

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
 * @param {HTMLEvent<DragEvent> & {currentTarget:HTMLElement}} e
 */
function dragOver(e) {
  e.preventDefault();

  let to_zone = e.currentTarget;

  /**@type {HTMLElement} */
  const dragged = document.querySelector("[data-dragged='true']");

  /**@type {NodeListOf<HTMLElement>} */
  const children = to_zone.querySelectorAll(
    `:scope > [draggable]:not([data-dragged="true"])`
  );

  let closest = getClosest(children, e.clientY);

  const from_zone = dragged.parentElement;
  if (!from_zone) return;
  if (!to_zone) return;

  if (closest == null) {
    if (dragged == to_zone.lastElementChild) return;
    to_zone.dispatchEvent(new DraggableEvent("enter", { closest, dragged }));
  } else {
    let next_siblings = to_zone.querySelectorAll("[data-dragged='true'] ~ *");
    if (next_siblings[0] == closest) return;
    to_zone.dispatchEvent(new DraggableEvent("enter", { closest, dragged }));
  }
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 * @returns {import("./types").HTMLDragZoneElement<T>}
 */
export function drag_zone(target) {
  if (!target?._drag_zone) {
    target.addEventListener("dragover", dragOver);
    target._drag_zone = true;
  }
  return target;
}
