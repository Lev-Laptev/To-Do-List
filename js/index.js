document.addEventListener("DOMContentLoaded", function() {
    const clear = document.querySelector('.app__clear');
    const dateElement = document.querySelector('.app__date');
    const list = document.querySelector('.app__list');
    const input = document.querySelector('.app__input');
    const button =  document.querySelector('.app__control i');

    const CHECK = 'fa-check-circle';
    const UNCHECK = 'fa-circle-thin';
    const LINE_THROUGH = 'lineThrough';

    let LIST, id;

    let data = localStorage.getItem('TODO');

    if (data) {
        LIST = JSON.parse(data);
        id = LIST.length;
        
        loadList(LIST);
    } else {
        LIST = [];
        id = 0;
    }

    function loadList(array) {
        array.forEach(function(item) {
            addToDo(item.name, item.id, item.done, item.trash);
        });
    }

    clear.addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    });

    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    };
    const today = new Date();

    dateElement.innerHTML = today.toLocaleDateString('ru-RU', options);

    function addToDo(toDo, id, done, trash) {
        if (trash) {
            return;
        }

        const DONE = done ? CHECK : UNCHECK;
        const LINE = done ? LINE_THROUGH : '';

        const item = `
            <li class="app__item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="app__text ${LINE}">${toDo}</p>
                <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
            </li>
        `;

        const position = 'beforeend';

        list.insertAdjacentHTML(position, item);
    }

    document.addEventListener('keyup', function(event) {
        if (event.keyCode == 13) {
            createToDo();
        }
    });

    button.addEventListener('click', function() {
        if(input.value) {
            createToDo();
        }
    });

    function createToDo() {
        const toDo = input.value;

        if (toDo) {
            addToDo(toDo, id, false, false);

            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });

            localStorage.setItem('TODO', JSON.stringify(LIST));

            id++;
        }

        input.value = '';
    }

    function completeToDo(element) {
        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector('.app__text').classList.toggle(LINE_THROUGH);

        LIST[element.id].done = LIST[element.id].done ? false : true;
    }

    function removeToDo(element) {
        element.parentNode.parentNode.removeChild(element.parentNode);

        LIST[element.id].trash = true;
    }

    list.addEventListener('click', function(event) {
        const element = event.target;
        const elementJob = element.attributes.job.value;

        if (elementJob == 'complete') {
            completeToDo(element);
        } else if (elementJob == 'delete') {
            removeToDo(element);
        }

        localStorage.setItem('TODO', JSON.stringify(LIST));
    });
});