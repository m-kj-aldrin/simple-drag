# Draggable

Is a library that exports a `draggable` and `dragZone` function that adds drag & drop functionality to HTML elements. The library does not implement any logic to rearange the DOM or a data, instead emits DragStartEvent,DragEnterEvent,DragFinishEvent containing the relevant DOM elements to implement a drag & drop program.

```javascript
import {
    DragEnterEvent,
    DragFinishEvent,
    DragStartEvent,
    dragZone,
    draggable,
} from "../drag.js";

let sessionStartZone, sessionEndZone;

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

//dragZone returns targed element and a cleanup function to remove listeners
let [zone0, cleanUp0] = dragZone(document.createElement("ul"));
let [zone1, cleanUp1] = dragZone(document.createElement("ul"));

document.body.append(zone0, zone1);

zone0.append(...elements0.map((el) => draggable(el)));
zone1.append(...elements1.map((el) => draggable(el)));

// Drag events bubbles
document.body.addEventListener("draggable-start", startHandler);
document.body.addEventListener("draggable-enter", insertHandler);
document.body.addEventListener("draggable-finish", finishHandler);
```
