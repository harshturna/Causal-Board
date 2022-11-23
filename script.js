const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listCoumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

// Drag Functionality
let draggedItem;
let currentColumn;



// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {

    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Breakfast', 'Sit back and relax'];
    progressListArray = ['Work', 'Listen to music'];
    completeListArray = ['Read', 'Have Coffee'];
    onHoldListArray = ['Being uncool'];
  }
}




function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];


  for (let index=0; index< arrayNames.length; index++){
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(listArrays[index]));
  }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  columnEl.appendChild(listEl);
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

  // Call getSavedColumns if updateOnLoad is false
  updatedOnLoad || getSavedColumns();
  
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=> {
    createItemEl(backlogList, 0, backlogItem, index);
  });


  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index)=> {
    createItemEl(progressList, 0, progressItem, index);
  });

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index)=> {
    createItemEl(completeList, 0, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index)=> {
    createItemEl(onHoldList, 0, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

//Add to column list, Rest textbox

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}


// Allows array to reflect Drag and Drop items
function rebuildArrays() {


  backlogListArray = [];
  for (let i = 0; i< backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }


  progressListArray = [];
  for (let i = 0; i< progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for (let i = 0; i< completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for (let i = 0; i< onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}



// For dragging items
function drag(e) {
  draggedItem = e.target;
  }

// Allow draggable items to drop
function allowDrop(e) {
  e.preventDefault();
}

// When draggable item enters column area
function dragEnter(column) {
  listCoumns[column].classList.add('over');
  currentColumn = column;
}

// Drop draggable item in column
function drop(e) {
  e.preventDefault();
  // Add item to column
  const parent = listCoumns[currentColumn];
  parent.appendChild(draggedItem);

  //Remove background color/padding
  listCoumns.forEach((column)=>{
    column.classList.remove('over');
  });

  rebuildArrays();
}




// on Load 
updateDOM()

