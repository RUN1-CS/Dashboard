import { Line, Tablet } from "./classes.js";

export interface cords {
  x: number;
  y: number;
}

interface dataTablet {
  id: string;
  name: string;
  content: string;
  notes: string;
  color: string;
  pos: cords;
}

interface dataLine {
  tab1Id: string;
  tab2Id: string;
}

let mouse: cords = { x: 0, y: 0 };
let moving: boolean = false;
let tablets: Tablet[] = [];
export let lines: Line[] = [];

export function XMoving() {
  moving = !moving;
}

export function moveTablet(
  movedTablet: HTMLElement | null,
  grabbedAtX = 150,
  grabbedAtY = 50,
) {
  let rafId: number | null = null;
  function loop() {
    if (!moving) {
      if (rafId) cancelAnimationFrame(rafId);
      return;
    }
    const newPos: cords = { x: mouse.x - grabbedAtX, y: mouse.y - grabbedAtY };
    movedTablet!.style.left = newPos.x + "px";
    movedTablet!.style.top = newPos.y + "px";
    for (let line of lines) {
      line.update();
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

function save() {
  if (!tablets.length && !lines.length) return;
  const JSONdata = {
    tablets: tablets.map((t) => ({
      id: t.id,
      name: (t.el?.querySelector(".header h1") as HTMLElement | null)
        ?.innerText,
      content: (t.el?.querySelector(".body") as HTMLElement | null)?.innerText,
      notes: (t.el?.querySelector(".footer") as HTMLElement | null)?.innerText,
      pos: t.pos,
      color: (t.el?.querySelector(".header") as HTMLElement | null)?.style
        .backgroundColor,
    })),
    lines: lines.map((l) => ({
      tab1Id: l.Tab1.id,
      tab2Id: l.Tab2.id,
    })),
  };
  fetch("dash-api.php", {
    method: "POST",
    body: JSON.stringify({ action: "save", data: JSONdata }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error:", error);
    });
}

function saveLoop() {
  save();
  console.log("Auto-saved dashboard data.");
  setTimeout(saveLoop, 600000);
}

function lighten(hex: string, amt: number = 0.4) {
  let r, g, b;
  if (hex.startsWith("rgb")) {
    const rgb = hex?.match(/\d+/g)?.map(Number);
    r = rgb?.[0];
    g = rgb?.[1];
    b = rgb?.[2];
  } else {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const num = parseInt(hex, 16);
    r = (num >> 16) & 0xff;
    g = (num >> 8) & 0xff;
    b = num & 0xff;
  }
  r = Math.round(r! + (255 - r!) * amt);
  g = Math.round(g! + (255 - g!) * amt);
  b = Math.round(b! + (255 - b!) * amt);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function createTablet(
  id = String(Date.now()),
  name = "New Tablet",
  content = "",
  notes = "",
  color = "#3498db",
  pos: cords = { x: 100, y: 100 },
) {
  const newTablet = document.createElement("div");
  newTablet.className = "tablet tablet-part";
  newTablet.id = id;
  newTablet.style.display = "block";
  newTablet.style.position = "absolute";
  newTablet.style.left = pos.x + "px";
  newTablet.style.top = pos.y + "px";
  newTablet.innerHTML = `
    <div class="header tablet-part" style="background-color:${color};"><h1>${name}</h1></div>
    <div class="body tablet-part" style="background-color:${lighten(color)};">${content}</div>
    <div class="footer tablet-part" style="background-color:${color};">${notes}</div>
  `;
  document.body.appendChild(newTablet);
  const t = new Tablet(newTablet.id, pos);
  tablets.push(t);
  return t;
}

function createLine(tab1: Tablet, tab2: Tablet) {
  const l = new Line(tab1, tab2);
  lines.push(l);
  return l;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("dash-api.php", {
    method: "POST",
    body: JSON.stringify({ action: "load" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      tablets = [];
      if (!data) return;
      tablets = data.tablets.map((tData: dataTablet) => {
        return createTablet(
          tData.id,
          tData.name,
          tData.content,
          tData.notes,
          tData.color,
          tData.pos,
        );
      });
      lines = data.lines.map((lData: dataLine) => {
        return createLine(
          tablets.find((t) => t.id == lData.tab1Id)!,
          tablets.find((t) => t.id == lData.tab2Id)!,
        );
      });
    });
  saveLoop();

  // event listeners are handled by Tablet instances

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let clicked: HTMLElement | null = null;

  const am = document.getElementById("action-menu") as HTMLElement | null;
  const add = document.getElementById("add-tablet") as HTMLElement | null;
  const del = document.getElementById("delete-tablet") as HTMLElement | null;
  const ch = document.getElementById("edit-tablet") as HTMLElement | null;
  const saveBoard = document.getElementById("save-board") as HTMLElement | null;
  saveBoard!.addEventListener("click", () => {
    save();
    am!.style.display = "none";
  });

  const addConn = document.getElementById(
    "add-connections",
  ) as HTMLElement | null;
  const removeConns = document.getElementById(
    "remove-connections",
  ) as HTMLElement | null;
  const changeForm = document.getElementById(
    "ch-tablet-form",
  ) as HTMLFormElement;
  const connectForm = document.getElementById(
    "connect-form",
  ) as HTMLFormElement;
  //const saveBoard = document.getElementById("save-board") as HTMLElement | null;

  //saveBoard!.addEventListener("click", () => {
  //  save();
  //  am!.style.display = "none";
  //});

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    clicked = document.elementFromPoint(mouse.x, mouse.y) as HTMLElement;
    clicked = clicked?.closest(".tablet") as HTMLElement | null;
    const tab_req = document.querySelector(".tablet-req") as HTMLElement;
    if (!clicked || !clicked.classList.contains("tablet-part")) {
      clicked = null;
      tab_req!.style.display = "none";
    } else {
      tab_req!.style.display = "block";
    }
    am!.style.display = "block";
    am!.style.top = mouse.y - 5 + "px";
    am!.style.left = mouse.x - 5 + "px";
    moving = false;
  });

  am!.addEventListener("mouseleave", () => {
    am!.style.display = "none";
  });
  add!.addEventListener("click", () => {
    createTablet(String(Date.now()), "New Tablet", "Content", "Notes");
    am!.style.display = "none";
  });
  del!.addEventListener("click", () => {
    if (clicked && clicked.classList.contains("tablet")) {
      document.body.removeChild(clicked);
      tablets = tablets.filter((t) => t.id != clicked?.id);
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (line?.Tab1.id == clicked.id || line?.Tab2.id == clicked.id) {
          document.getElementById("lines-svg")!.removeChild(line.el);
          lines.splice(i, 1);
        }
      }
    }
    am!.style.display = "none";
  });
  ch!.addEventListener("click", () => {
    am!.style.display = "none";
    const mpop = document.getElementById("mpop");
    document.getElementById("mpop-title")!.innerText = "Edit Tablet";
    mpop!.style.display = "block";
    mpop!.style.top = mouse.y - 5 + "px";
    mpop!.style.left = mouse.x - 5 + "px";
    const mpopedit = document.getElementById("mpop-edit");
    mpopedit!.style.display = "block";
    (document.getElementById("chId") as HTMLInputElement)!.value = clicked!.id;
    (document.getElementById("chTitle") as HTMLInputElement)!.value =
      (clicked?.querySelector(".header h1") as HTMLElement | null)!.innerText;
    (document.getElementById("chContent") as HTMLInputElement)!.value =
      (clicked?.querySelector(".body") as HTMLElement | null)!.innerText;
    (document.getElementById("chNotes") as HTMLInputElement)!.value =
      (clicked?.querySelector(".footer") as HTMLElement | null)!.innerText;
    am!.style.display = "none";
  });
  addConn!.addEventListener("click", () => {
    am!.style.display = "none";
    const mpop = document.getElementById("mpop");
    document.getElementById("mpop-title")!.innerText = "Connect Tablet";
    document.getElementById("mpop-connect")!.style.display = "block";
    mpop!.style.display = "block";
    mpop!.style.top = mouse.y - 5 + "px";
    mpop!.style.left = mouse.x - 5 + "px";
  });
  removeConns!.addEventListener("click", () => {
    am!.style.display = "none";
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (line?.Tab1.id == clicked?.id || line?.Tab2.id == clicked?.id) {
        document.getElementById("lines-svg")!.removeChild(line!.el);
        lines.splice(i, 1);
      }
    }
  });
  changeForm!.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = changeForm.chId.value;
    const title = changeForm.chTitle.value;
    const content = changeForm.chContent.value;
    const notes = changeForm.chNotes.value;
    const color = changeForm.chColor.value;
    if (id && title && content && notes && color) {
      for (let t of tablets) {
        if (t.id == clicked?.id) {
          t.update(id, title, content, notes);
          (t.el!.querySelector(
            ".header",
          ) as HTMLElement)!.style.backgroundColor = color;
          (t.el!.querySelector(
            ".body",
          ) as HTMLElement | null)!.style.backgroundColor = lighten(color, 0.4);
          (t.el!.querySelector(
            ".footer",
          ) as HTMLElement)!.style.backgroundColor = color;
        }
      }
    }
    document.getElementById("mpop")!.style.display = "none";
    document.getElementById("mpop-edit")!.style.display = "none";
    document.getElementById("mpop-dash-settings")!.style.display = "none";
  });
  connectForm!.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("mpop")!.style.display = "none";
    document.getElementById("mpop-connect")!.style.display = "none";
    const connect = connectForm.connect.value;
    if (connect) {
      for (let t1 of tablets) {
        if (t1.id == clicked?.id) {
          for (let t2 of tablets) {
            if (t2.id == connect && t1.id != t2.id) {
              createLine(t1, t2);
            }
          }
        }
      }
    }
  });
});
