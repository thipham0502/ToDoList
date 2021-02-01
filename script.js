'use strict';

const btnSlctAll = document.querySelector('.todo__select_all');
const inputToDo = document.querySelector('.todo__input');
const divTodoList = document.querySelector('.todo__list');
const divNavBar = document.getElementById('nav__bar');
const divItemLeft = document.getElementById('item__left');

// *Filter buttons*
const btnFltr_All = document.querySelector('.todo__filter_all');
const btnFltr_Actv = document.querySelector('.todo__filter_active');
const btnFltr_Cmpltd = document.querySelector('.todo__filter_completed');
const btnClearCmpltd = document.querySelector('.todo__clear_completed');

// *Filter areas*
const divTodo_All = document.querySelector('.todo__all');
const divTodo_Actv = document.querySelector('.todo__active');
const divTodo_Cmpltd = document.querySelector('.todo__completed');

const btnTest = document.querySelector('#button__test');

// Class for all todo items
class ToDo {
    constructor(id, itemId, content, isDone, isDeleted) {
        this.id = id;
        this.itemId = itemId;
        this.content = content;
        this.isDone = isDone;
        this.isDeleted = isDeleted;
    }
}
const todo_items = [];

// Function count the number of done/undone/deleted/undeleted items
const countItems = function(itemList, isDone, isDeleted) {
    // attr: isDone/isDeleted
    // val: true/false
    let count = 0;
    itemList.forEach(function(item) {
        // console.log('item', item, `item[${attr}]`, item[`${attr}`], 'val', val);
        if (item.isDone === isDone && item.isDeleted === isDeleted) {
            count += 1;
        }
    });
    return count;
};

// Function to update the number of done items
const updateNavigation = function(itemList) {
    // Undone items are items with isDone = false, isDeleted = true
    const undone = countItems(itemList, false, false);
    console.log('undone =', undone);

    // Deleted items are items with isDeleted = false
    const deleted =
        countItems(itemList, false, true) + countItems(itemList, true, true);

    if (deleted === itemList.length) {
        // If no items left
        /// Hide navigation bar
        divNavBar.classList.add('hidden');

        /// Hide button select__all
        btnSlctAll.classList.add('hidden');
    } else {
        if (undone > 1) divItemLeft.textContent = `${undone} items left`;
        else divItemLeft.textContent = `${undone} item left`;
    }
};

// Function to find the item with the given id
const findItemById = function(itemList, itemId) {
    console.log('itemList', itemList);
    console.log('itemId', itemId);

    // Loop to find the item with the given id (don't use forEach because it will not BREAK out and always loop for all items)
    for (const item of itemList) {
        if (item.itemId === itemId) {
            console.log('found', item);
            return item;
        }
    }
};

const createToDoItemHTML = function(id, type, content) {
    return `<div class="todo__item" id="item__${type}-${id}">
                <input class="todo__checkbox" type="checkbox" id="checkbox__${type}-${id}"/>
                <div class="todo__content" id="content__${type}-${id}">${content}</div>
                <button class="todo__delete" id="delete__${type}-${id}">X</button>
            </div>`;
};

btnTest.addEventListener('click', function() {
    const obj = findItemById(todo_items, 'item__2');
    console.log('test', obj);
});

// *Add new item to todo list*
inputToDo.addEventListener('keyup', function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();

        // Create new todo instance
        const newToDo = new ToDo(
            todo_items.length + 1,
            `item__${todo_items.length + 1}`,
            inputToDo.value,
            false,
            false
        );

        // Add to array
        todo_items.push(newToDo);
        console.log(todo_items);
        //*todo_items.push(`item__${todo_items.length + 1}`);
        //*undone_items.push(`item__${undone_items.length + 1}`);

        // Add new element to <div class="todo__list todo__all">
        const html1 = createToDoItemHTML(
            todo_items.length,
            'all', //type
            inputToDo.value
        );
        const html2 = createToDoItemHTML(
            todo_items.length,
            'actv', //type
            inputToDo.value
        );

        // divTodoList.insertAdjacentHTML('beforeend', html);
        divTodo_All.insertAdjacentHTML('beforeend', html1);
        divTodo_Actv.insertAdjacentHTML('beforeend', html2);

        // Add navigation bar
        divNavBar.classList.remove('hidden');

        // Show select all button
        btnSlctAll.classList.remove('hidden');

        // Update number of undone items
        updateNavigation(todo_items);

        // Empty input field
        inputToDo.value = '';
    }
    // console.log(todo_items);
});

// *Add event for checkbox using Event Delegation*
// *Add event for delete button using Event Delegation*
/// Step 1: Add event listener to the parent element of all the child elements we want to add event
divTodoList.addEventListener('click', function(e) {
    // '.todo__list' is the parent of '.todo__item'

    /// Step 2: If the e.target contains '.todo__checkbox' ie. if we click the checkbox
    if (e.target.classList.contains('todo__checkbox')) {
        const id = Number(e.target.id.split('-')[1]);
        console.log(`id = ${id}`);

        // Clicked item in the todo_items list (to update status)
        const currToDo = findItemById(todo_items, `item__${id}`);

        // Clicked item in the divTodo_All list (to change CSS)
        const currToDoAll = document.querySelector(`#item__all-${id}`);

        // Clicked item in the divTodo_Actv list
        const currToDoActv = document.querySelector(`#item__actv-${id}`);

        // Clicked item in the divTodo_Cmpltd list
        const currToDoCmpltd = document.querySelector(`#item__cmpltd-${id}`);

        // HTML copy of the element
        const currToDoActvHTML = createToDoItemHTML(
                id,
                'actv',
                currToDo.content
            ),
            currToDoCmpltdHTML = createToDoItemHTML(
                id,
                'cmpltd',
                currToDo.content
            );

        if (e.target.checked) {
            // Update status to isDone = true
            currToDo.isDone = true;

            // Remove item in 'Active' page
            divTodo_Actv.removeChild(currToDoActv);

            // Add item to 'Completed' page
            divTodo_Cmpltd.insertAdjacentHTML('beforeend', currToDoCmpltdHTML);

            // Update item's content CSS in 'All' & 'Completed' page
            divTodoList
                .querySelector(`#content__all-${id}`)
                .classList.add('done');
            divTodoList
                .querySelector(`#content__cmpltd-${id}`)
                .classList.add('done');

            console.log('currToDoAll', currToDoAll);
            console.log('currToDoActv', currToDoActv);

            // Update number of undone items
            updateNavigation(todo_items);
        } else {
            // Update status to isDone = false
            currToDo.isDone = false;

            // Add item in 'Active' page
            divTodo_Actv.insertAdjacentHTML('beforeend', currToDoActvHTML);

            // Remove item from 'Completed' page
            divTodo_Cmpltd.querySelector(`#item__cmpltd-${id}`).remove();

            // Update item's content CSS in 'All' & 'Completed' page
            divTodoList
                .querySelector(`#content__all-${id}`)
                .classList.remove('done');
            divTodoList
                .querySelector(`#content__cmpltd-${id}`)
                .classList.remove('done');

            console.log('currToDoAll', currToDoAll);
            console.log('currToDoActv', currToDoActv);
            console.log('currToDoActvHTML', currToDoActvHTML);

            // Update number of undone items
            updateNavigation(todo_items);
        }
    }

    // Delete button
    if (e.target.classList.contains('todo__delete')) {
        const id = Number(e.target.id.split('-')[1]),
            item_id = `item__${id}`;
        // console.log(`item_id = ${item_id}; id = ${id}`);

        // Clicked item in the todo_items list (to update status)
        const currToDo = findItemById(todo_items, `item__${id}`);

        // Clicked item in the divTodo_All list (to remove)
        const currToDoAll = document.querySelector(`#item__all-${id}`);

        // Clicked item in the divTodo_Actv list (to remove)
        const currToDoActv = document.querySelector(`#item__actv-${id}`);

        // Clicked item in the divTodo_Cmpltd list (to remove)
        const currToDoCmpltd = document.querySelector(`#item__cmpltd-${id}`);

        // Update status to isDeleted = true
        currItem.isDeleted = true;

        // Remove the item
        currToDoAll.remove();
        currToDoActv.remove();
        currToDoCmpltd.remove();

        // Update number of undone items
        updateNavigation(todo_items);
    }
});

// *Add event for button to select all checkboxes*
let isSelectedAll = false;
btnSlctAll.addEventListener('click', function(e) {
    //******** */
    console.log('e:', e.target, e.currentTarget);
    if (!isSelectedAll) {
        todo_items.forEach(function(item, i) {
            const id = item.id;

            // Add class 'done' for all
            document.getElementById(`checkbox__${id}`).checked = true;
            document.getElementById(`content__${id}`).classList.add('done');

            // Update item's isDone
            item.isDone = true;
        });
        isSelectedAll = !isSelectedAll;
    } else {
        todo_items.forEach(function(item, i) {
            const id = item.id;

            // Remove class 'done'
            document.getElementById(`checkbox__${id}`).checked = false;
            document.getElementById(`content__${id}`).classList.remove('done');

            // Update item's isDone
            item.isDone = false;
        });
    }

    // Update number of undone items
    updateNavigation(todo_items);

    console.log('todo_items');
    console.log(todo_items);
});

// Show all items
btnFltr_All.addEventListener('click', function(e) {
    e.preventDefault();
    // Set button active
    /// Remove all first and then add again
    btnFltr_All.classList.remove('active');
    btnFltr_Actv.classList.remove('active');
    btnFltr_Cmpltd.classList.remove('active');

    btnFltr_All.classList.add('active');

    // Remove class 'hidden' from all items
    divTodo_All.classList.remove('none');
    divTodo_Actv.classList.remove('none');
    divTodo_Cmpltd.classList.remove('none');

    // Add 'hidden' to divTodo_Actv and divTodo_Cmpltd
    divTodo_Actv.classList.add('none');
    divTodo_Cmpltd.classList.add('none');
});

// Show undone (active) items
btnFltr_Actv.addEventListener('click', function(e) {
    e.preventDefault();
    // Set button active
    /// Remove all first and then add again
    btnFltr_All.classList.remove('active');
    btnFltr_Actv.classList.remove('active');
    btnFltr_Cmpltd.classList.remove('active');

    btnFltr_Actv.classList.add('active');

    // Remove class 'hidden' from all items
    divTodo_All.classList.remove('none');
    divTodo_Actv.classList.remove('none');
    divTodo_Cmpltd.classList.remove('none');

    // Add 'hidden' to divTodo_All and divTodo_Cmpltd
    divTodo_All.classList.add('none');
    divTodo_Cmpltd.classList.add('none');
});

// Show done items
btnFltr_Cmpltd.addEventListener('click', function(e) {
    e.preventDefault();
    // Set button active
    /// Remove all first and then add again
    btnFltr_All.classList.remove('active');
    btnFltr_Actv.classList.remove('active');
    btnFltr_Cmpltd.classList.remove('active');

    btnFltr_Cmpltd.classList.add('active');

    // Remove class 'hidden' from all items
    divTodo_All.classList.remove('none');
    divTodo_Actv.classList.remove('none');
    divTodo_Cmpltd.classList.remove('none');

    // Add 'hidden' to divTodo_All and divTodo_Actv
    divTodo_All.classList.add('none');
    divTodo_Actv.classList.add('none');
});
