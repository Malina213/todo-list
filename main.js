
const form = document.querySelector('#form'); // через # поиско по id
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList') 
const emptyList = document.querySelector('#emptyList')

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList()

// Добавление задачи
form.addEventListener('submit', addTask)

// Удаление задачи 
tasksList.addEventListener('click', deleteTask)

 //Отмечаем задачу выполненной
tasksList.addEventListener('click', doneTask)


//Функции
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Достаем текст задачи из поля ввода
	const taskText = taskInput.value;

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// Добавляем задачу в массив с задачами
	tasks.push(newTask);

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	// Рендерим задачу на странице
	renderTask(newTask);

	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}
function deleteTask(event){

	if(event.target.dataset.action !== 'delete') return;
	// находим тег li(closest ищет среди родителей )
	const parenNode = event.target.closest('.list-group-item');
     //ID задачи
    const id = Number(parenNode.id)

    //  //Удаляем задачу из массива с задачами tasks = []
    tasks = tasks.filter((task)=> task.id !== id);

    saveToLocalStorage()

    parenNode.remove();
	
    checkEmptyList()
}

function doneTask(event){


    if(event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

	const id = Number(parentNode.id);
 	const task = tasks.find((task)=> task.id === id);
    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    const buttontoggle = parentNode.querySelector('.btn-circle');
   
    buttontoggle.classList.toggle('btn-circle--toggle');
    taskTitle.classList.toggle('task-title--done');

}

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `
                 <li id="emptyList" class="list-group-item empty-list">
                        <p class="task-title">No todos!</p>
                </li>`
        tasksList.insertAdjacentHTML('afterbegin',emptyListHTML)
    }else{
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(){
     localStorage.setItem('tasks',JSON.stringify(tasks))
}

function renderTask(task) {
	// Формируем CSS класс
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Формируем разметку для новой задачи
	const taskHTML = 
                 `<li id="${task.id}" class="list-group-item">
                    <button type="button" data-action="done" class="btn-circle btn-bg"></button>
                    <span class="${cssClass}">${task.text}</span>
                    <button type="button" data-action="delete" class="btn-action btn-bg">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </li> `;

	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}




