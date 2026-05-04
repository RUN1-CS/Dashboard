import { Todo } from "./classes.js";

let todos: Todo[] = [];

function save() {
  if (!todos.length) return;
  const JSONdata = {
    todos: todos.map((t) => ({
      id: t.id,
      done: t.done,
      text: t.text,
    })),
  };
  fetch("dash-api.php", {
    method: "POST",
    body: JSON.stringify({ action: "save", type: "todo", data: JSONdata }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error:", error);
    });
}

addEventListener("DOMContentLoaded", () => {
  fetch("dash-api.php", {
    method: "POST",
    body: JSON.stringify({ action: "load", type: "todo" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      todos = [];
      if (!data) return;
      if (data.todos) {
        todos = data.todos.map((tData: any) => {
          return createTodo(tData.id, tData.done, tData.text);
        });
      }
    });

  function createTodo(id: string, done: boolean, text: string) {
    const todo = new Todo(id, done, text);
    const newId = Date.now().toString();
    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.id = "todo-" + newId;
    newTask.innerHTML = `
    <input type="checkbox" id="checkbox-${newId}">
    <span class="tasktext">${text}</span>
    <span class="delete-task" style="cursor:pointer;">&times;</span>
  `;
    const deleteBtn = newTask.querySelector(".delete-task");
    deleteBtn!.addEventListener("click", () => {
      todoList!.removeChild(newTask);
      todos = todos.filter((t) => t.id != String(newId));
    });
    todoList!.appendChild(newTask);
    todos.push(todo);
    const checkbox = newTask.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;
    checkbox!.addEventListener("change", () => {
      if (checkbox!.checked) {
        todo.done = true;
        newTask.classList.add("done");
      } else {
        todo.done = false;
        newTask.classList.remove("done");
      }
    });
    return todo;
  }
  const saveBoard = document.getElementById("save") as HTMLElement | null;
  saveBoard!.addEventListener("click", () => {
    save();
  });

  const todoList = document.getElementById("todo-list");
  const existingTasks = todoList!.querySelectorAll(".task");
  existingTasks.forEach((task) => {
    const id = task.id.replace("todo-", "");
    const t = new Todo(id);
    todos.push(t);
  });
  const addTask = document.getElementById("add-todo");
  addTask!.addEventListener("click", () => {
    const text = document.getElementById("new-todo") as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    const taskText = text!.value.trim();
    if (taskText === "") return;
    text!.value = "";
    createTodo(Date.now().toString(), false, taskText);
  });
  todos.forEach((t) => {
    const task = document.getElementById(`todo-${t.id}`);
    if (!task) return;
    const checkbox = task.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;
    if (checkbox) {
      checkbox!.addEventListener("change", () => {
        if (checkbox!.checked) {
          t.done = true;
          task.classList.add("done");
        } else {
          t.done = false;
          task.classList.remove("done");
        }
      });
    }
  });

  // Will be moved into account center when I make one
  const logoutBtn = document.getElementById("logout") as HTMLElement | null;
  logoutBtn!.addEventListener("click", () => {
    fetch("dash-api.php", {
      method: "POST",
      body: JSON.stringify({ action: "logout" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "logged_out") {
          window.location.href = "login.php";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
