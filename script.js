'use strict';

const btnSlctAll = document.querySelector('.todo__select_all');
const inputToDo = document.querySelector('.todo__input');
const divTodoList = document.querySelector('.todo__list');
const divNavBar = document.getElementById('nav__bar');
const divItemLeft = document.getElementById('item__left');

// *Filter buttons*
const btnFltr_All = document.querySelector('.todo__filter_all');
const btnFltr_Actv = document.querySelector('.todo__filter_actv');
const btnFltr_Cmpltd = document.querySelector('.todo__filter_cmpltd');
const btnClearCmpltd = document.querySelector('.todo__clear_cmpltd');

// *Filter areas*
const divTodo_All = document.querySelector('.todo__all');
const divTodo_Actv = document.querySelector('.todo__active');
const divTodo_Cmpltd = document.querySelector('.todo__completed');

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
    // Add the item and the input element (but hide it)

    return `<div class="todo__item" id="item__${type}-${id}">
                <input class="todo__checkbox" type="checkbox" id="checkbox__${type}-${id}"/>
                <div class="todo__content" id="content__${type}-${id}">${content}</div>
                <button class="todo__delete" id="delete__${type}-${id}">X</button>
            </div>
            <!--<div class="todo__edit none" id="edit__${type}-${id}">-->
            <input class="todo__edit none" type="text" id="textbox__${type}-${id}" autofocus>
            <!--</div>-->`;
};

// *Add new item to todo list*
inputToDo.addEventListener('keyup', function(e) {
    // Number 13 is the "Enter" key on the keyboard
    if (e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault();

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
/// Step 1: Add event listener to the parent element of all the child elements we want to add event
divTodoList.addEventListener('change', function(e) {
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
            //divTodo_Actv.removeChild(currToDoActv);
            divTodo_Actv
                .querySelector(`#item__actv-${id}`)
                .classList.add('none');

            // Add item to 'Completed' page if item not exists, else, just show it
            if (!divTodo_Cmpltd.querySelector(`#item__actv-${id}`)) {
                divTodo_Cmpltd.insertAdjacentHTML(
                    'beforeend',
                    currToDoCmpltdHTML
                );
            } else {
                divTodo_Cmpltd
                    .querySelector(`#item__actv-${id}`)
                    .classList.remove('none');
            }

            // Update item's content CSS in 'All' & 'Completed' page
            divTodoList
                .querySelector(`#content__all-${id}`)
                .classList.add('done');
            divTodoList
                .querySelector(`#content__cmpltd-${id}`)
                .classList.add('done');
            divTodoList.querySelector(`#checkbox__all-${id}`).checked = true;
            divTodoList.querySelector(`#checkbox__cmpltd-${id}`).checked = true;

            console.log('currToDoAll', currToDoAll);
            console.log('currToDoActv', currToDoActv);

            // Update number of undone items
            updateNavigation(todo_items);
        } else {
            // Update status to isDone = false
            currToDo.isDone = false;

            // Add item in 'Active' page
            //divTodo_Actv.insertAdjacentHTML('beforeend', currToDoActvHTML);
            divTodo_Actv
                .querySelector(`#item__actv-${id}`)
                .classList.remove('none');
            // Uncheck checkbox
            divTodo_All.querySelector(`#checkbox__all-${id}`).checked = false;
            divTodo_Actv.querySelector(`#checkbox__actv-${id}`).checked = false;

            // Remove item from 'Completed' page
            divTodo_Cmpltd
                .querySelector(`#item__cmpltd-${id}`)
                .classList.add('none');

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
});

// *Add event for delete button using Event Delegation*
divTodoList.addEventListener('click', function(e) {
    // Delete button
    if (e.target.classList.contains('todo__delete')) {
        const id = Number(e.target.id.split('-')[1]),
            item_id = `item__${id}`;
        console.log(`-*-*-item_id = ${item_id}; id = ${id}-*-*-`);

        // Clicked item in the todo_items list (to update status)
        const currToDo = findItemById(todo_items, `item__${id}`);

        // Clicked item in the divTodo_All list (to remove)
        const currToDoAll = document.querySelector(`#item__all-${id}`);

        // Clicked item in the divTodo_Actv list (to remove)
        const currToDoActv = document.querySelector(`#item__actv-${id}`);

        // Clicked item in the divTodo_Cmpltd list (to remove)
        const currToDoCmpltd = document.querySelector(`#item__cmpltd-${id}`);

        // Update status to isDeleted = true
        currToDo.isDeleted = true;

        // Remove the item
        if (currToDoAll) currToDoAll.classList.add('none');
        if (currToDoActv) currToDoActv.classList.add('none');
        if (currToDoCmpltd) currToDoCmpltd.classList.add('none');

        // Update number of undone items
        updateNavigation(todo_items);
    }
});

// *Add double click event for items using Event Delegation*
divTodoList.addEventListener('dblclick', function(e) {
    // Double click to edit item
    if (e.target.classList.contains('todo__content')) {
        const id = Number(e.target.id.split('-')[1]),
            item_id = `item__${id}`;
        let currContent = '';
        let type = '';
        if (btnFltr_All.classList.contains('active')) type = 'all';
        if (btnFltr_Actv.classList.contains('active')) type = 'actv';
        if (btnFltr_Cmpltd.classList.contains('active')) type = 'cmpltd';

        // Get current content
        const currItem = divTodo_All.querySelector(`#item__${type}-${id}`);
        const currTextBox = divTodo_All.querySelector(
            `#textbox__${type}-${id}`
        );

        currContent = divTodo_All.querySelector(`#content__${type}-${id}`)
            .textContent;
        console.log('currContent', currContent);
        // Hide item, show edit
        currItem.classList.add('none');
        currTextBox.classList.remove('none');
        currTextBox.value = currContent;
        currTextBox.focus();
    }
});

// *Add keypress event to edit items using Event Delegation*
divTodoList.addEventListener('keyup', function(e) {
    // Press Enter to change item's content
    // Number 13 is the "Enter" key on the keyboard
    if (e.target.classList.contains('todo__edit') && e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        const id = Number(e.target.id.split('-')[1]),
            item_id = `item__${id}`;
        let type = '';
        if (btnFltr_All.classList.contains('active')) type = 'all';
        if (btnFltr_Actv.classList.contains('active')) type = 'actv';
        if (btnFltr_Cmpltd.classList.contains('active')) type = 'cmpltd';

        // Get current item
        const currToDo = findItemById(todo_items, `item__${id}`);
        const currItem = divTodoList.querySelector(`#item__${type}-${id}`);
        const currTextBox = divTodoList.querySelector(
            `#textbox__${type}-${id}`
        );

        // Get new content value
        const newContent = divTodoList.querySelector(`#textbox__${type}-${id}`)
            .value;
        console.log('newContent', newContent);

        // Update new content
        const currContent = divTodoList.querySelector(
            `#content__${type}-${id}`
        );
        currContent.textContent = newContent;
        currToDo.content = newContent;

        // Update content on other page
        const allContent = divTodoList.querySelector(`#content__all-${id}`),
            actvContent = divTodoList.querySelector(`#content__actv-${id}`),
            cmpltdContent = divTodoList.querySelector(`#content__cmpltd-${id}`);
        switch (type) {
            case 'all':
                if (actvContent) actvContent.textContent = newContent;
                if (cmpltdContent) cmpltdContent.textContent = newContent;

            case 'actv':
                if (allContent) allContent.textContent = newContent;
                if (cmpltdContent) cmpltdContent.textContent = newContent;

            case 'cmpltd':
                if (allContent) allContent.textContent = newContent;
                if (actvContent) actvContent.textContent = newContent;
        }

        // Hide edit, show item
        currItem.classList.remove('none');
        currTextBox.classList.add('none');
    }
});

// *Add event for button to select all checkboxes*
let isSelectedAll = false;
btnSlctAll.addEventListener('click', function(e) {
    console.log('e:', e.target, e.currentTarget);
    console.log('isSelectedAll', isSelectedAll);

    const done_items = todo_items.filter(item => !item.isDone),
        undone_items = todo_items.filter(item => item.isDone);
    console.log('done_items', done_items);
    console.log('undone_items', undone_items);

    if (!isSelectedAll) {
        done_items.forEach(function(item, i) {
            const id = item.id;
            console.log(`#checkbox__actv-${id}`);

            // Add class 'done' for all
            divTodo_All.querySelector(`#checkbox__all-${id}`).checked = true;
            divTodo_All
                .querySelector(`#content__all-${id}`)
                .classList.add('done');
            divTodo_Actv.querySelector(`#checkbox__actv-${id}`).checked = true;
            divTodo_Actv
                .querySelector(`#content__actv-${id}`)
                .classList.add('done');

            // Remove from "Active" tab
            divTodo_Actv
                .querySelector(`#item__actv-${id}`)
                .classList.add('none');

            // Add item to 'Completed' page if item not exists, else, just show it
            const currToDo = findItemById(todo_items, `item__${id}`);
            const currToDoCmpltdHTML = createToDoItemHTML(
                id,
                'cmpltd',
                currToDo.content
            );
            if (!divTodo_Cmpltd.querySelector(`#item__cmpltd-${id}`)) {
                divTodo_Cmpltd.insertAdjacentHTML(
                    'beforeend',
                    currToDoCmpltdHTML
                );
                divTodo_Cmpltd
                    .querySelector(`#content__cmpltd-${id}`)
                    .classList.add('done');
                divTodo_Cmpltd.querySelector(
                    `#checkbox__cmpltd-${id}`
                ).checked = true;
            } else {
                divTodo_Cmpltd
                    .querySelector(`#item__cmpltd-${id}`)
                    .classList.remove('none');
            }

            // Update item's isDone
            item.isDone = true;
        });
    } else {
        undone_items.forEach(function(item, i) {
            const id = item.id;

            // Remove class 'done'
            divTodo_All.querySelector(`#checkbox__all-${id}`).checked = false;
            divTodo_All
                .querySelector(`#content__all-${id}`)
                .classList.remove('done');

            // Remove from "Completed" page
            divTodo_Cmpltd
                .querySelector(`#item__cmpltd-${id}`)
                .classList.add('none');

            // Add to "Active" page
            divTodo_Actv
                .querySelector(`#item__actv-${id}`)
                .classList.remove('none');
            divTodo_Actv
                .querySelector(`#content__actv-${id}`)
                .classList.remove('done');
            divTodo_Actv.querySelector(`#checkbox__actv-${id}`).checked = false;

            // Update item's isDone
            item.isDone = false;
        });
    }

    // Update state
    isSelectedAll = !isSelectedAll;

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

/* *************** CLEAR COMPLETED *************** */
btnClearCmpltd.addEventListener('click', function(e) {
    console.log('Clicked', e.target);
    const done_items = todo_items.filter(
        item => item.isDone && !item.isDeleted
    );

    done_items.forEach(function(item, i) {
        const id = item.id;
        // Clicked item in the todo_items list (to update status)
        const currToDo = findItemById(todo_items, `item__${id}`);

        // Clicked item in the divTodo_All list (to remove)
        const currToDoAll = document.querySelector(`#item__all-${id}`);

        // Clicked item in the divTodo_Actv list (to remove)
        const currToDoActv = document.querySelector(`#item__actv-${id}`);

        // Clicked item in the divTodo_Cmpltd list (to remove)
        const currToDoCmpltd = document.querySelector(`#item__cmpltd-${id}`);

        // Update status to isDeleted = true
        currToDo.isDeleted = true;

        // Remove the item
        if (currToDoAll) currToDoAll.classList.add('none');
        if (currToDoActv) currToDoActv.classList.add('none');
        if (currToDoCmpltd) currToDoCmpltd.classList.add('none');
    });
});
