document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress-inner');
    const progressNumbers = document.getElementById('numbers');

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const li = document.createElement('li');
        li.classList.add('task-item');
        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" class="task-checkbox">
                <span>${taskText}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        taskList.appendChild(li);
        taskInput.value = '';

        const deleteButton = li.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasksToLocalStorage();
        });

        const editButton = li.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            taskInput.value = li.querySelector('span').textContent;
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasksToLocalStorage();
        });

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            updateProgress();
            saveTasksToLocalStorage();
        });

        toggleEmptyState();
        updateProgress();
        saveTasksToLocalStorage();
    }

    function toggleEmptyState() {
        if (taskList.children.length === 0) {
            emptyImage.style.display = 'block';
        } else {
            emptyImage.style.display = 'none';
        }
    }

    function updateProgress() {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.task-checkbox:checked').length;
        const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        progressBar.style.width = `${progressPercentage}%`;
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (completedTasks === totalTasks && totalTasks > 0) {
            confetti();
        }
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.children).map(task => {
            return {
                text: task.querySelector('span').textContent,
                completed: task.querySelector('.task-checkbox').checked
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            taskInput.value = task.text;
            addTask();
            const lastTask = taskList.lastChild;
            if (task.completed) {
                const checkbox = lastTask.querySelector('.task-checkbox');
                checkbox.checked = true;
                lastTask.classList.add('completed');
            }
        });
        updateProgress();
    }

    loadTasksFromLocalStorage();
});


//register the service worker
if('serviceWorker' in navigator){
    window.addEventListener('load',() => {
        navigator.serviceWorker
        .register('/sw.js');
    });
}