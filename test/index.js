import { DraggableEvent, drag_zone, draggable } from "../drag.js";

function init_elements(text, n = 4) {
  let draggable_elements = [...Array(n)].map((_, i) => {
    let el = document.createElement("li");
    el.textContent = `${text} idx: ${i}`;

    draggable(el);

    return el;
  });

  return draggable_elements;
}

/**@param {DraggableEvent<"enter">} e */
function insert_handler(e) {
  let { closest, dragged } = e.data;
  e.currentTarget.insertBefore(dragged, closest);
}

/**@param {DraggableEvent<"finish">} e */
function finish_handler(e) {
  console.log("finish", e.target, e.currentTarget);
}

let drag_zone_element0 = drag_zone(document.createElement("ul"));
let drag_zone_element1 = drag_zone(document.createElement("ul"));

drag_zone_element0.addEventListener("draggable-enter", insert_handler);
drag_zone_element0.addEventListener("draggable-finish", finish_handler);

drag_zone_element1.addEventListener("draggable-enter", insert_handler);
drag_zone_element1.addEventListener("draggable-finish", finish_handler);

drag_zone_element0.append(...init_elements("list 0", 3));
drag_zone_element1.append(...init_elements("list 1", 5));

document.body.append(drag_zone_element0, drag_zone_element1);
