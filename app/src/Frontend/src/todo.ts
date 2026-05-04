/*import { Todo } from "./classes";

let todos: Todo[] = [];

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
*/
