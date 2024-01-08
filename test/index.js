import { DraggableEvent, dragZone, draggable } from "../drag.js";

let draggable_elements = [...Array(8)].map((_, i) => {
  let el = document.createElement("li");
  el.textContent = `draggable idx: ${i}`;

  draggable(el);

  return el;
});

let drag_zone_element = document.createElement("ul");
dragZone(drag_zone_element);

drag_zone_element.addEventListener(
  "draggable-enter",
  /**@param {DraggableEvent} e */
  (e) => {
    let { closest, dragged } = e.data;
    drag_zone_element.insertBefore(dragged, closest);
  }
);

drag_zone_element.append(...draggable_elements);

document.body.appendChild(drag_zone_element);
