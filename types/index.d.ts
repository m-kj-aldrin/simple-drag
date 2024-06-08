/**
 * @typedef {HTMLElement & {[draggableBrand]?:any}} DraggableElement
 */
/**@typedef {{target:DraggableElement,currentTarget:DraggableElement}} DraggableTargetCurrentTarget */
/**
 * Sets a element as a draggable
 * @param {DraggableElement} target element that should be draggable
 * @returns {(()=>void) | void} remove draggable from element
 */
export function draggable(target: DraggableElement): (() => void) | void;
/**
 * Sets target as a dragzone, draggable elements inside the zone will trigger DraggableStart,DraggableEneter,DraggableFinish events
 * @template {DraggableElement} T
 * @param {T} target
 * @returns {[T,()=>void] | [T,undefined]} cleanup function, removes the zone
 */
export function dragZone<T extends DraggableElement>(target: T): [T, () => void] | [T, undefined];
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
    /**@param {{startZone:DraggableElement,dragged:DraggableElement}} o */
    constructor({ startZone, dragged }: {
        startZone: DraggableElement;
        dragged: DraggableElement;
    });
    get dragged(): DraggableElement;
    get startZone(): DraggableElement;
    #private;
}
export class DragEnterEvent extends Event {
    /**@param {DragData} data */
    constructor({ closest, dragged, fromZone, toZone }: DragData);
    get closest(): DraggableElement | null;
    get dragged(): DraggableElement;
    get fromZone(): DraggableElement;
    get toZone(): DraggableElement;
    #private;
}
export class DragFinishEvent extends Event {
    /**@param {{endZone:DraggableElement,dragged:DraggableElement}} o */
    constructor({ endZone, dragged }: {
        endZone: DraggableElement;
        dragged: DraggableElement;
    });
    get dragged(): DraggableElement;
    get endZone(): DraggableElement;
    #private;
}
export type DraggableElement = HTMLElement & {
    [draggableBrand]?: any;
};
export type DraggableTargetCurrentTarget = {
    target: DraggableElement;
    currentTarget: DraggableElement;
};
export type HTMLTargetCurrentTarget = {
    target: HTMLElement;
    currentTarget: HTMLElement;
};
export type DragData = {
    dragged: DraggableElement;
    closest: DraggableElement | null;
    fromZone: DraggableElement;
    toZone: DraggableElement;
};
export type HTMLDragEvent = DraggableTargetCurrentTarget & DragEvent;
/**@typedef {DraggableTargetCurrentTarget & DragEvent} HTMLDragEvent */
declare const draggableBrand: unique symbol;
export {};
