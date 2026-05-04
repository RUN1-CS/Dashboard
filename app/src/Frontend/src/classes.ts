import { moveTablet, XMoving, lines } from "./dashboard.js";
import type { cords } from "./dashboard.js";

interface LineCordSet {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

class Tablet {
  id: string;
  el: HTMLElement | null;
  pos: cords;
  constructor(id: string, pos: cords = { x: 0, y: 0 }) {
    this.id = String(id);
    this.el = document.getElementById(this.id);
    this.pos = pos;

    this.el?.style.setProperty("left", String(this.pos.x) + "px");
    this.el?.style.setProperty("top", String(this.pos.y) + "px");

    if (this.el) {
      this.el.addEventListener("mousedown", (e) => {
        const rect = this.el?.getBoundingClientRect();
        const grabbedAtX = e.clientX - rect!.left;
        const grabbedAtY = e.clientY - rect!.top;
        XMoving();
        moveTablet(this.el, grabbedAtX, grabbedAtY);
      });
      this.el.addEventListener("mouseup", () => {
        this.pos.x = parseInt(this.el!.style.left);
        this.pos.y = parseInt(this.el!.style.top);
        XMoving();
      });
    }
  }
  update(newId: string, name: string, content: string, notes: string) {
    if (!this.el) return;
    this.el.id = String(newId);
    this.id = String(newId);
    const header = this.el.querySelector(".header") as HTMLElement | null;
    if (header) header.innerHTML = `<h1>${name}</h1>`;
    const body = this.el.querySelector(".body") as HTMLElement | null;
    if (body) body.innerText = content;
    const footer = this.el.querySelector(".footer") as HTMLElement | null;
    if (footer) footer.innerText = notes;
  }
}

class Todo {
  id: string;
  el: HTMLElement | null;
  done: boolean;
  text: string;
  constructor(id: number) {
    this.id = String(id);
    this.el = document.getElementById("todo-" + this.id);
    this.done = false;
    const taskText = this.el?.querySelector(".tasktext") as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    this.text = taskText ? taskText.value : "";
  }
}

class Line {
  id: string;
  Tab1: Tablet;
  Tab2: Tablet;
  el: SVGLineElement;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  constructor(Tab1: Tablet, Tab2: Tablet) {
    this.Tab1 = Tab1;
    this.Tab2 = Tab2;
    this.id = String(Math.ceil(Date.now() + Math.random()));

    this.el = document.createElementNS("http://www.w3.org/2000/svg", "line");

    this.el.id = this.id;

    let values = this.XY();
    this.x1 = values.x1;
    this.y1 = values.y1;
    this.x2 = values.x2;
    this.y2 = values.y2;

    document.getElementById("lines-svg")?.appendChild(this.el);
    this.update();
  }

  update() {
    const values: LineCordSet = this.XY();
    this.x1 = values.x1;
    this.y1 = values.y1;
    this.x2 = values.x2;
    this.y2 = values.y2;

    this.el.setAttribute("x1", this.x1);
    this.el.setAttribute("y1", this.y1);
    this.el.setAttribute("x2", this.x2);
    this.el.setAttribute("y2", this.y2);
  }

  XY(): LineCordSet {
    const rect1 = this.Tab1.el?.getBoundingClientRect();
    const rect2 = this.Tab2.el?.getBoundingClientRect();

    this.x1 = String(rect1!.left + rect1!.width / 2 + window.scrollX);
    this.y1 = String(rect1!.top + rect1!.height / 20 + window.scrollY);

    this.x2 = String(rect2!.left + rect2!.width / 2 + window.scrollX);
    this.y2 = String(rect2!.top + rect2!.height / 20 + window.scrollY);
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }
}

export { Tablet, Todo, Line };
