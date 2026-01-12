let mouse = { x: 0, y: 0 };
let moving = false;
let tablets = [];
let lines = [];

const TheLine = document.getElementById("TheLine");

class Tablet {
  constructor(id) {
    this.id = String(id);
    this.el = document.getElementById(this.id);

    if (this.el) {
      this.el.addEventListener("mousedown", () => {
        moving = true;
        moveTablet(this.el);
      });
      this.el.addEventListener("mouseup", () => {
        moving = false;
      });
    }
  }
  update(newId, name, content, notes) {
    if (!this.el) return;
    this.el.id = String(newId);
    this.id = String(newId);
    const header = this.el.querySelector(".header");
    if (header) header.innerHTML = `<h1>${name}</h1>`;
    const body = this.el.querySelector(".body");
    if (body) body.innerText = content;
    const footer = this.el.querySelector(".footer");
    if (footer) footer.innerText = notes;
  }
}

class Line {
  constructor(Tab1, Tab2) {
    this.Tab1 = Tab1;
    this.Tab2 = Tab2;
    this.id = Date.now() + Math.random();
    this.el = TheLine.cloneNode(true);
    this.el.id = this.id;
    lines.push(this);
    document.getElementById("lines-svg").appendChild(this.el);
    this.update();
  }

  update() {
    const rect1 = this.Tab1.el.getBoundingClientRect();
    const rect2 = this.Tab2.el.getBoundingClientRect();

    this.x1 = rect1.left + rect1.width / 2 + window.scrollX;
    this.y1 = rect1.top + rect1.height / 20 + window.scrollY;

    this.x2 = rect2.left + rect2.width / 2 + window.scrollX;
    this.y2 = rect2.top + rect2.height / 20 + window.scrollY;

    this.el.setAttribute("x1", this.x1);
    this.el.setAttribute("y1", this.y1);
    this.el.setAttribute("x2", this.x2);
    this.el.setAttribute("y2", this.y2);
  }
}

const tablet = document.getElementById("1");
tablet.style.display = "none";

function moveTablet(movedTablet) {
  let rafId;
  function loop() {
    if (!moving) {
      if (rafId) cancelAnimationFrame(rafId);
      return;
    }
    movedTablet.style.left = mouse.x - 150 + "px";
    movedTablet.style.top = mouse.y - 50 + "px";
    for (let line of lines) {
      line.update();
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

// event listeners are handled by Tablet instances

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

let clicked;

const am = document.getElementById("action-menu");
const add = document.getElementById("add-tablet");
const del = document.getElementById("delete-tablet");
const ch = document.getElementById("edit-tablet");
const addConn = document.getElementById("add-connections");
const removeConns = document.getElementById("remove-connections");
const submitBtn = document.getElementById("ch-sub");
const connectBtn = document.getElementById("connect-sub");

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  clicked = document.elementFromPoint(mouse.x, mouse.y);
  am.style.display = "block";
  am.style.top = mouse.y - 5 + "px";
  am.style.left = mouse.x - 5 + "px";
});

am.addEventListener("mouseleave", () => {
  am.style.display = "none";
});
add.addEventListener("click", () => {
  const newTablet = tablet.cloneNode(true);
  newTablet.style.display = "block";
  newTablet.id = Date.now();
  document.body.appendChild(newTablet);
  newTablet.style.position = "absolute";
  newTablet.style.left = mouse.x - 150 + "px";
  newTablet.style.top = mouse.y - 50 + "px";
  am.style.display = "none";
  const t = new Tablet(newTablet.id);
  tablets.push(t);
});
del.addEventListener("click", () => {
  if (clicked && clicked.classList.contains("tablet")) {
    document.body.removeChild(clicked);
  }
  am.style.display = "none";
});
ch.addEventListener("click", () => {
  am.style.display = "none";
  const mpop = document.getElementById("mpop");
  mpop.style.display = "block";
  mpop.style.top = mouse.y - 5 + "px";
  mpop.style.left = mouse.x - 5 + "px";
  const mpopedit = document.getElementById("mpop-edit");
  mpopedit.style.display = "block";
  document.getElementById("ch-id").value = clicked.id;
  document.getElementById("ch-title").value =
    clicked.querySelector(".header h1").innerText;
  document.getElementById("ch-content").value =
    clicked.querySelector(".body").innerText;
  document.getElementById("ch-notes").value =
    clicked.querySelector(".footer").innerText;
  am.style.display = "none";
});
addConn.addEventListener("click", () => {
  am.style.display = "none";
  const mpop = document.getElementById("mpop");
  document.getElementById("mpop-connect").style.display = "block";
  mpop.style.display = "block";
  mpop.style.top = mouse.y - 5 + "px";
  mpop.style.left = mouse.x - 5 + "px";
});
removeConns.addEventListener("click", () => {
  am.style.display = "none";
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.Tab1.id == clicked.id || line.Tab2.id == clicked.id) {
      document.getElementById("lines-svg").removeChild(line.el);
      lines.splice(i, 1);
    }
  }
});
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const idInput = document.getElementById("ch-id").value;
  const titleInput = document.getElementById("ch-title").value;
  const contentInput = document.getElementById("ch-content").value;
  const notesInput = document.getElementById("ch-notes").value;
  const colorInput = document.getElementById("ch-color").value;
  if (idInput && titleInput && contentInput && notesInput) {
    for (let t of tablets) {
      if (t.id == clicked.id) {
        t.update(idInput, titleInput, contentInput, notesInput);
        lighten(colorInput, 0.4);
        t.el.style.backgroundColor = lighten(colorInput, 0.4);
        t.el.querySelector(".header").style.backgroundColor = colorInput;
        t.el.querySelector(".footer").style.backgroundColor = colorInput;
      }
    }
  }
  document.getElementById("mpop").style.display = "none";
  document.getElementById("mpop-edit").style.display = "none";
  document.getElementById("mpop-dash-settings").style.display = "none";
});
connectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("mpop").style.display = "none";
  document.getElementById("mpop-connect").style.display = "none";
  const connectInput = document.getElementById("connect").value;
  if (connectInput) {
    for (let t1 of tablets) {
      if (t1.id == clicked.id) {
        for (let t2 of tablets) {
          if (t2.id == connectInput && t1.id != t2.id) {
            new Line(t1, t2);
          }
        }
      }
    }
  }
});

function lighten(hex, amt = 0.4) {
  if (!hex) return hex;
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(hex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.round(r + (255 - r) * amt);
  g = Math.round(g + (255 - g) * amt);
  b = Math.round(b + (255 - b) * amt);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
