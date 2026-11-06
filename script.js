document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'todo-list-tasks';
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const pendingCount = document.getElementById('pending-count');

  const defaultTasks = [
    { id: 1, text: 'Edit Video', completed: false },
    { id: 2, text: 'Buy Eggs & Milk', completed: true },
    { id: 3, text: 'Organize Files', completed: false },
    { id: 4, text: 'Write Blog Post', completed: false }
  ];

  // carga tareas desde el almacenamiento local o usa las tareas predeterminadas si no hay datos guardados
  let tasks = loadTasks();

  renderTasks();

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }

  function toggleTask(id) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }

  function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) return defaultTasks;

    try {
      const parsedTasks = JSON.parse(storedTasks);
      if (!Array.isArray(parsedTasks)) return defaultTasks;

      return parsedTasks.filter(task =>
        task &&
        Number.isFinite(task.id) &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean'
      );
    } catch (error) {
      console.error('No se pudieron cargar las tareas guardadas.', error);
      return defaultTasks;
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('No se pudieron guardar las tareas.', error);
    }
  }

  function updatePendingCounter() {
    const count = tasks.filter(task => !task.completed).length;
    pendingCount.textContent = count;
  }

  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <div class="task-content">
          <div class="custom-checkbox"></div>
          <span class="task-text">${task.text}</span>
        </div>
        <div class="actions">
          <button class="action-btn delete-btn" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      const contentArea = li.querySelector('.task-content');
      contentArea.addEventListener('click', () => toggleTask(task.id));

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });

    updatePendingCounter();
  }
});