import {
    DragEnterEvent,
    DragFinishEvent,
    DragStartEvent,
    dragZone,
    draggable,
} from "../drag.js";

function initDraggableElements(text, n = 4) {
    let draggable_elements = [...Array(n)].map((_, i) => {
        let el = document.createElement("li");
        el.textContent = `${text} idx: ${i}`;

        let cleanup = draggable(el);

        return el;
    });

    return draggable_elements;
}

/**@type {HTMLElement} */
let sessionStartZone;
/**@type {HTMLElement} */
let sessionEndZone;

/**@param {DragStartEvent} e */
function startHandler(e) {
    let startZone = e.startZone;
    let dragged = e.target;

    console.log("start");
    console.log("dragged element: ", dragged);
    console.log("started at: ", startZone);
    console.log("\n");

    sessionStartZone = startZone;
}

/**@param {DragEnterEvent} e */
function insertHandler(e) {
    let dragged = e.dragged;
    let closest = e.closest;
    let fromZone = e.fromZone;
    let toZone = e.toZone;

    console.log("enter");
    console.log("dragged element: ", dragged);
    console.log("dragged from: ", fromZone);
    console.log("dragged to: ", toZone);
    console.log("\n");

    toZone.insertBefore(dragged, closest);
}

/**@param {DragFinishEvent} e */
function finishHandler(e) {
    let endZone = e.endZone;
    let dragged = e.target;

    sessionEndZone = endZone;

    console.log("finish");
    console.log("dragged element: ", dragged);
    console.log("drag started at: ", sessionStartZone);
    console.log("drag ended at: ", sessionEndZone);
    console.log("\n");
}

let [zone0, cleanUp0] = dragZone(document.createElement("ul"));
let [zone1, cleanUp1] = dragZone(document.createElement("ul"));

document.body.addEventListener("draggable-start", startHandler);
document.body.addEventListener("draggable-enter", insertHandler);
document.body.addEventListener("draggable-finish", finishHandler);

zone0.append(...initDraggableElements("list 0", 3));
zone1.append(...initDraggableElements("list 1", 5));

document.body.append(zone0, zone1);
