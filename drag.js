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
 * @property {HTMLElement} dragged
 * @property {HTMLElement | null} closest
 * @property {HTMLElement} fromZone
 * @property {HTMLElement} toZone
 */

export class DragStartEvent extends Event {
    /**@type {HTMLElement} */
    #startZone;

    /**@param {{startZone:HTMLElement}} o */
    constructor({ startZone }) {
        super("draggable-start", { bubbles: true });
        this.#startZone = startZone;
    }

    get startZone() {
        return this.#startZone;
    }
}

export class DragEnterEvent extends Event {
    /**@type {HTMLElement | null} */
    #closest;
    /**@type {HTMLElement} */
    #dragged;

    /**@type {HTMLElement} */
    #fromZone;
    /**@type {HTMLElement} */
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
    /**@type {HTMLElement} */
    #endZone;

    /**@param {{endZone:HTMLElement}} o */
    constructor({ endZone }) {
        super("draggable-finish", {
            bubbles: true,
        });

        this.#endZone = endZone;
    }

    get endZone() {
        return this.#endZone;
    }
}

/**@typedef {HTMLTargetCurrentTarget & DragEvent} HTMLDragEvent */

const draggableBrand = Symbol("draggable-brand");

/**
 * Sets a element as a draggable
 * @param {HTMLElement} target element that should be draggable
 * @returns {()=>void} remove draggable from element
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
 * @param {HTMLTargetCurrentTarget & DragEvent} e
 */
function zoneDragStart(e) {
    let startZone = e.currentTarget;

    if (!e.target[draggableBrand]?.draggable) return;

    e.target.setAttribute("data-dragged", "true");
    document.documentElement.classList.add(e.currentTarget.tagName);
    document.documentElement.setAttribute("data-dragging", "true");

    e.target.dispatchEvent(new DragStartEvent({ startZone }));
}

/**
 *
 * @param {HTMLTargetCurrentTarget & DragEvent} e
 */
function zoneDragEnd(e) {
    let endZone = e.currentTarget;

    if (!e.target[draggableBrand]?.draggable) return;

    e.target.removeAttribute("data-dragged");
    document.documentElement.classList.remove(e.currentTarget.tagName);
    document.documentElement.removeAttribute("data-dragging");

    e.target.dispatchEvent(new DragFinishEvent({ endZone }));
}

/**
 * @param {HTMLTargetCurrentTarget & DragEvent} e
 */
function zoneDragOver(e) {
    e.preventDefault();

    /**@type {HTMLElement} */
    const dragged = document.querySelector("[draggable][data-dragged='true']");
    if (!dragged) return;

    const toZone = e.currentTarget;
    const fromZone = dragged.parentElement;

    if (!fromZone[draggableBrand]?.draggableZone) return;
    if (!toZone[draggableBrand]?.draggableZone) return;

    /**@type {NodeListOf<HTMLElement>} */
    const children = toZone.querySelectorAll(
        `:scope > [draggable]:not([data-dragged="true"])`
    );

    let closest = getClosest(children, e.clientY);

    if (closest == null) {
        if (dragged == toZone.lastElementChild) return;
        toZone.dispatchEvent(
            new DragEnterEvent({ closest, dragged, fromZone, toZone })
        );
    } else {
        let next_siblings = toZone.querySelectorAll(
            "[data-dragged='true'] ~ *"
        );
        if (next_siblings[0] == closest) return;
        toZone.dispatchEvent(
            new DragEnterEvent({ closest, dragged, fromZone, toZone })
        );
    }
}

/**
 * Sets target as a dragzone, draggable elements inside the zone will trigger DraggableStart,DraggableEneter,DraggableFinish events
 * @template {HTMLElement} T
 * @param {T} target
 * @returns {[T,()=>void | void]} cleanup function, removes the zone
 */
export function dragZone(target) {
    if (!target[draggableBrand]?.draggableZone) {
        let controller = new AbortController();

        target.addEventListener("dragover", zoneDragOver, {
            signal: controller.signal,
        });
        target.addEventListener("dragstart", zoneDragStart, {
            signal: controller.signal,
        });
        target.addEventListener("dragend", zoneDragEnd, {
            signal: controller.signal,
        });

        target[draggableBrand] = {
            ...target[draggableBrand],
            draggableZone: true,
        };

        return [
            target,
            () => {
                controller.abort();
                target[draggableBrand].draggableZone = false;
            },
        ];
    }

    return [target, undefined];
}
