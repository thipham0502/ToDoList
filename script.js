'use strict';

const elemInputTodo = document.querySelector('.input__todo');
const elemTodoList = document.querySelector('.todo__list');

let todo_items = [],
	checked_items = [];

// *Add new item to todo list*
elemInputTodo.addEventListener('keyup', function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();

		// Add to array
		todo_items.push(`item__${todo_items.length + 1}`);

		// Add new element to <div class="todo__list">
		const html = `
        <div class="todo__item" id="item__${todo_items.length}">
            <input class="todo__checkbox" type="checkbox" id="checkbox__${todo_items.length}"/>
            <div class="todo__content" id="content__${todo_items.length}">${elemInputTodo.value}</div>
            <button class="todo__delete" id="delete__${todo_items.length}">X</button>
        </div>`;
		elemTodoList.insertAdjacentHTML('beforeend', html);

		// Add navigation bar
		document.getElementById('nav__bar').classList.remove('hidden');

		// Show select all button
		document.getElementById('select__all').classList.remove('hidden');

		// *Add event for checkbox*
		document.getElementById(`checkbox__${todo_items.length}`).onclick = function(e) {
			// If a row is checked --> Add its id to the list containing all selected ids
			// Get Id of the clicked checkbox
			const id = e.target.id.split('__')[1],
				item_id = `item__${id}`;
			console.log(`item_id = ${item_id}; id = ${id}`);

			if (e.target.checked) {
				// Add id to the list containing all selected ids
				checked_items.push(item_id);
				document.getElementById(`content__${id}`).classList.add('content--done');
				console.log(document.getElementById(`content__${id}`));
			} else {
				// If unchecked a row --> Remove it from the list containing all selected ids
				const index = checked_items.indexOf(item_id);
				if (index !== -1) {
					checked_items.splice(index, 1);
				}

				document.getElementById(`content__${id}`).classList.remove('content--done');
			}
			console.log('checked_items');
			console.log(checked_items);
		};

		// *Add event for delete button*
		const todo__delete = document.getElementById(`delete__${todo_items.length}`);
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
				index2 = checked_items.indexOf(item_id);
			if (index1 !== -1) {
				todo_items.splice(index1, 1);
			}
			if (index2 !== -1) {
				checked_items.splice(index2, 1);
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
			console.log('checked_items');
			console.log(checked_items);
		});

		// Empty input field
		elemInputTodo.value = '';
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
			document.getElementById(`content__${id}`).classList.add('content--done');
		});
		checked_items = todo_items;
		isSelectedAll = !isSelectedAll;

		console.log('todo_items');
		console.log(todo_items);
		console.log('checked_items');
		console.log(checked_items);
	} else {
		todo_items.forEach(function(item, i) {
			const id = item.split('__')[1];

			document.getElementById(`checkbox__${id}`).checked = false;
			document.getElementById(`content__${id}`).classList.remove('content--done');
		});
		checked_items = [];

		console.log('todo_items');
		console.log(todo_items);
		console.log('checked_items');
		console.log(checked_items);
	}
});
