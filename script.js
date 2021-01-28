'use strict';

const elmTodoInput = document.querySelector('.todo__input');
const elmTodoList = document.querySelector('.todo__list');

// Class for all todo items
class ToDo {
    constructor(content, isDone, isDeleted) {
        this.content = content;
        this.isDone = isDone;
        this.isDeleted = isDeleted;
    }
}
let todo_items = [],
    done_items = [],
    undone_items = [];

// Function count the number of done/undone/deleted/undeleted items
function countItems(itemList, attr, val) {
    // attr: isDone/isDeleted
    // val: true/false
    let count = 0;
    itemList.forEach(function(item, i) {
        if (item.attr === val) count++;
    });
    return count;
}

// *Add new item to todo list*
elmTodoInput.addEventListener('keyup', function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();

        // Create new todo instance
        const newToDo = new ToDo(elmTodoInput.value, false, false);

        // Add to array
        todo_items.push(newToDo);
        //*todo_items.push(`item__${todo_items.length + 1}`);
        //*undone_items.push(`item__${undone_items.length + 1}`);

        // Add new element to <div class="todo__list">
        const html = `
        <div class="todo__item" id="item__${todo_items.length}">
            <input class="todo__checkbox" type="checkbox" id="checkbox__${todo_items.length}"/>
            <div class="todo__content" id="content__${todo_items.length}">${elmTodoInput.value}</div>
            <button class="todo__delete" id="delete__${todo_items.length}">X</button>
        </div>`;
        elmTodoList.insertAdjacentHTML('beforeend', html);

        // Add navigation bar
        document.getElementById('nav__bar').classList.remove('hidden');

        // Show select all button
        document.getElementById('select__all').classList.remove('hidden');

        // Update number of undone items
        const undone = countItems(todo_items, isDone, false);

        //* undone_items.length > 1 ? document.getElementById('item__left').textContent = `${undone_items.length} items left`:document.getElementById('item__left').textContent = `${undone_items.length} item left`;

        // *Add event for checkbox*
        document.getElementById(
            `checkbox__${todo_items.length}`
        ).onclick = function(e) {
            // If a row is checked --> Add its id to the list containing all selected ids
            // Get Id of the clicked checkbox
            const id = e.target.id.split('__')[1],
                item_id = `item__${id}`;
            console.log(`item_id = ${item_id}; id = ${id}`);

            if (e.target.checked) {
                // Add id to the list containing all selected ids
                done_items.push(item_id);

                // Remove from array of undone items
                const index = undone_items.indexOf(item_id);
                if (index !== -1) {
                    undone_items.splice(index, 1);
                }

                document.getElementById(`content__${id}`).classList.add('done');
                console.log(document.getElementById(`content__${id}`));

                // Update number of items
                undone_items.length > 1
                    ? (document.getElementById(
                          'item__left'
                      ).textContent = `${undone_items.length} items left`)
                    : (document.getElementById(
                          'item__left'
                      ).textContent = `${undone_items.length} item left`);
            } else {
                // If unchecked a row --> Remove it from the list containing all selected ids
                const index = done_items.indexOf(item_id);
                if (index !== -1) {
                    done_items.splice(index, 1);
                }
                // Add id to the list containing all undone items
                undone_items.push(item_id);

                document
                    .getElementById(`content__${id}`)
                    .classList.remove('done');
                // Update number of items
                undone_items.length > 1
                    ? (document.getElementById(
                          'item__left'
                      ).textContent = `${undone_items.length} items left`)
                    : (document.getElementById(
                          'item__left'
                      ).textContent = `${undone_items.length} item left`);
            }
            console.log('done_items');
            console.log(done_items);
            console.log('undone_items');
            console.log(undone_items);
        };

        // *Add event for delete button*
        const todo__delete = document.getElementById(
            `delete__${todo_items.length}`
        );
        todo__delete.addEventListener('click', function(e) {
            e.preventDefault();
            // Get the target i.e. the clicked button
            // console.log(`e.target: ${e.target}`);
            // console.log(e.target.id);

            // Get Id of the clicked checkbox
            const id = e.target.id.split('__')[1],
                item_id = `item__${id}`;
            console.log(`item_id = ${item_id}; id = ${id}`);

            // Remove the item with id
            document.getElementById(item_id).remove();

            // Remove element from array
            const index1 = todo_items.indexOf(item_id),
                index2 = done_items.indexOf(item_id);
            if (index1 !== -1) {
                todo_items.splice(index1, 1);
            }
            if (index2 !== -1) {
                done_items.splice(index2, 1);
            }

            // If no items left:
            if (todo_items.length == 0) {
                // Hide navigation bar
                document.getElementById('nav__bar').classList.add('hidden');

                // Hide select all button
                document.getElementById('select__all').classList.add('hidden');
            }
            console.log('todo_items');
            console.log(todo_items);
            console.log('done_items');
            console.log(done_items);
        });

        // Empty input field
        elmTodoInput.value = '';
    }
});

// *Click select all*
let isSelectedAll = false;
const btnSelectAll = document.querySelector('.todo__select-all');
btnSelectAll.addEventListener('click', function(e) {
    if (!isSelectedAll) {
        // console.log('select all:');
        // console.log(todo_items);

        todo_items.forEach(function(item, i) {
            const id = item.split('__')[1];

            document.getElementById(`checkbox__${id}`).checked = true;
            document.getElementById(`content__${id}`).classList.add('done');
        });
        done_items = todo_items;
        isSelectedAll = !isSelectedAll;

        console.log('todo_items');
        console.log(todo_items);
        console.log('done_items');
        console.log(done_items);
    } else {
        todo_items.forEach(function(item, i) {
            const id = item.split('__')[1];

            document.getElementById(`checkbox__${id}`).checked = false;
            document.getElementById(`content__${id}`).classList.remove('done');
        });
        done_items = [];

        console.log('todo_items');
        console.log(todo_items);
        console.log('done_items');
        console.log(done_items);
    }
});
