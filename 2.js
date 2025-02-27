document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');
    const filterPriority = document.getElementById('filterPriority');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const todoStats = document.getElementById('todoStats');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
    }

    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const highPriority = todos.filter(todo => todo.priority === 'high').length;
        
        todoStats.innerHTML = `
            Total Tasks: ${total} | 
            Completed: ${completed} | 
            Pending: ${total - completed} | 
            High Priority: ${highPriority}
        `;
    }

    function getFilteredTodos() {
        return todos.filter(todo => {
            const priorityMatch = filterPriority.value === 'all' || todo.priority === filterPriority.value;
            const categoryMatch = filterCategory.value === 'all' || todo.category === filterCategory.value;
            const statusMatch = filterStatus.value === 'all' || 
                (filterStatus.value === 'completed' && todo.completed) ||
                (filterStatus.value === 'active' && !todo.completed);
            
            return priorityMatch && categoryMatch && statusMatch;
        });
    }

    function renderTodos() {
        const filteredTodos = getFilteredTodos();
        todoList.innerHTML = '';
        
        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
            
            const categoryColors = {
                personal: 'bg-primary',
                work: 'bg-warning',
                shopping: 'bg-info',
                health: 'bg-success'
            };

            todoItem.innerHTML = `
                <div>
                    <span>${todo.text}</span>
                    <span class="category-badge ${categoryColors[todo.category]}">${todo.category}</span>
                    <div class="todo-date">Created: ${new Date(todo.date).toLocaleString()}</div>
                </div>
                <div>
                    <button class="btn btn-sm btn-success me-2" onclick="toggleTodo(${index})">
                        ${todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTodo(${index})">Delete</button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                text,
                completed: false,
                priority: prioritySelect.value,
                category: categorySelect.value,
                date: new Date().toISOString()
            });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }

    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    [filterPriority, filterCategory, filterStatus].forEach(filter => {
        filter.addEventListener('change', renderTodos);
    });

    // Global functions
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
    updateStats();
});