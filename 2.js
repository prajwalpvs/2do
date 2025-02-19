
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            todoItem.innerHTML = `
                <span>${todo.text}</span>
                <div>
                    <button class="btn btn-success me-2" onclick="toggleTodo(${index})">
                        ${todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });
    }

    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }

    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Make functions available globally
    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    // Initial render
    renderTodos();
});