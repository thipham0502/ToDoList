'use strict';

const btnSlctAll = document.querySelector('.todo__select_all');
const elmTodoInput = document.querySelector('.todo__input');
const elmTodoList = document.querySelector('.todo__list');
const elmNavBar = document.getElementById('nav__bar');
const elmItemLeft = document.getElementById('item__left');

// *Filter buttons*
const btnFltr_All = document.querySelector('.todo__filter_all');
const btnFltr_Actv = document.querySelector('.todo__filter_active');
const btnFltr_Cmpltd = document.querySelector('.todo__filter_completed');
const btnClearCmpltd = document.querySelector('.todo__clear_completed');

// *Filter areas*
const divFltr_All = document.querySelector('.todo__all');
const divFltr_Actv = document.querySelector('.todo__active');
const divFltr_Cmpltd = document.querySelector('.todo__completed');

const btnTest = document.querySelector('#button__test');

// Class for all todo items
class ToDo {
    constructor(id, content, isDone, isDeleted) {
        this.id = id;
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
        elmNavBar.classList.add('hidden');

        /// Hide button select__all
        btnSlctAll.classList.add('hidden');
    } else {
        if (undone > 1) elmItemLeft.textContent = `${undone} items left`;
        else elmItemLeft.textContent = `${undone} item left`;
    }
};

// Function to find the item with the given id
const findItemById = function(itemList, id) {
    // console.log('itemList', itemList);

    // Loop to find the item with the given id (don't use forEach because it will not BREAK out and always loop for all items)
    for (const item of itemList) {
        if (item.id === id) {
            // console.log('found', item);
            return item;
        }
    }
};

btnTest.addEventListener('click', function() {
    const obj = findItemById(todo_items, 2);
    console.log('test', obj);
});

// *Add new item to todo list*
elmTodoInput.addEventListener('keyup', function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();

        // Create new todo instance
        const newToDo = new ToDo(
            todo_items.length + 1,
            elmTodoInput.value,
            false,
            false
        );

        // Add to array
        todo_items.push(newToDo);
        console.log(todo_items);
        //*todo_items.push(`item__${todo_items.length + 1}`);
        //*undone_items.push(`item__${undone_items.length + 1}`);

        // Add new element to <div class="todo__list todo__all">
        const html = `
        <div class="todo__item" id="item__${todo_items.length}">
            <input class="todo__checkbox" type="checkbox" id="checkbox__${todo_items.length}"/>
            <div class="todo__content" id="content__${todo_items.length}">${elmTodoInput.value}</div>
            <button class="todo__delete" id="delete__${todo_items.length}">X</button>
        </div>`;
        elmTodoList.insertAdjacentHTML('beforeend', html);

        // Add navigation bar
        elmNavBar.classList.remove('hidden');

        // Show select all button
        btnSlctAll.classList.remove('hidden');

        // Update number of undone items
        updateNavigation(todo_items);

        // Empty input field
        elmTodoInput.value = '';
    }
    // console.log(todo_items);
});

// *Add event for checkbox using Event Delegation*
// *Add event for delete button using Event Delegation*
/// Step 1: Add event listener to the parent element of all the child elements we want to add event
elmTodoList.addEventListener('click', function(e) {
    // '.todo__list' is the parent of '.todo__item'

    /// Step 2: If the e.target contains '.todo__checkbox' ie. if we click the checkbox
    if (e.target.classList.contains('todo__checkbox')) {
        const id = Number(e.target.id.split('__')[1]),
            item_id = `item__${id}`;
        // console.log(`item_id = ${item_id}; id = ${id}`);

        if (e.target.checked) {
            // Update status to isDone = true
            const currItem = findItemById(todo_items, id);
            currItem.isDone = true;

            document.getElementById(`content__${id}`).classList.add('done');
            console.log(document.getElementById(`content__${id}`));

            // Update number of undone items
            updateNavigation(todo_items);
        } else {
            // Update status to isDone = false
            const currItem = findItemById(todo_items, id);
            currItem.isDone = false;

            document.getElementById(`content__${id}`).classList.remove('done');
            console.log(document.getElementById(`content__${id}`));

            // Update number of undone items
            updateNavigation(todo_items);
        }
    }
    if (e.target.classList.contains('todo__delete')) {
        const id = Number(e.target.id.split('__')[1]),
            item_id = `item__${id}`;
        // console.log(`item_id = ${item_id}; id = ${id}`);

        // Update status to isDeleted = true
        const currItem = findItemById(todo_items, id);
        currItem.isDeleted = true;

        // Remove the item with id
        document.getElementById(item_id).remove();

        // Update number of undone items
        updateNavigation(todo_items);
    }
});

// *Add event for button to select all checkboxes*
let isSelectedAll = false;
btnSlctAll.addEventListener('click', function(e) {
    if (!isSelectedAll) {
        todo_items.forEach(function(item, i) {
            const id = item.id;

            // Add class 'done'
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

    // Show all items (remove class 'hidden' from all items)
    document.querySelectorAll('.todo__item').forEach(function(item) {
        item.classList.remove('hidden');
    });
});

// Show undone items
btnFltr_Actv.addEventListener('click', function(e) {
    e.preventDefault();
    // Set button active
    /// Remove all first and then add again
    btnFltr_All.classList.remove('active');
    btnFltr_Actv.classList.remove('active');
    btnFltr_Cmpltd.classList.remove('active');

    btnFltr_Actv.classList.add('active');

    // Set all DONE items to 'hidden', remove 'hidden' from all UNDONE items
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

    // Show <div class="todo__list todo__completed"> and hide others
    /// Remove all first and then add again
    divFltr_All.classList.remove('hidden');
    divFltr_Actv.classList.remove('hidden');
    divFltr_Cmpltd.classList.remove('hidden');

    divFltr_All.classList.add('hidden');
    divFltr_Actv.classList.add('hidden');
});
