# Draggable

A tiny library that exports `draggable` and `dragZone`. It does not manipulate the DOM for you; instead, drag zones emit events when draggable elements are dragged. The emitted `DragStartEvent`, `DragEnterEvent`, and `DragFinishEvent` contain the relevant DOM elements to implement drag & drop behavior.

## Install

```bash
npm install @mkja/draggable
```

## Notes

- Custom events bubble and are composed (cross Shadow DOM boundaries).
- DataTransfer is set for cross‑browser compatibility (e.g., Firefox).

```javascript
import {
  DragEnterEvent,
  DragFinishEvent,
  DragStartEvent,
  dragZone,
  draggable,
} from "@mkja/draggable";

let sessionStartZone, sessionEndZone;

/**@param {DragStartEvent} e */
function startHandler(e) {
  let dragged = e.dragged;
  let startZone = e.startZone;

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
  let dragged = e.dragged;
  let endZone = e.endZone;

  sessionEndZone = endZone;

  console.log("finish");
  console.log("dragged element: ", dragged);
  console.log("drag started at: ", sessionStartZone);
  console.log("drag ended at: ", sessionEndZone);
  console.log("\n");
}

// dragZone returns target element and a cleanup function to remove listeners
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
