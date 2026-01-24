let mouse = { x: 0, y: 0 };
let moving = false;
let tablets = [];
let lines = [];
let todos = [];

const TheLine = document.getElementById("TheLine");

class Tablet {
  constructor(id) {
    this.id = String(id);
    this.el = document.getElementById(this.id);

    if (this.el) {
      this.el.addEventListener("mousedown", (e) => {
        const rect = this.el.getBoundingClientRect();
        const grabbedAtX = e.clientX - rect.left;
        const grabbedAtY = e.clientY - rect.top;
        moving = true;
        moveTablet(this.el, grabbedAtX, grabbedAtY);
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

class Todo {
  constructor(id) {
    this.id = String(id);
    this.el = document.getElementById("todo-" + this.id);
    this.done = false;
    this.text =
      this.el && this.el.querySelector(".tasktext")
        ? this.el.querySelector(".tasktext").value
        : "";
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

function moveTablet(movedTablet, grabbedAtX = 150, grabbedAtY = 50) {
  let rafId;
  function loop() {
    if (!moving) {
      if (rafId) cancelAnimationFrame(rafId);
      return;
    }
    movedTablet.style.left = mouse.x - grabbedAtX + "px";
    movedTablet.style.top = mouse.y - grabbedAtY + "px";
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
const saveBoard = document.getElementById("save-board");
const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  fetch("dash-api.php", {
    method: "POST",
    body: JSON.stringify({ action: "logout" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((text) => {
      window.location.href = "index.php";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

saveBoard.addEventListener("click", () => {
  save();
  am.style.display = "none";
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  clicked = document.elementFromPoint(mouse.x, mouse.y);
  am.style.display = "block";
  am.style.top = mouse.y - 5 + "px";
  am.style.left = mouse.x - 5 + "px";
  moving = false;
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
    tablets = tablets.filter((t) => t.id != clicked.id);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (line.Tab1.id == clicked.id || line.Tab2.id == clicked.id) {
        document.getElementById("lines-svg").removeChild(line.el);
        lines.splice(i, 1);
      }
    }
  }
  am.style.display = "none";
});
ch.addEventListener("click", () => {
  am.style.display = "none";
  const mpop = document.getElementById("mpop");
  document.getElementById("mpop-title").innerText = "Edit Tablet";
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
  document.getElementById("mpop-title").innerText = "Connect Tablet";
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

function save() {
  const JSONdata = {
    tablets: tablets.map((t) => ({
      id: t.id,
      name: t.el.querySelector(".header h1").innerText,
      content: t.el.querySelector(".body").innerText,
      notes: t.el.querySelector(".footer").innerText,
      position: { x: parseInt(t.el.style.left), y: parseInt(t.el.style.top) },
      color: t.el.querySelector(".header").style.backgroundColor,
    })),
    lines: lines.map((l) => ({
      tab1Id: l.Tab1.id,
      tab2Id: l.Tab2.id,
    })),
    todos: todos.map((td) => ({
      id: td.id,
      text:
        td.el && td.el.querySelector(".tasktext")
          ? td.el.querySelector(".tasktext").innerText
          : "",
      done: td.done,
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
    .then((text) => {
      if (text) console.log("Success:", JSON.parse(text));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function saveLoop() {
  console.log("Auto-saved dashboard data.");
  setTimeout(saveLoop, 600000);
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
      if (!data) return;
      tablets = [];
      tablets = data.tablets.map((tData) => {
        const color = tData.color || "#3498db";
        const newTablet = tablet.cloneNode(true);
        newTablet.id = tData.id;
        newTablet.style.display = "block";
        document.body.appendChild(newTablet);
        const t = new Tablet(tData.id);
        t.update(tData.id, tData.name, tData.content, tData.notes);
        t.el.style.position = "absolute";
        t.el.style.left = tData.position.x + "px";
        t.el.style.top = tData.position.y + "px";
        t.el.style.backgroundColor = lighten(color, 0.4);
        t.el.querySelector(".header").style.backgroundColor = color;
        t.el.querySelector(".footer").style.backgroundColor = color;
        return t;
      });
      lines = data.lines.map((lData) => {
        const tab1 = tablets.find((t) => t.id == lData.tab1Id);
        const tab2 = tablets.find((t) => t.id == lData.tab2Id);
        if (tab1 && tab2) {
          return new Line(tab1, tab2);
        }
      });
      todos = data.todos.map((tdData) => {
        const newId = tdData.id;
        const newTask = document.createElement("div");
        newTask.className = "task";
        newTask.id = "todo-" + newId;
        newTask.innerHTML = `
          <input type="checkbox" id="checkbox-${newId}" ${
            tdData.done ? "checked" : ""
          }>
          <span class="tasktext"">${tdData.text}</span>
          <span class="delete-task" style="cursor:pointer;">&times;</span>`;
        const deleteBtn = newTask.querySelector(".delete-task");
        deleteBtn.addEventListener("click", () => {
          todoList.removeChild(newTask);
          todos = todos.filter((t) => t.id != String(newId));
        });
        todoList.appendChild(newTask);
        const t = new Todo(newId);
        const checkbox = newTask.querySelector('input[type="checkbox"]');
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            t.done = true;
            newTask.classList.add("done");
          } else {
            t.done = false;
            newTask.classList.remove("done");
          }
        });
        return t;
      });
      saveLoop();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function lighten(hex, amt = 0.4) {
  let r, g, b;
  if (hex.startsWith("rgb")) {
    const rgb = hex.match(/\d+/g).map(Number);
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
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
  r = Math.round(r + (255 - r) * amt);
  g = Math.round(g + (255 - g) * amt);
  b = Math.round(b + (255 - b) * amt);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const tasks = document.querySelectorAll(".task");
tasks.forEach((task) => {
  const checkbox = task.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        task.done = true;
        task.classList.add("done");
      } else {
        task.done = false;
        task.classList.remove("done");
      }
    });
  }
});

const todoList = document.getElementById("to-do-list");
const existingTasks = todoList.querySelectorAll(".task");
existingTasks.forEach((task) => {
  const id = task.id.replace("todo-", "");
  const t = new Todo(id);
  todos.push(t);
});
const addTask = document.getElementById("add-task");
addTask.addEventListener("click", () => {
  const taskTextInput = document.getElementById("newTaskText");
  const taskText = taskTextInput.value.trim();
  if (taskText === "") return;
  taskTextInput.value = "";
  const newId = Date.now();
  const newTask = document.createElement("div");
  newTask.className = "task";
  newTask.id = "todo-" + newId;
  newTask.innerHTML = `
    <input type="checkbox" id="checkbox-${newId}">
    <span class="tasktext">${taskText}</span>
    <span class="delete-task" style="cursor:pointer;">&times;</span>
  `;
  const deleteBtn = newTask.querySelector(".delete-task");
  deleteBtn.addEventListener("click", () => {
    todoList.removeChild(newTask);
    todos = todos.filter((t) => t.id != String(newId));
  });
  todoList.appendChild(newTask);
  const t = new Todo(newId);
  todos.push(t);
  const checkbox = newTask.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      t.done = true;
      newTask.classList.add("done");
    } else {
      t.done = false;
      newTask.classList.remove("done");
    }
  });
});
